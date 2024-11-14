
export default class StickyNoteHandler{
  constructor(errorHandler){
    this.errorHandler = errorHandler;
  }
  
  stickToBoardBtn = document.getElementById("add")
  newStickyInput = document.getElementById("new-post-input")
  toDoBoard = document.getElementById("container")
  doneBoard = document.getElementById("done-container")
  trashIcon = document.getElementById("reset-board")
  doneBoardTrashIcon = document.getElementById("reset-done-board")
  toggle = false;

  
  addEventListeners(){
    this.addEventStickToBoard()
    this.addEventResetBoard()
    this.addEventResetDoneBoard()
    this.addEventEnterKeyInputField()
  }
  
  addEventStickToBoard(){
    this.stickToBoardBtn.addEventListener("click", (() => {
      if(this.toDoBoard.children.length >= 18) {
        this.errorHandler.boardIsFullError()
        return
      }
      if(!this.newStickyInput.value){
        this.errorHandler.emptyInputError()
        this.newStickyInput.focus()
        return 
      } 
      this.styleAndAppendStickyNote()
      this.errorHandler.removeErrorMessages()
      this.newStickyInput.value = ""
      this.newStickyInput.focus()   
    }))      
  }
 
  createStickyNote(){
    const rnd = Math.floor(Math.random() * 31) - 15
    const stickyNote = document.createElement("div")
    const stickyNoteText = document.createElement("div")

    stickyNoteText.innerText = this.newStickyInput.value
    stickyNote.id = `${this.newStickyInput.value.slice(0, 5)}${rnd}`
    stickyNote.classList.add("sticky-note")
    stickyNote.classList.add(`ver${Math.floor(Math.random() * 10) + 1}`)
    stickyNote.style.transform = `rotate(${rnd}deg)`
    stickyNote.appendChild(stickyNoteText)
    return stickyNote
  } 

  styleAndAppendStickyNote(){
    const btnContainer = this.createButtonContainer()
    const stickyNote = this.createStickyNote()
    
    const handleClick = (e) => {
      const mainBoardNotes = this.toDoBoard.children
      const secondBoardNotes = this.doneBoard.children
      for (let i = 0; i < mainBoardNotes.length; i++) {
        if(mainBoardNotes[i] != e.target && mainBoardNotes[i].contentEditable !== "true"){
          mainBoardNotes[i].classList.remove("active")
          // mainBoardNotes[i].children[0].classList.remove("active")
        }
      }
      for (let i = 0; i < secondBoardNotes.length; i++) {
        if(secondBoardNotes[i] != e.target && secondBoardNotes[i].contentEditable !== "true"){
          secondBoardNotes[i].classList.remove("active")
          // secondBoardNotes[i].children[0].classList.remove("active")
        }
      }
      if(stickyNote == e.target && e.currentTarget.contentEditable !== "true"){
        stickyNote.classList.toggle("active")
        // btnContainer.classList.toggle("active")
      }
    }
    stickyNote.addEventListener("click", handleClick)
    this.expandStickyOnClick(stickyNote.firstElementChild)
    stickyNote.appendChild(btnContainer)
    this.toDoBoard.appendChild(stickyNote)
  }
  
  addEventResetBoard(){
    this.trashIcon.addEventListener("click", (() => {
      this.toDoBoard.innerHTML = ""
      this.errorHandler.removeErrorMessages()
    }))
  }
  
  addEventResetDoneBoard(){
    this.doneBoardTrashIcon.addEventListener("click", (() => {
      this.doneBoard.innerHTML = ""
      this.errorHandler.removeErrorMessages()
    }))
  }
  
  addEventEnterKeyInputField(){  
    this.newStickyInput.addEventListener("keydown", ((e) => {
      if (e.key === "Enter") {
        this.stickToBoardBtn.click()
      }
    }))
  }

  removeSticky(btn){
    btn.addEventListener("click", ((e) => {
      e.currentTarget.parentNode.parentNode.remove()
    }))
  }

  preventRemovalOfBtnContainer(currentTarget){
    currentTarget.addEventListener('keydown', function(event) {
      const buttonContainer = event.currentTarget.querySelector(".button-container")
      const divChildren = event.currentTarget.querySelectorAll("div")
      let hasText = false;
      
      for (let i = 0; i < divChildren.length; i++) {
        if(divChildren[i].innerText !== "\n"){
          hasText = true;
          break
        }
      }
  
      if (event.key === 'Backspace' || event.key === 'Delete') {
        if (document.activeElement.contains(buttonContainer) && !hasText) {
          event.preventDefault();
        }
      }
    });
    
  }

  editSticky(btn){
    btn.addEventListener("click", ((e) => {
      const currentTarget = e.currentTarget.parentNode.parentNode
      const divChildren = currentTarget.querySelectorAll("div")
      this.preventRemovalOfBtnContainer(currentTarget)
      let hasText = this.hasInnerText(currentTarget)
      
      if(!hasText){
          this.errorHandler.emptyEditError()
          currentTarget.focus()
          btn.innerText = "SAVE"
          e.stopPropagation()
          return
      }

      currentTarget.contentEditable = !this.toggle

      if(currentTarget.contentEditable == "true"){
        currentTarget.focus()
        btn.innerText = "SAVE"
      } else {
        btn.innerText = "EDIT"
      }
      for (let i = 0; i < divChildren.length; i++) {
        this.expandStickyOnClick(divChildren[i])
      }
      this.toggle = !this.toggle
      e.stopPropagation()
      this.errorHandler.removeErrorMessages()
    }))
  }

  expandStickyOnClick(element){
    element.addEventListener("click", (e) => {
      if(element.contentEditable !== "true"){
        element.parentNode.classList.toggle("active")
        e.stopPropagation()
      }
    })
  }
        

  hasInnerText(currentTarget){
    const divChildren = currentTarget.querySelectorAll("div")
      let hasText = false;
      
      for (let i = 0; i < divChildren.length; i++) {
        if(divChildren[i].innerText !== "\n"){
          hasText = true
          break
        }
      }
      return hasText
  }

  stickyDone(btn){
    btn.addEventListener("click", ((e) => {
      const currentTarget = e.currentTarget.parentNode.parentNode
      const buttonContainer = e.target.parentNode
      let hasText = this.hasInnerText(currentTarget)

      if(!hasText){
        this.errorHandler.emptyEditError()
        currentTarget.focus()
        btn.innerText = "SAVE"
        e.stopPropagation()
        return
      }

      if(this.doneBoard.children.length >= 12) {
        this.errorHandler.doneBoardIsFullError()
        return
      }

      buttonContainer.parentNode.classList.remove("active")
      this.doneBoard.appendChild(buttonContainer.parentNode)
      buttonContainer.children[0].remove()
      this.errorHandler.removeErrorMessages()
    }))
  }

  createButtonContainer(){
    let container = document.createElement("section")
    let removeBtn = document.createElement("button")
    let editBtn = document.createElement("button")
    let doneBtn = document.createElement("button")

    container.className = ("button-container")
    container.contentEditable = false
    
    editBtn.id = "edit"
    doneBtn.id = "done"
    removeBtn.id = "remove"
    
    editBtn.innerText = "EDIT"
    removeBtn.innerText = "REMOVE"
    doneBtn.innerText = "DONE"

    this.editSticky(editBtn)
    this.removeSticky(removeBtn)
    this.stickyDone(doneBtn)
    
    container.append(doneBtn, editBtn, removeBtn)

    return container
  }

}
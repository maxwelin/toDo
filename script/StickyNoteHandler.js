export default class StickyNoteHandler{
  constructor(errorHandler){
    this.errorHandler = errorHandler;
  }
  
  toDoBoard = document.getElementById("container")
  doneBoard = document.getElementById("done-container")
  trashIcon = document.getElementById("reset-board")
  stickToBoardBtn = document.getElementById("add")
  newStickyInput = document.getElementById("new-post-input")
  doneBoardTrashIcon = document.getElementById("reset-done-board")
  toggleContentEditable = false;

  
  addEventListeners(){
    this.addEventStickToBoardButton()
    this.addEventResetBoard()
    this.addEventResetDoneBoard()
    this.addEventEnterKeyInputField()
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

  styleAndStickToBoard(){
    const btnContainer = this.createButtonContainer()
    const stickyNote = this.createStickyNote()
    
    stickyNote.addEventListener("click", ((e) => {
      const mainBoardStickyNotes = this.toDoBoard.children
      const secondBoardStickyNotes = this.doneBoard.children
      
      this.removeActiveClass(mainBoardStickyNotes, e)
      this.removeActiveClass(secondBoardStickyNotes, e)

      if(stickyNote == e.target && e.target.contentEditable !== "true"){
        stickyNote.classList.toggle("active")
        btnContainer.classList.toggle("active")
      }
    }))
    this.expandStickyOnClick(stickyNote.firstElementChild)
    stickyNote.appendChild(btnContainer)
    this.toDoBoard.appendChild(stickyNote)
  }

  removeActiveClass(notes, e){
    for (let i = 0; i < notes.length; i++) {
      if(notes[i] !== e.target && notes[i].contentEditable !== "true"){
        notes[i].classList.remove("active")
        notes[i].querySelector(".button-container").classList.remove("active")
      }
    }
  }
   
  addEventStickToBoardButton(){
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
      this.styleAndStickToBoard()
      this.errorHandler.removeErrorMessages()
      this.newStickyInput.value = ""
      this.newStickyInput.focus()   
    }))      
  }
  
  addEventEnterKeyInputField(){  
    this.newStickyInput.addEventListener("keydown", ((e) => {
      if (e.key === "Enter") {
        this.stickToBoardBtn.click()
      }
    }))
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
  

  removeSticky(btn){
    btn.addEventListener("click", ((e) => {
      const buttonContainer = e.currentTarget.parentNode
      if(buttonContainer.parentNode.contentEditable == "true"){
        buttonContainer.children[1].click()
      }
      buttonContainer.parentNode.remove()
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
      const stickyNote = e.currentTarget.parentNode.parentNode
      const divChildren = stickyNote.querySelectorAll("div")
      this.preventRemovalOfBtnContainer(stickyNote)
      let hasText = this.hasInnerText(stickyNote)
      
      if(!hasText){
          this.errorHandler.emptyEditError()
          stickyNote.focus()
          btn.innerText = "SAVE"
          e.stopPropagation()
          return
      }

      stickyNote.contentEditable = !this.toggleContentEditable

      if(stickyNote.contentEditable == "true"){
        stickyNote.focus()
        btn.innerText = "SAVE"
      } else {
        btn.innerText = "EDIT"
      }
      for (let i = 0; i < divChildren.length; i++) {
        this.expandStickyOnClick(divChildren[i])
      }
      this.toggleContentEditable = !this.toggleContentEditable
      e.stopPropagation()
      this.errorHandler.removeErrorMessages()
    }))
  }

  expandStickyOnClick(element){
    element.addEventListener("click", (e) => {
      if(element.contentEditable !== "true"){
        element.parentNode.classList.toggle("active")
        element.parentNode.querySelector(".button-container").classList.toggle("active")
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
      const stickyNote = e.currentTarget.parentNode.parentNode
      const buttonContainer = e.target.parentNode
      let hasText = this.hasInnerText(stickyNote)

      if(!hasText){
        this.errorHandler.emptyEditError()
        stickyNote.focus()
        btn.innerText = "SAVE"
        e.stopPropagation()
        return
      }

      if(this.doneBoard.children.length >= 12) {
        this.errorHandler.doneBoardIsFullError()
        return
      }
      
      if(buttonContainer.parentNode.contentEditable == "true"){
        buttonContainer.children[1].click()
      }

      stickyNote.classList.remove("active")
      buttonContainer.classList.remove("active")
      buttonContainer.children[0].remove()
    
      this.doneBoard.appendChild(stickyNote)
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
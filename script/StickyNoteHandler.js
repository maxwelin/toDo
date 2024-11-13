
export default class StickyNoteHandler{
  constructor(errorHandler){
    this.errorHandler = errorHandler;
  }
  
  addBtn = document.getElementById("add")
  inputNewSticky = document.getElementById("new-post-input")
  container = document.getElementById("container")
  doneContainer = document.getElementById("done-container")
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
    this.addBtn.addEventListener("click", (() => {
      if(this.container.children.length >= 18) {
        this.errorHandler.boardIsFullError()
        return
      }
      if(!this.inputNewSticky.value){
        this.errorHandler.emptyInputError()
        this.inputNewSticky.focus()
        return 
      } 
      this.styleAndAppendStickyNote()
      this.errorHandler.removeErrorMessages()
      this.inputNewSticky.value = ""
      this.inputNewSticky.focus()   
    }))      
  }
 
  createStickyNote(){
    const rnd = Math.floor(Math.random() * 31) - 15
    const stickyNote = document.createElement("div")
    const stickyNoteText = document.createElement("div")

    stickyNoteText.innerText = this.inputNewSticky.value
    stickyNote.id = `${this.inputNewSticky.value.slice(0, 5)}${rnd}`
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
      const mainBoardNotes = this.container.children
      const secondBoardNotes = this.doneContainer.children
      for (let i = 0; i < mainBoardNotes.length; i++) {
        if(mainBoardNotes[i] != e.target && mainBoardNotes[i].contentEditable !== "true"){
          mainBoardNotes[i].classList.remove("active")
          mainBoardNotes[i].children[0].classList.remove("active")
        }
      }
      for (let i = 0; i < secondBoardNotes.length; i++) {
        if(secondBoardNotes[i] != e.target && secondBoardNotes[i].contentEditable !== "true"){
          secondBoardNotes[i].classList.remove("active")
          secondBoardNotes[i].children[0].classList.remove("active")
        }
      }
      if(stickyNote == e.target && e.currentTarget.contentEditable !== "true"){
        stickyNote.classList.toggle("active")
        btnContainer.classList.toggle("active")
      }
    }
    stickyNote.addEventListener("click", handleClick)
    stickyNote.appendChild(btnContainer)
    this.container.appendChild(stickyNote)
  }
  
  addEventResetBoard(){
    this.trashIcon.addEventListener("click", (() => {
      this.container.innerHTML = ""
      this.errorHandler.removeErrorMessages()
    }))
  }
  
  addEventResetDoneBoard(){
    this.doneBoardTrashIcon.addEventListener("click", (() => {
      this.doneContainer.innerHTML = ""
      this.errorHandler.removeErrorMessages()
    }))
  }
  
  addEventEnterKeyInputField(){  
    this.inputNewSticky.addEventListener("keydown", ((e) => {
      if (e.key === "Enter") {
        this.addBtn.click()
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
      const childDivs = event.currentTarget.querySelectorAll("div")
      let hasText = false;
      
      for (let i = 0; i < childDivs.length; i++) {
        if(childDivs[i].innerText !== "\n"){
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
      const childDivs = currentTarget.querySelectorAll("div")
      this.preventRemovalOfBtnContainer(currentTarget)
      let hasText = false;
      
      for (let i = 0; i < childDivs.length; i++) {
        if(childDivs[i].innerText !== "\n"){
          hasText = true
          break
        }
      }
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
      this.toggle = !this.toggle
      //!!!!!!!!!---------DISABLE OTHER EVENTLISTENERS AND REENABLE THEM WHEN DONE EDITING?!!-------------
      e.stopPropagation()
      this.errorHandler.removeErrorMessages()
    }))
  }

  stickyDone(btn){
    btn.addEventListener("click", ((e) => {
      const currentTarget = e.currentTarget.parentNode.parentNode

      if(currentTarget.firstElementChild.innerText === "\n"){
        this.errorHandler.emptyEditError()
        currentTarget.focus()
        e.stopPropagation()
        return
      }

     if(this.doneContainer.children.length >= 12) {
      this.errorHandler.doneBoardIsFullError()
      return
      }
      e.target.parentNode.parentNode.classList.remove("active")
      this.doneContainer.appendChild(e.target.parentNode.parentNode)
      e.target.parentNode.children[0].remove()

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

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

    stickyNote.innerText = this.inputNewSticky.value
    stickyNote.id = `${this.inputNewSticky.value.slice(0, 5)}${rnd}`
    stickyNote.classList.add("sticky-note")
    stickyNote.classList.add(`ver${Math.floor(Math.random() * 10) + 1}`)
    stickyNote.style.transform = `rotate(${rnd}deg)`
    return stickyNote
  } 

  styleAndAppendStickyNote(){
    const btnContainer = this.createButtonContainer()
    const stickyNote = this.createStickyNote()
    
    stickyNote.addEventListener("click", ((e) => {
      const mainBoardNotes = this.container.children
      const secondBoardNotes = this.doneContainer.children
      for (let i = 0; i < mainBoardNotes.length; i++) {
        if(mainBoardNotes[i] != e.target){
          mainBoardNotes[i].classList.remove("active")
          mainBoardNotes[i].children[0].classList.remove("active")
        }
      }
      for (let i = 0; i < secondBoardNotes.length; i++) {
        if(secondBoardNotes[i] != e.target){
          secondBoardNotes[i].classList.remove("active")
          secondBoardNotes[i].children[0].classList.remove("active")
        }
      }
      if(stickyNote == e.target){
        stickyNote.classList.toggle("active")
        btnContainer.classList.toggle("active")
      }
    }))
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

  editSticky(btn){
    btn.addEventListener("click", ((e) => {
      const currentTarget = e.currentTarget.parentNode.parentNode
      
      if(currentTarget.innerText === "\n"){
        console.log("big true")
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
    }))
  }

  stickyDone(btn){
    btn.addEventListener("click", ((e) => {
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
    let container = document.createElement("div")
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
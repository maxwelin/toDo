export default class StickyNoteHandler{
  
  list = document.getElementById("container")
  addBtn = document.getElementById("add")
  inputNewSticky = document.getElementById("new-post-input")
  container = document.getElementById("container")
  errorMessages = document.getElementById("error-messages")
  trashIcon = document.getElementById("reset-board")
  slapSound = new Audio("../punch.wav")
  toggle = false;

  eventStickToBoard(){
    this.addBtn.addEventListener("click", (() => {
      if(this.container.children.length >= 18) {
        this.boardIsFullError()
        if(this.errorMessages.innerHTML && !this.errorMessages.classList.contains("visible")){
          this.playSlapSound()
          this.errorMessages.classList.add("visible")
        } return }

      if(!this.inputNewSticky.value){
        this.emptyInputError()
        if(this.errorMessages.innerHTML && !this.errorMessages.classList.contains("visible")){
          this.playSlapSound()
          this.errorMessages.classList.add("visible")
        } return }
      
      this.styleAndAppendStickyNote()
      this.removeErrorMessages()
      // this.inputNewSticky.value = ""
      
    }))
    
  }
  
  emptyInputError(){
    this.errorMessages.innerHTML = 
    `<p>Don't waste sticky notes!<br>
        Write something before sticking it to the board.</p>`
  }

  boardIsFullError(){
    this.errorMessages.innerHTML = 
    `<p>Board is full!<br>
      Get to work!</p>`
  }

  removeErrorMessages(){
    setTimeout(() => {
      this.errorMessages.innerHTML = ""
      this.errorMessages.classList.remove("visible")
    }, 200)
  }

  playSlapSound(){
    setTimeout(() => {
      this.slapSound.volume = 0.2
      this.slapSound.play()
    }, 60)
  }

  createStickyNote(){
    const stickyNote = document.createElement("div")
    stickyNote.innerText = this.inputNewSticky.value
    stickyNote.classList.add("sticky-note")
    stickyNote.classList.add(`ver${Math.floor(Math.random() * 10) + 1}`)
    stickyNote.style.transform = `rotate(${Math.floor(Math.random() * 31) - 15}deg)`
    return stickyNote
  }

  styleAndAppendStickyNote(){
    const btnContainer = this.createButtonContainer()
    const stickyNote = this.createStickyNote()

    stickyNote.addEventListener("click", (() => {
      for (let i = 0; i < this.list.children.length; i++) {
        this.list.children[i].classList.remove("active")
        this.list.children[i].children[0].classList.remove("active")
      }
      btnContainer.classList.toggle("active")
      stickyNote.classList.add("active")
    }))
    stickyNote.appendChild(btnContainer)
    this.list.appendChild(stickyNote)
  }

  eventResetBoard(){
    this.trashIcon.addEventListener("click", (() => {
      this.container.innerHTML = ""
      this.removeErrorMessages()
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
      currentTarget.contentEditable = !this.toggle
      
      if(btn.innerText == "Edit note"){
          currentTarget.focus()
          btn.innerText = "Done? ✓"
        } else {
          btn.innerText = "Edit note"
        }

        this.toggle = !this.toggle
    }))
  }

  stickyDone(btn){
    btn.addEventListener("click", (() => {
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
    editBtn.innerText = "Edit note"
    this.editSticky(editBtn)
    
    removeBtn.id = "remove"
    removeBtn.innerText = "Remove note"
    this.removeSticky(removeBtn)

    doneBtn.id = "done"
    doneBtn.innerText = "Done with task"
    this.stickyDone(doneBtn)

    container.append(removeBtn, editBtn, doneBtn)

    return container
  }

}
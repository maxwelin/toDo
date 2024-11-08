
export default class StickyNoteHandler{
  
  addBtn = document.getElementById("add")
  inputNewSticky = document.getElementById("new-post-input")
  container = document.getElementById("container")
  doneContainer = document.getElementById("done-container")
  errorMessages = document.getElementById("error-messages")
  trashIcon = document.getElementById("reset-board")
  doneBoardTrashIcon = document.getElementById("reset-done-board")
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

  doneBoardIsFullError(){
    this.errorMessages.innerHTML = 
    `<p>Can't you see the board is full?<br>
      You gotta remove<br>
      some sticky notes!</p>`
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
      for (let i = 0; i < this.container.children.length; i++) {
        if(this.container.children[i] != e.target){
          this.container.children[i].classList.remove("active")
          this.container.children[i].children[0].classList.remove("active")
        }
      }
      for (let i = 0; i < this.doneContainer.children.length; i++) {
        if(this.doneContainer.children[i] != e.target){
          this.doneContainer.children[i].classList.remove("active")
          this.doneContainer.children[i].children[0].classList.remove("active")
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

  eventResetBoard(){
    this.trashIcon.addEventListener("click", (() => {
      this.container.innerHTML = ""
      this.removeErrorMessages()
    }))
  }

  eventResetDoneBoard(){
    this.doneBoardTrashIcon.addEventListener("click", (() => {
      this.doneContainer.innerHTML = ""
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

      if(currentTarget.contentEditable == "true"){
        currentTarget.focus()
        btn.innerText = "DONE?"
      } else {
        btn.innerText = "EDIT"
      }
      this.toggle = !this.toggle
    }))
  }

  stickyDone(btn){
    btn.addEventListener("click", ((e) => {
     if(this.doneContainer.children.length >= 12) {
       this.doneBoardIsFullError()
       if(this.errorMessages.innerHTML && !this.errorMessages.classList.contains("visible")){
        this.playSlapSound()
        this.errorMessages.classList.add("visible")
        } return }

      e.target.parentNode.parentNode.classList.remove("active")
      this.doneContainer.appendChild(e.target.parentNode.parentNode)
      e.target.parentNode.children[0].remove()

      this.removeErrorMessages()
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
    editBtn.innerText = "EDIT"
    this.editSticky(editBtn)
    
    removeBtn.id = "remove"
    removeBtn.innerText = "REMOVE"
    this.removeSticky(removeBtn)

    doneBtn.id = "done"
    doneBtn.innerText = "DONE"
    this.stickyDone(doneBtn)

    container.append(doneBtn, editBtn, removeBtn)

    return container
  }

}
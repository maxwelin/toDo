export default class StickyNoteHandler{
  
  list = document.getElementById("container")
  addBtn = document.getElementById("add")
  input = document.getElementById("new-post-input")
  container = document.getElementById("container")
  errorMessages = document.getElementById("error-messages")
  slapSound = new Audio("../punch.wav")

  addEventListener(){
    this.addBtn.addEventListener("click", (() => {
      if(this.input.value && this.container.childNodes.length < 19){
        this.styleAndAppendStickyNote()
        this.removeErrorMessages()
      } else if(this.container.childNodes.length == 19) {
        this.boardIsFullError()
        if(this.errorMessages.innerHTML && !this.errorMessages.classList.contains("visible")){
          this.playSlapSound()
          this.errorMessages.classList.add("visible")
        }
      } else {
        this.emptyInputError()
        if(this.errorMessages.innerHTML && !this.errorMessages.classList.contains("visible")){
          this.playSlapSound()
          this.errorMessages.classList.add("visible")
        }
      } 
      // this.input.value = ""
    }))
  }

  emptyInputError(){
    this.errorMessages.innerHTML = 
        `<p>Don't waste sticky notes!<br>
        Write something before sticking it to the board.</p>`
  }

  boardIsFullError(){
    this.errorMessages.innerHTML = 
        `<p>Board is full! Get to work!</p>`
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
    }, 50)
  }

  styleAndAppendStickyNote(){
    const stickyNote = document.createElement("div")

    stickyNote.innerText = this.input.value
    stickyNote.classList.add("post-it")
    stickyNote.classList.add(`ver${Math.floor(Math.random() * 10) + 1}`)
    stickyNote.style.transform = `rotate(${Math.floor(Math.random() * 31) - 15}deg)`
    stickyNote.addEventListener("click", (() => {
      stickyNote.classList.toggle("active")
    }))

    this.list.appendChild(stickyNote)
  }

  manipulateStickyNoteBar(){

  }


}
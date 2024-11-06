export default class StickyNoteHandler{
  
  list = document.querySelector("#container")
  addBtn = document.getElementById("add")
  input = document.getElementById("new-post-input")
  container = document.getElementById("container")

  addEventListener(){
    this.addBtn.addEventListener("click", (() => {
      if(this.input.value && this.container.childNodes.length < 19){
        this.styleAndAppendStickyNote()
      } else if(this.container.childNodes.length == 19) {
        alert("Board is full, get to work!")
      } else {
        alert("Dont waste sticky notes! Write something before pinning.")
      } 
      this.input.value = ""
    }))
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

export default class ErrorHandler{
  errorMessages = document.getElementById("error-messages")
  slapSound = new Audio("../punch.wav")

  emptyInputError(){
    this.errorMessages.innerHTML = 
    `<p>Don't waste sticky notes!<br>
        Write something before sticking it to the board.</p>`
    this.playErrorMessageAnimation()
  }
  
  boardIsFullError(){
    this.errorMessages.innerHTML = 
    `<p>Board is CLEARLY<br>
        full!<br><br>
        Get to work!</p>`
    this.playErrorMessageAnimation()
  }
  
  doneBoardIsFullError(){
    this.errorMessages.innerHTML = 
    `<p>Can't you see the board is full?<br>
        You gotta remove<br>
        some sticky notes first!</p>`
    this.playErrorMessageAnimation()
  }

  playErrorMessageAnimation(){
    if(this.errorMessages.innerHTML && !this.errorMessages.classList.contains("visible")){
      this.playSlapSound()
      this.errorMessages.classList.add("visible")
    }
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
  
}
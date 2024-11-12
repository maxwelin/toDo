import ErrorHandler from "./errorHandler.js"
import StickyNoteHandler from "./StickyNoteHandler.js"

const errorHandler = new ErrorHandler()
const stickyNoteHandler = new StickyNoteHandler(errorHandler)

const main = () => {
  stickyNoteHandler.addEventListeners()
}

window.onload = main
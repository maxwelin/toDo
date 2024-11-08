import StickyNoteHandler from "./StickyNoteHandler.js"

const stickyNoteHandler = new StickyNoteHandler()

const main = () => {
  stickyNoteHandler.initialize()
}

window.onload = main
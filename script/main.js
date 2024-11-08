import StickyNoteHandler from "./StickyNoteHandler.js"

const stickyNoteHandler = new StickyNoteHandler()

const main = () => {
  stickyNoteHandler.eventStickToBoard()
  stickyNoteHandler.eventResetBoard()
  stickyNoteHandler.eventResetDoneBoard()
}

window.onload = main
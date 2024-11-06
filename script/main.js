import StickyNoteHandler from "./StickyNoteHandler.js"

const stickyNoteHandler = new StickyNoteHandler

const main = (() => {
  stickyNoteHandler.addEventListener()
})

window.document.onload = main()
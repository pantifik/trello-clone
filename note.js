const Note = {
  id: 8,
  dragged: null,
  process(note) {
    note.addEventListener("dblclick", function(event) {
      this.setAttribute("contenteditable", true);
      this.removeAttribute("draggable");
      this.closest(".column").removeAttribute("draggable");
      this.focus();
    });
    note.addEventListener("blur", function(event) {
      this.removeAttribute("contenteditable");
      this.setAttribute("draggable", true);
      this.closest(".column").setAttribute("draggable", true);
      if (!this.textContent.trim().length) this.remove();
    });
    note.addEventListener("dragstart", Note.dragstart);
    note.addEventListener("dragend", Note.dragend);
    note.addEventListener("dragenter", Note.dragenter);
    note.addEventListener("dragover", Note.dragover);
    note.addEventListener("dragleave", Note.dragleave);
    note.addEventListener("drop", Note.drop);
  },
  dragstart(event) {
    event.stopPropagation();
    Note.dragged = this;
    this.classList.add("dragged");
  },
  dragend(event) {
    event.stopPropagation();
    Note.dragged = null;
    this.classList.remove("dragged");

    document
      .querySelectorAll(".note")
      .forEach(note => note.classList.remove("under"));
  },

  dragenter(event) {
    event.stopPropagation();
    if (!Note.dragged || this === Note.dragged) return;
    this.classList.add("under");
  },
  dragover(event) {
    event.preventDefault();
    if (!Note.dragged || this === Note.dragged) return;
  },
  dragleave(event) {
    event.stopPropagation();
    if (!Note.dragged || this === Note.dragged) return;
    this.classList.remove("under");
  },
  drop(event) {
    event.stopPropagation();
    if (!Note.dragged || this === Note.dragged) return;
    if (this.parentElement === Note.dragged.parentElement) {
      const notes = Array.from(this.parentElement.querySelectorAll(".note"));

      notes.indexOf(this) < notes.indexOf(Note.dragged)
        ? this.before(Note.dragged)
        : this.after(Note.dragged);
    } else {
      this.parentElement.prepend(Note.dragged, this);
    }
  }
};

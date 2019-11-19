class Note {
  constructor(id = null, content = "") {
    let currentId = id || Note.idCount++;
    const note = document.createElement("div");
    this.element = note;
    note.classList.add("note");
    note.textContent = content;
    note.setAttribute("data-note-id", currentId);
    note.setAttribute("draggable", true);

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
      if (!this.textContent.trim().length) {
        this.remove();
      }
      App.save();
    });
    note.addEventListener("dragstart", this.dragstart.bind(this));
    note.addEventListener("dragend", this.dragend.bind(this));
    note.addEventListener("dragenter", this.dragenter.bind(this));
    note.addEventListener("dragover", this.dragover.bind(this));
    note.addEventListener("dragleave", this.dragleave.bind(this));
    note.addEventListener("drop", this.drop.bind(this));
  }

  dragstart(event) {
    event.stopPropagation();
    Note.dragged = this.element;
    this.element.classList.add("dragged");
  }

  dragend(event) {
    Note.dragged = null;
    this.element.classList.remove("dragged");

    document
      .querySelectorAll(".note")
      .forEach(note => note.classList.remove("under"));
  }

  dragenter(event) {
    if (!Note.dragged || this.element === Note.dragged) {
      return;
    }
    event.stopPropagation();
    this.element.classList.add("under");
  }

  dragover(event) {
    event.preventDefault();
    if (!Note.dragged || this.element === Note.dragged) {
      return;
    }
  }

  dragleave(event) {
    if (!Note.dragged || this.element === Note.dragged) {
      return;
    }
    event.stopPropagation();
    this.element.classList.remove("under");
  }

  drop(event) {
    if (!Note.dragged || this.element === Note.dragged) {
      return;
    }
    if (this.element.parentElement === Note.dragged.parentElement) {
      const notes = Array.from(
        this.element.parentElement.querySelectorAll(".note")
      );

      notes.indexOf(this.element) < notes.indexOf(Note.dragged)
        ? this.element.before(Note.dragged)
        : this.element.after(Note.dragged);
    } else {
      this.element.parentElement.prepend(Note.dragged, this.element);
    }
    App.save();
  }
}

Note.dragged = null;

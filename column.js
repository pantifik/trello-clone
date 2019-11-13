const Column = {
  idCount: 4,
  dragged: null,
  dropped: null,
  addNote(columnElement) {
    columnElement
      .querySelector("[data-action-addNote]")
      .addEventListener("click", function(event) {
        const newNote = document.createElement("div");
        newNote.classList.add("note");
        newNote.setAttribute("data-note-id", Note.id);
        newNote.setAttribute("draggable", true);
        newNote.setAttribute("contenteditable", true);
        columnElement.querySelector("[data-notes]").append(newNote);
        newNote.focus();
        Note.process(newNote);

        Note.id++;
      });
    Column.editingHeader(columnElement);
    columnElement.addEventListener("dragover", function(event) {
      event.preventDefault();
    });
    columnElement.addEventListener("drop", function(event) {
      if (Note.dragged) {
        this.querySelector("[data-notes]").append(Note.dragged);
      }
    });
    columnElement.addEventListener("dragstart", Column.dragstart);
    columnElement.addEventListener("dragend", Column.dragend);
    columnElement.addEventListener("dragover", Column.dragover);

    columnElement.addEventListener("drop", Column.drop);
  },
  editingHeader(columnElement) {
    const colHeader = columnElement.querySelector(".column-header");
    colHeader.addEventListener("dblclick", function(event) {
      this.setAttribute("contenteditable", true);
      this.focus();
    });
    colHeader.addEventListener("blur", function(event) {
      this.removeAttribute("contenteditable");
    });
  },
  addNewColumn() {
    const newColumn = document.createElement("div");
    newColumn.classList.add("column");
    newColumn.setAttribute("data-column-id", Column.id);
    newColumn.setAttribute("draggable", true);
    newColumn.innerHTML = `
                          <p class="column-header">
                              В плане
                            </p>
                            <div data-notes></div>
                            <p class="column-footer">
                              <span data-action-addNote class="action">
                                + Добавить карточку
                              </span>
                            </p>`;
    document.querySelector(".columns").append(newColumn);
    Column.id++;
    Column.addNote(newColumn);
  },
  dragstart(event) {
    Column.dragged = this;
    this.classList.add("dragged");
  },
  dragend(event) {
    Column.dragged = null;
    this.classList.remove("dragged");
    Column.dropped = null;
    document
      .querySelectorAll(".column")
      .forEach(element => element.classList.remove("under"));
  },
  dragenter(event) {
    event.stopPropagation();
    if (!Column.dragged || this === Column.dragged) {
      return;
    }
  },
  dragover(event) {
    if (Column.dragged === this) {
      if (Column.dropped) {
        Column.dropped.classList.remove("under");
      }
      Column.dropped = null;
    }

    if (!Column.dragged || this === Column.dragged) {
      return;
    }

    Column.dropped = this;

    document
      .querySelectorAll(".column")
      .forEach(element => element.classList.remove("under"));

    Column.dropped.classList.add("under");
  },
  dragleave(event) {
    if (!Column.dragged || this === Column.dragged) {
      return;
    }

    this.classList.remove("under");
  },
  drop(event) {
    if (!Column.dragged || this === Column.dragged) {
      return;
    }

    const colums = Array.from(this.parentElement.querySelectorAll(".column"));

    colums.indexOf(this) < colums.indexOf(Column.dragged)
      ? this.before(Column.dragged)
      : this.after(Column.dragged);
  }
};

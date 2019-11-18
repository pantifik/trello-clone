class Column {
  constructor(id = null, title = "В плане") {
    let currentId = id || Column.idCount++;
    const self = this;
    const columnElement = (this.element = document.createElement("div"));
    columnElement.classList.add("column");
    columnElement.setAttribute("data-column-id", currentId);
    columnElement.setAttribute("draggable", true);
    columnElement.innerHTML = `
                          <p class="column-header">
                              ${title}
                            </p>
                            <div data-notes></div>
                            <p class="column-footer">
                              <span data-action-addNote class="action">
                                + Добавить карточку
                              </span>
                            </p>`;

    columnElement
      .querySelector("[data-action-addNote]")
      .addEventListener("click", function(event) {
        const newNote = new Note();
        columnElement.querySelector("[data-notes]").append(newNote.element);
        newNote.element.setAttribute("contenteditable", true);
        newNote.element.focus();

        newNote.idCount++;
        App.save();
      });
    this.editingHeader(columnElement);
    columnElement.addEventListener("dragover", function(event) {
      event.preventDefault();
    });
    columnElement.addEventListener("drop", function(event) {
      if (Note.dragged) {
        this.querySelector("[data-notes]").append(Note.dragged);
      }
    });
    columnElement.addEventListener("dragstart", this.dragstart.bind(this));
    columnElement.addEventListener("dragend", this.dragend.bind(this));
    columnElement.addEventListener("dragover", this.dragover.bind(this));

    columnElement.addEventListener("drop", this.drop.bind(this));
  }
  editingHeader(columnElement) {
    const self = this;
    const colHeader = columnElement.querySelector(".column-header");
    colHeader.addEventListener("dblclick", function(event) {
      self.element.removeAttribute("draggable");
      this.setAttribute("contenteditable", true);
      this.focus();
    });
    colHeader.addEventListener("blur", function(event) {
      self.element.setAttribute("draggable", true);
      this.removeAttribute("contenteditable");
      App.save();
    });
  }
  dragstart(event) {
    Column.dragged = this.element;
    this.element.classList.add("dragged");
  }
  dragend(event) {
    Column.dragged = null;
    this.element.classList.remove("dragged");
    this.dropped = null;
    document
      .querySelectorAll(".column")
      .forEach(element => element.classList.remove("under"));
  }
  dragenter(event) {
    event.stopPropagation();
    if (!Column.dragged || this.element === Column.dragged) {
      return;
    }
  }
  dragover(event) {
    if (Column.dragged === this.element) {
      if (this.dropped) {
        this.dropped.classList.remove("under");
      }
      this.dropped = null;
    }

    if (!Column.dragged || this.element === Column.dragged) {
      return;
    }

    this.dropped = this.element;

    document
      .querySelectorAll(".column")
      .forEach(element => element.classList.remove("under"));

    this.dropped.classList.add("under");
  }
  dragleave(event) {
    if (!Column.dragged || this.element === Column.dragged) {
      return;
    }

    this.element.classList.remove("under");
  }
  drop(event) {
    if (!Column.dragged || this.element === Column.dragged) {
      return;
    }

    const colums = Array.from(
      this.element.parentElement.querySelectorAll(".column")
    );

    colums.indexOf(this.element) < colums.indexOf(Column.dragged)
      ? this.element.before(Column.dragged)
      : this.element.after(Column.dragged);
    App.save();
  }
}

Column.dragged = null;
Column.dropped = null;

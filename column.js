class Column {
  constructor(id = null, title = "В плане") {
    let currentId = id || this.idCount++;
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
        newNote.element.focus();

        newNote.element.setAttribute("contenteditable", true);

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
    const colHeader = columnElement.querySelector(".column-header");
    colHeader.addEventListener("dblclick", function(event) {
      this.setAttribute("contenteditable", true);
      this.focus();
    });
    colHeader.addEventListener("blur", function(event) {
      this.removeAttribute("contenteditable");
      App.save();
    });
  }
  dragstart(event) {
    this.dragged = this.element;
    this.element.classList.add("dragged");
  }
  dragend(event) {
    this.dragged = null;
    this.element.classList.remove("dragged");
    this.dropped = null;
    document
      .querySelectorAll(".column")
      .forEach(element => element.classList.remove("under"));
  }
  dragenter(event) {
    event.stopPropagation();
    if (!this.dragged || this.element === this.dragged) {
      return;
    }
  }
  dragover(event) {
    if (this.dragged === this.element) {
      if (this.dropped) {
        this.dropped.classList.remove("under");
      }
      this.dropped = null;
    }

    if (!this.dragged || this.element === this.dragged) {
      return;
    }

    this.dropped = this.element;

    document
      .querySelectorAll(".column")
      .forEach(element => element.classList.remove("under"));

    this.dropped.classList.add("under");
  }
  dragleave(event) {
    if (!this.dragged || this.element === this.dragged) {
      return;
    }

    this.element.classList.remove("under");
  }
  drop(event) {
    if (!this.dragged || this.element === this.dragged) {
      return;
    }

    const colums = Array.from(
      this.element.parentElement.querySelectorAll(".column")
    );

    colums.indexOf(this) < colums.indexOf(this.dragged)
      ? this.before(this.dragged)
      : this.after(this.dragged);
    App.save();
  }
}
Column.idCount = 4;
Column.dragged = null;
Column.dropped = null;

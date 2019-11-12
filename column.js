const Column = {
  id: 4,
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
      console.log("col");
      if (Note.dragged) {
        this.querySelector("[data-notes]").append(Note.dragged);
      }
    });
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
  }
};

const App = {
  save() {
    const data = {
      columns: {
        idCount: 1,
        items: []
      },
      notes: {
        idCount: 1,
        items: []
      }
    };

    document.querySelectorAll(".column").forEach(columnElement => {
      const column = {
        title: columnElement.querySelector(".column-header").textContent,
        id: +columnElement.getAttribute("data-column-id"),
        notesId: []
      };

      columnElement.querySelectorAll(".note").forEach(noteElement => {
        column.notesId.push(+noteElement.getAttribute("data-note-id"));
      });

      data.columns.items.push(column);
    });
    data.columns.idCount = Column.idCount;

    document.querySelectorAll(".note").forEach(noteElement => {
      const note = {
        id: +noteElement.getAttribute("data-note-id"),
        content: noteElement.textContent
      };

      data.notes.items.push(note);
    });
    data.notes.idCount = Note.idCount;

    const json = JSON.stringify(data);

    localStorage.setItem("trello", json);
    return data;
  },

  load() {
    if (!localStorage.getItem("trello")) {
      Column.idCount = 1;
      Note.idCount = 1;
      return;
    }

    const data = JSON.parse(localStorage.getItem("trello"));

    Column.idCount = data.columns.idCount;
    Note.idCount = data.notes.idCount;
    console.log(Column.idCount, Note.idCount);
    const mountPoint = document.querySelector(".columns");
    const noteById = id => data.notes.items.find(notes => notes.id == id);
    mountPoint.innerHTML = "";

    for (const { id, notesId, title } of data.columns.items) {
      const columnElement = new Column(id, title);

      for (const noteId of notesId) {
        const { id, content } = noteById(noteId);
        const note = new Note(id, content);
        columnElement.element
          .querySelector("[data-notes]")
          .append(note.element);
      }
      mountPoint.append(columnElement.element);
    }
  }
};

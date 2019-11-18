const App = {
  save() {
    const data = {
      columns: {
        counterId: 1,
        items: []
      },
      notes: {
        counterId: 1,
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

    document.querySelectorAll(".note").forEach(noteElement => {
      const note = {
        id: +noteElement.getAttribute("data-note-id"),
        content: noteElement.textContent
      };

      data.notes.items.push(note);
    });

    const json = JSON.stringify(data);

    localStorage.setItem("trello", json);
    console.log("save");
    return data;
  },

  load() {
    if (!localStorage.getItem("trello")) {
      return;
    }

    const data = JSON.parse(localStorage.getItem("trello"));
    console.log(data);
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

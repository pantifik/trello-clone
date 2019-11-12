document.querySelectorAll(".column").forEach(Column.addNote);

document
  .querySelector("[data-action-addColumn]")
  .addEventListener("click", Column.addNewColumn);

document.querySelectorAll(".note").forEach(Note.process);

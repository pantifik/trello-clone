//document.querySelectorAll(".column").forEach(Column.addNote);
App.load();
document
  .querySelector("[data-action-addColumn]")
  .addEventListener("click", function(event) {
    document.querySelector(".columns").append(new Column().element);
  });

//document.querySelectorAll(".note").forEach(Note.process);

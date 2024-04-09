document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const removeTaskBtn = document.getElementById("removeTaskBtn");

  function removeCompletedTasks() {
    const completedTasks = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    ); // selects all currently checked Tasks (checkboxes)
    completedTasks.forEach((task) => {
      const listItem = task.parentElement;
      listItem.remove();
    });
  }

  addTaskBtn.addEventListener("click", () => {
    console.log("Add button clicked");
    const taskText = taskInput.value.trim(); // Retrieve the value of the input field trim = remove unnecessary white space

    if (taskText !== "") {
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox"> <span>${taskText}</span>`;
      taskList.appendChild(li);
      taskInput.value = "";
    }
  });

  taskInput.addEventListener("keydown", (e) => {
    console.log("Key pressed:", e.code);
    if (e.code === "Enter") {
      e.preventDefault(); // Prevent the default action of the Enter key
      const taskText = taskInput.value.trim(); // Retrieve the value of the input field
      if (taskText !== "") {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"> <span>${taskText}</span>`;
        taskList.appendChild(li);
        taskInput.value = "";
      }
    }
  });

  removeTaskBtn.addEventListener("click", () => {
    // if clicked -> remove checked Task
    removeCompletedTasks();
  });

  taskList.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      removeCompletedTasks();
    }
  });

  taskList.addEventListener("change", function (e) {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
      const listItem = e.target.parentElement;
      if (e.target.checked) {
        listItem.classList.add("completed");
      } else {
        listItem.classList.remove("completed");
      }
    }
  });
});

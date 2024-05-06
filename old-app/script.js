const addTodoForm = document.getElementById("addTodoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const removeTaskBtn = document.getElementById("removeTaskBtn");
const welcomeMessageElement = document.getElementById("welcomeMessage");
const todoFilterBtn = document.getElementById("todoFilterBtn");
const startedFilterBtn = document.getElementById("startedFilterBtn");
const doneFilterBtn = document.getElementById("doneFilterBtn");
const circles = document.querySelectorAll("#circle1, #circle2, #circle3");
const explanation = document.getElementById("explanation");

// User ---------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//

let state = {
  tasks: [],
  filter: "",
  error: "",
};

const LOCAL_STORAGE_KEY = "task-state-v1"; // Define localStorage key

// Load state from Local Storage -----------------------------------------------------------//
function loadStateFromLocalStorage() {
  const loadedSate = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (loadedSate == null) {
    return;
  }
  state = JSON.parse(loadedSate);
}

loadStateFromLocalStorage();
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//
function filterTasks(done) {
  filteredTasks = state.tasks.filter((task) => task.done === done);
}

function render() {
  taskList.innerHTML = ""; // Clear the task list before rendering

  let filteredTasks = state.tasks;
  // If state.filter has a value (truthy)
  if (state.filter === "open") {
    // If state.filter is "open", filter tasks that are not done
    filteredTasks = state.tasks.filter((task) => !task.done);
  } else if (state.filter === "done") {
    // If state.filter is not "open", filter tasks that are done
    filteredTasks = state.tasks.filter((task) => task.done);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.taskId = task.id; // Set the dataset.taskId attribute to the task id

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "done";
    input.className = "checkbox";
    input.checked = task.done;

    input.addEventListener("change", () => {
      fetch("http://localhost:4730/todos/" + task.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          done: input.checked,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          refresh();
        })
        .catch((error) => {
          state.error = "Oh no! We can't update the task:";
          render();
        });
      render();
    });

    const span = document.createElement("span");
    span.textContent = task.description;

    const label = document.createElement("label");
    label.append(input, span);

    const form = document.createElement("form");
    form.append(label);

    li.append(form);
    li.dataset.status = "to-do"; // Set status attribute to "to-do" for all to-do tasks

    taskList.append(li);
  });
  if (state.error != "") {
    const p = document.createElement("p");
    p.textContent = state.error;
    error.append(p);
    return;
  }
}
render();

// Add event listener to remove button
removeTaskBtn.addEventListener("click", () => {
  const tasksToDelete = state.tasks.filter((task) => task.done);
  tasksToDelete.forEach((task) => {
    fetch("http://localhost:4730/todos/" + task.id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Task deleted successfully:", data);
        filterTasks(true);
        refresh();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        refresh();
      });
    render();
  });
});

// Event listeners for filter buttons
allFilterBtn.addEventListener("click", function () {
  state.filter = "";
  removeAllActiveClasses();
  this.classList.add("active");
  render();
});

openFilterBtn.addEventListener("click", function () {
  state.filter = "open";
  removeAllActiveClasses();
  this.classList.add("active");
  render();
});

doneFilterBtn.addEventListener("click", function () {
  state.filter = "done";
  removeAllActiveClasses();
  this.classList.add("active");
  render();
});

// Function to remove "active" class from all filter buttons
function removeAllActiveClasses() {
  allFilterBtn.classList.remove("active");
  openFilterBtn.classList.remove("active");
  doneFilterBtn.classList.remove("active");
}

// Form ----------------------------------------------------------------------------//

addTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = taskInput.value.trim(); // validierung und trim = löschen von überschüssigen Leerzeichen

  if (description == "") {
    return;
  }

  for (let i = 0; i < state.tasks.length; ++i) {
    const task = state.tasks[i];

    if (task.description.toLowerCase() == description.toLowerCase()) {
      return;
    }
  }

  if (
    state.tasks.some((task) => {
      return task.description.toLowerCase() == description.toLowerCase();
    })
  ) {
    return;
  }

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      description: description,
      done: false,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      refresh();
    })
    .catch((error) => {
      state.error = "Opsie! The task won't post. :(";
      render();
    });
  addTodoForm.reset();
  render();
});

const EXPLANATIONS_ARRAY = ["Weekday", "Today", "Weekend"];

// Loop through each circle element
// circles.forEach((circle, index) => {
//   // Add an event listener to detect when the mouse enters the circle
//   circle.addEventListener("mouseenter", () => {
//     // When the mouse enters the circle, set the text content of the explanation element
//     // to provide the corresponding explanation based on the circle's index
//     explanation.textContent = EXPLANATIONS_ARRAY[index];
//     // Make the explanation element visible by setting its display property to 'block'
//     explanation.style.display = "block";
//   });

//   // Add an event listener to detect when the mouse leaves the circle
//   circle.addEventListener("mouseleave", () => {
//     // When the mouse leaves the circle, hide the explanation by setting its display property to 'none'
//     explanation.style.display = "none";
//   });
// });
// render();

//GET
let currentSortMethod = "alphabetical";

function refresh() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);

      // Sort data based on the current sorting method
      if (currentSortMethod === "alphabetical") {
        data.sort((a, b) => {
          if (a.description < b.description) {
            return -1;
          }
          if (a.description > b.description) {
            return 1;
          }
          return 0;
        });
      } else if (currentSortMethod === "id") {
        data.sort((a, b) => a.id - b.id);
      }

      state.tasks = data; // Assign the sorted array to state.tasks
      render(); // Render the sorted tasks
    })
    .catch((error) => {
      state.error = "Something went wrong! :(";
      render();
    });
}

refresh();

// Add event listener to the parent element
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const selectedOption = event.target.getAttribute("data-value");

    if (selectedOption === "alphabetical" || selectedOption === "id") {
      // Handle click event for alphabetical or ID option
      currentSortMethod = selectedOption;
      refresh();

      // Update the dropdown button text to reflect the current selection
      document.querySelector(".dropbtn").textContent =
        "Sort by: " +
        (selectedOption === "alphabetical" ? "Alphabetical" : "ID");
    }
  });

const checkAllBoxes = document.getElementById("check-all");

function handleCheckAll() {
  const isChecked = checkAllBoxes.checked;

  state.tasks.forEach((task) => {
    if (task.done !== isChecked) {
      task.done = isChecked;
      fetch("http://localhost:4730/todos/" + task.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          done: isChecked,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Task updated:", data);
          refresh();
        })
        .catch((error) => {
          state.error = "Error updating task:";
          render();
        });
    }
  });
}

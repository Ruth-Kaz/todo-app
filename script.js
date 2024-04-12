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
const open = document.getElementById("openFilterBtn");
const done = document.getElementById("doneFilterBtn");
const all = document.getElementById("allFilterBtn");
// User ---------------------------------------------------------------------------------------//
function setWelcomeMessage(username) {
  welcomeMessageElement.textContent = "Welcome, " + username + "!";
}

const username = "Minty";
setWelcomeMessage(username);
//------------------------------------------------------------------------------------------//

let state = {
  tasks: [
    {
      id: Date.now(),
      description: "Your first task",
      done: false,
    },
  ],
  filter: "",
};

let explanations = ["Weekday", "Today", "Weekend"];

// Load state from Local Storage -----------------------------------------------------------//
function loadStateFromLocalStorage() {
  const loadedSate = localStorage.getItem("task-state-v1");
  if (loadedSate == null) {
    return;
  }
  state = JSON.parse(loadedSate);
}

loadStateFromLocalStorage();
//------------------------------------------------------------------------------------------//
const localStorageKey = "task-state-v1"; // Define localStorage key
function updateLocalStorage() {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}

function render() {
  const taskList = document.getElementById("taskList"); // Get the task list element
  taskList.innerHTML = ""; // Clear the task list before rendering

  let filteredTasks;

  if (state.filter) {
    // If state.filter has a value (truthy)
    if (state.filter === "open") {
      // If state.filter is "open", filter tasks that are not done
      filteredTasks = state.tasks.filter((task) => !task.done);
    } else {
      // If state.filter is not "open", filter tasks that are done
      filteredTasks = state.tasks.filter((task) => task.done);
    }
  } else {
    // If state.filter is falsy (empty, null, undefined, 0, or false)
    // Include all tasks without filtering
    filteredTasks = state.tasks;
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
      task.done = input.checked;
      localStorage.setItem("task-state-v1", JSON.stringify(state)); // save in local storage
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

  function removeCheckedTasks() {
    state.tasks = state.tasks.filter((task) => !task.done);
    localStorage.setItem("task-state-v1", JSON.stringify(state)); // save in local storage
    render();
  }

  // Initialize state from local storage if exists
  const storedState = localStorage.getItem("task-state-v1");
  if (storedState) {
    state = JSON.parse(storedState);
  }

  // Add event listener to remove button
  removeTaskBtn.addEventListener("click", removeCheckedTasks);

  // Event listeners for filter buttons
  allFilterBtn.addEventListener("click", () => {
    state.filter = "";
    render();
  });

  openFilterBtn.addEventListener("click", () => {
    state.filter = "open";
    render();
  });

  doneFilterBtn.addEventListener("click", () => {
    state.filter = "done";
    render();
  });

  // Add event delegation for checkbox changes
  taskList.addEventListener("change", (event) => {
    const taskId = event.target.closest("li").dataset.taskId;
    const task = state.tasks.find((task) => task.id == taskId);
    task.done = event.target.checked;
    localStorage.setItem("task-state-v1", JSON.stringify(state)); // save in local storage
    render();
  });
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

  const id = Date.now(); // validierung und muss unten nicht mehr eingegeben werden

  state.tasks.push({
    id,
    description,
    done: false,
  }); // State Update

  addTodoForm.reset();

  localStorage.setItem("task-state-v1", JSON.stringify(state)); // save in local storage

  render();
});

// Loop through each circle element
circles.forEach((circle, index) => {
  // Add an event listener to detect when the mouse enters the circle
  circle.addEventListener("mouseenter", () => {
    // When the mouse enters the circle, set the text content of the explanation element
    // to provide the corresponding explanation based on the circle's index
    explanation.textContent = explanations[index];
    // Make the explanation element visible by setting its display property to 'block'
    explanation.style.display = "block";
  });

  // Add an event listener to detect when the mouse leaves the circle
  circle.addEventListener("mouseleave", () => {
    // When the mouse leaves the circle, hide the explanation by setting its display property to 'none'
    explanation.style.display = "none";
  });
});
render();

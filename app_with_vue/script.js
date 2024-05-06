Vue.createApp({
  data() {
    return {
      tasks: [],
      searchQuery: "",
      newDescription: "",
      longPressTimer: null,
      editingTask: null,
      filter: "all",
      error: "",
    };
  },

  computed: {
    filterTasks() {
      if (this.filter === "all") {
        return this.tasks;
      } else if (this.filter === "done") {
        return this.tasks.filter(function (task) {
          return task.done === true;
        });
      } else {
        return this.tasks.filter(function (task) {
          return task.done === false;
        });
      }
    },
    completedTasks: function () {
      return this.tasks.filter((task) => task.done).length;
    },
  },

  methods: {
    searchQuery(event) {
      const lowerSearchQuery = event.target.value.toLowerCase();
      this.$store.state.searchQuery = lowerSearchQuery; // Update searchQuery in the Vuex store

      // Filter tasks based on searchQuery
      const filteredTasks = this.$store.state.tasks.filter((task) => {
        return Object.values(task).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerSearchQuery)
        );
      });
    },

    async changeCheckbox(task) {
      try {
        const response = await fetch("http://localhost:4730/todos/" + task.id, {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            done: task.done,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to check task");
        }
        const data = await response.json();
        console.log("Task changed successfully:", data);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },

    async addTask() {
      try {
        const response = await fetch("http://localhost:4730/todos", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            description: this.newDescription,
            done: false,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add task");
        }
        const data = await response.json();
        console.log("Task added successfully:", data);
        this.tasks.push(data); // Push the newly added task data to this.tasks
        this.newDescription = "";
      } catch (error) {
        this.error("Error adding task:", error);
      }
    },

    changeFilter(filterOption) {
      this.filter = filterOption;
    },

    startTimer(task) {
      this.longPressTimer = setTimeout(() => {
        this.editTask(task);
      }, 1000); //duration
    },
    endTimer() {
      clearTimeout(this.longPressTimer);
    },
    cancelTimer() {
      clearTimeout(this.longPressTimer);
    },

    editTask(task) {
      task.editing = true;
      this.editingTask = task;
    },

    async saveTask(task) {
      task.editing = false; // Indicate that editing is finished
      try {
        const response = await fetch("http://localhost:4730/todos/" + task.id, {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to update task");
        }
        const data = await response.json();
        console.log("Task updated successfully:", data);
      } catch (error) {
        this.tasks.error("Error updating task:", error);
      }
      this.editingTask = null; // Reset editingTask
    },

    getHtmlId(id) {
      return "task-" + id;
    },

    sortBy(sortOption) {
      // Implement your sorting logic based on the selected sortOption (e.g., alphabetical or id)
      if (sortOption === "alphabetical") {
        // Sort alphabetically
        this.tasks.sort((a, b) => a.description.localeCompare(b.description));
      } else if (sortOption === "id") {
        // Sort by id
        this.tasks.sort((a, b) => a.id - b.id);
      }
    },

    async removeTask(index) {
      const tasksToDelete = this.tasks.filter((task) => task.done);
      for (const task of tasksToDelete) {
        try {
          const response = await fetch(
            "http://localhost:4730/todos/" + task.id,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete task");
          }
          const data = await response.json();
          console.log("Task deleted successfully:", data);
          const index = this.tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            this.tasks.splice(index, 1);
          } // Remove the task at the specified index
        } catch (error) {
          this.error("Error deleting task:", error);
        }
      }
    },
  },

  async created() {
    try {
      const response = await fetch("http://localhost:4730/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      this.tasks = data;
    } catch (error) {
      console.error("Error fetching data:", error);
      this.error = "Something went wrong! :(";
    }
  },
}).mount("#app");

// =====================================
// ACADEMIC PLANNER - TASK MANAGEMENT
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    const allCount = document.getElementById("allCount");
    const todoCount = document.getElementById("todoCount");
    const completedCount = document.getElementById("completedCount");

    const todayDate = document.getElementById("todayDate");
    const filterButtons = document.querySelectorAll(".filter-button");

    // Save tasks in the browser
    let tasks = JSON.parse(localStorage.getItem("favourPlannerTasks")) || [];

    let currentFilter = "all";

    // Display today's date
    todayDate.textContent = new Date().toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Save tasks automatically
    function saveTasks() {
        localStorage.setItem("favourPlannerTasks", JSON.stringify(tasks));
    }

    // Update the three task counters
    function updateStatistics() {
        const completed = tasks.filter(task => task.completed).length;
        const todo = tasks.length - completed;

        allCount.textContent = tasks.length;
        todoCount.textContent = todo;
        completedCount.textContent = completed;
    }

    // Display tasks based on selected filter
    function displayTasks() {

        taskList.innerHTML = "";

        let visibleTasks = tasks;

        if (currentFilter === "todo") {
            visibleTasks = tasks.filter(task => !task.completed);
        }

        if (currentFilter === "completed") {
            visibleTasks = tasks.filter(task => task.completed);
        }

        updateStatistics();

        // Show a message when there are no matching tasks
        if (visibleTasks.length === 0) {

            let message = "Your task list is empty.";

            if (currentFilter === "todo") {
                message = "You're all caught up. No pending tasks.";
            }

            if (currentFilter === "completed") {
                message = "Completed tasks will appear here.";
            }

            taskList.innerHTML = `
                <div class="empty-tasks">
                    <strong>Nothing here yet.</strong>
                    ${message}
                </div>
            `;

            return;
        }

        // Create each task
        visibleTasks.forEach(function (task) {

            const taskItem = document.createElement("div");

            taskItem.className = task.completed
                ? "task-item is-completed"
                : "task-item";

            // Checkbox
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute("aria-label", "Mark task as completed");

            checkbox.addEventListener("change", function () {
                toggleTask(task.id);
            });

            // Task description
            const taskText = document.createElement("span");

            taskText.className = "task-text";
            taskText.textContent = task.text;

            // Completion status
            const status = document.createElement("span");

            status.className = "task-status";
            status.textContent = task.completed ? "Completed" : "To do";

            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-task-button";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("aria-label", "Delete task");

            deleteButton.addEventListener("click", function () {
                deleteTask(task.id);
            });

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(status);
            taskItem.appendChild(deleteButton);

            taskList.appendChild(taskItem);
        });
    }

    // Add a new task
    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (taskText === "") {
            taskInput.focus();
            return;
        }

        const newTask = {
            id: Date.now() + Math.random(),
            text: taskText,
            completed: false
        };

        tasks.unshift(newTask);

        saveTasks();

        taskInput.value = "";

        currentFilter = "all";

        filterButtons.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.filter === "all"
            );
        });

        displayTasks();

        taskInput.focus();
    });

    // Mark a task as completed or unfinished
    function toggleTask(taskId) {

        tasks = tasks.map(function (task) {

            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });

        saveTasks();
        displayTasks();
    }

    // Delete a task
    function deleteTask(taskId) {

        tasks = tasks.filter(function (task) {
            return task.id !== taskId;
        });

        saveTasks();
        displayTasks();
    }

    // Switch between All, To Do and Completed
    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            currentFilter = button.dataset.filter;

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            displayTasks();
        });
    });

    // Load previously saved tasks
    displayTasks();

});
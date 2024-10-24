import { user } from "./user.js";
import { ui } from "./ui.js";

/*--------------------------- TO-DO LIST FUNCTIONS ---------------------------*/
export const tasks = {
    /**
     * To-do list data and functions.
     * 
     * @function renderTasks - Render the to-do list.
     * @function addTask - Add a new task to the to-do list.
     * @function deleteTask - Delete a task from the to-do list.
     * @function completeTask - Mark a task as completed in the to-do list.
     * @function editTask - Edit a task in the to-do list.
     * @function reorderTasks - Reorder tasks in the to-do list.
     * 
     * @returns {object} - The functions for the to-do list.
     * 
     * TODO: Allow users to sort tasks.
     * TODO: Allow users to tag tasks.
     * TODO: Allow users to estimate the amount of pomodoros required to complete a task.
     * TODO: Add a way to filter tasks by completed status.
     * TODO: Add a way to filter tasks by date.
     * TODO: Add a way to filter tasks by tags.
     * TODO: Add a way to filter tasks by estimated pomodoros.
     * TODO: Generate whole buttons instead of only icons.
     */
    renderTasks: function(target = 0) {
        /**
         * Render the to-do list.
         * 
         * @param {number} target - The ID of the list item to render.
         */
        let taskList = document.getElementById("todo-list");

        let generateTask = (task) => {
            // TODO: Make use of ui.controls() to generate the controls.
            return `<p class="todo-task">${task.title}</p>
            <label for="task-${task.id}-check" class="sr-only">${task.completed ? "Mark task as incomplete" : "Mark task as completed"}:</label>
            <input class="todo-check" type="checkbox" name="task-${task.id}-check" onclick="tasks.completeTask(${task.id})" ${task.completed ? "checked" : ""}>
            <div class="todo-actions">
                <button class="todo-edit" type="button" onclick="tasks.editTasks(${task.id})" title="Edit task" aria-label="Edit task">${ui.icon("pencil-square")}</button>
                <button class="todo-delete" type="button" onclick="tasks.deleteTask(${task.id})" title="Delete task" aria-label="Delete task">${ui.icon("trash")}</button>
            </div>`;
        };

        // If target is specified, render specified list item.
        if (target !== 0) {
            let taskItem = document.getElementById(`task-${target}`);

            // Clear specified list item.
            taskItem.innerHTML = "";

            // Find the task in the user.tasks object.
            let tasks = user.tasks.find(task => task.id === target);

            // Reload specified list item.
            taskItem.innerHTML = generateTask(tasks);
        } else {
            taskList.innerHTML = "";

            // Add each task to the list.
            user.tasks.forEach(task => {
                let taskItem = document.createElement("li");

                // Get the task ID.
                taskItem.id = `task-${task.id}`;

                // Generate the task HTML and add the task to the list.
                taskItem.innerHTML = generateTask(task);
                taskList.appendChild(taskItem);
            });
        };
    },
    addTask: function() {
        /**
         * Add a new task to the to-do list.
         * 
         * TODO: Allow users to submit a task using the enter key.
         */

        // Add a new task ID.
        let taskId = user.nextTaskId;

        // Create a new task object
        let task = {
            id: taskId,
            title: document.getElementById("todo-task").value,
            completed: false
        };
        user.nextTaskId++;

        // Fallback check if task title is empty.
        if (task.title !== "") {
            // Save to user object, and re-render tasks.
            user.tasks.push(task);
            user.save();
            tasks.renderTasks();

            // Clear input field.
            document.getElementById("todo-task").value = "";

            // Toast success message.
            ui.toast("Task added successfully.", "success");
        } else {
            // Toast error message.
            ui.toast("Please enter a task title.", "error");
        };
    },
    deleteTask: function(id) {
        /**
         * Delete a task from the to-do list.
         * 
         * @param {number} id - The ID of the task to delete.
         */
        // Remove the array item in the user.tasks object..
        user.tasks.splice(id, 1);

        // Save the updated user object, and reload tasks.
        user.save();
        tasks.renderTasks();

        // Toast success message.
        ui.toast("Task deleted successfully.", "success");
    },
    completeTask: function(id) {
        /**
         * Mark a task as completed in the to-do list.
         * 
         * @param {number} id - The ID of the task to mark as completed.
         * 
         * TODO: Only toast the user when the task is completed.
         * CONSIDER: Praise users for completing a task.
         */
        // Find the task in the user.tasks object.
        let task = user.tasks.find(task => task.id === id);

        // Check if the task exists.
        if (task) {
            // Toggle the completed status.
            task.completed = !task.completed;
        };

        // Save the updated user object, reload tasks and toast.
        user.save();
        tasks.renderTasks();
        ui.toast("Task done, good job!", "success");
    },
    editTasks: function(id) {
        /**
         * Edit a task in the to-do list.
         * 
         * @param {number} id - The ID of the task to edit.
         * 
         * TODO: Allow users to submit the edit using the enter key.
         * TODO: Allow users to cancel the edit using the esc key.
         * BUG: When editing a task, and deleting another task the wrong task is deleted.
         * BUG: When multiple tasks are edited, and one is submitted all are closed.
         */
        let task = user.tasks.find(task => task.id === id);

        // Check if the task exists.
        if (task) {
            let taskInput = document.getElementById(`task-${id}`);
            taskInput.innerHTML = `<form id="edit-task-${id}" action="">
            <label for="editing-task-${id}" class="sr-only">Edit task:</label>
            <input id="editing-task-${id}" type="text" value="${task.title}" required>
            <button id="update-task-${id}" type="button">Update</button>
            <button id="update-task-cancel-${id}" type="button">Cancel</button>
            </form>`;

            // Add event listener for the update button.
            document.getElementById(`update-task-${id}`).addEventListener("click", function() {
                let updatedTitle = document.getElementById(`editing-task-${id}`).value;

                if (updatedTitle === "") {
                    // Toast error message.
                    ui.toast("Task title cannot be empty.", "error");
                    return;
                } else if (updatedTitle === task.title) {
                    tasks.renderTasks(id);
                    return;
                } else {
                    // Update the task title.
                    task.title = updatedTitle;

                    // Save the updated user object and reload tasks.
                    user.save();
                    tasks.renderTasks();

                    // Toast success message.
                    ui.toast("Task updated successfully.", "success");
                }
            });

            // Add event listener for the cancel button.
            document.getElementById(`update-task-cancel-${id}`).addEventListener("click", function() {
                // Cancel the edit and reload that list item.
                tasks.renderTasks(id);
            });
        };
    },
    reorderTasks: function() {
        /**
         * Reorder tasks in the to-do list.
         * 
         * TODO: Allow users to reorder tasks.
         */
    }
};
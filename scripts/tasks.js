import { utils } from "./utils.js";
import { user } from "./user.js";
import { toast } from "./toast.js";

/*--------------------------- TO-DO LIST FUNCTIONS ---------------------------*/
export const tasks = {
    /**
     * To-do list data and functions.
     * 
     * @function add - Add a new task to the task object.
     * @function load - Load the task list items, and render them.
     * @function render - Render the to-do list.
     * @function delete - Delete a task from the to-do list.
     * @function edit - Edit a task.
     * @function complete - Mark a task as completed.
     * 
     * @returns {object} - The functions for the to-do list.
     * 
     * TODO: Allow users to sort tasks.
     * TODO: Allow users to tag tasks.
     * TODO: Allow users to estimate the amount of pomodoros required to complete a task.
     * TODO: Add a way to filter tasks by date.
     * TODO: Add a way to filter tasks by tags.
     * TODO: Add a way to filter tasks by estimated pomodoros.
     * TODO: Let user pin tasks to the top of the list.
     * TODO: Generate whole buttons instead of only icons.
     * TODO: Allow archiving completed tasks.
     * TODO: Allow users to set due dates for tasks.
     * TODO: Allow users to create task hierarchies.
     */
    add() {
        /**
         * Add a new task to the to-do list.
         */
        const taskInput = document.getElementById("todo-task");
        if (taskInput.value != "") { // Check if task input is not empty.
            const task = { // Create task object.
                id: user.nextTaskId,
                text: taskInput.value,
                completed: false,
                date: Date.now()
            };
            toast.add("Added task successfully.", "success"); // Success toast.
            user.tasks.push(task); // Add task to user.tasks array.
            user.nextTaskId++; // Increment ID.
            user.save(); // Save changes to user object.
            taskInput.value = ""; // Clear the task input.

            tasks.render(task);
        } else { // If task input is empty.
            toast.add("Task title cannot be empty.", "error"); // Error toast.
        };
    },
    load() {
        /**
         * Loads the task list items, and renders them.
         */
        // Check if user has any tasks.
        if (user.tasks && user.tasks.length > 0) {
            user.tasks.forEach(task => {
                this.render(task);
            });
        };
    },
    render(data) {
        /**
         * Render the to-do list.
         */
        // Create list item.
        const wrapper = document.createElement("li");
        wrapper.id = `task-${data.id}`;
        wrapper.classList.add("task", data.completed ? "complete" : "incomplete");

        // Add text to the list item.
        const text = document.createElement("p");
        text.innerHTML = data.text.charAt(0).toUpperCase() + data.text.slice(1);
        wrapper.appendChild(text);

        // Add label for checkbox.
        const label = document.createElement("label");
        label.classList.add("sr-only");
        label.htmlFor = `task-${data.id}-check`;
        label.innerHTML = data.completed ? "Mark task as incomplete" : "Mark task as completed";
        wrapper.appendChild(label);

        // Add checkbox.
        const checkbox = document.createElement("input");
        checkbox.classList.add("todo-check");
        checkbox.type = "checkbox";
        checkbox.id = `task-${data.id}-check`;
        checkbox.name = `task-${data.id}-check`;
        checkbox.checked = data.completed;
        wrapper.appendChild(checkbox); // TODO: Add checkbox click event listener.

        // TODO: Add timestamp.

        // Add delete button.
        wrapper.appendChild(utils.button("delete", "task", data.id)).addEventListener("click", () => this.delete(data.id));

        // Add edit button.
        wrapper.appendChild(utils.button("edit", "task", data.id));
        // TODO: Add edit event listener.
        // TODO: Click on task to edit.

        // Add task to the top of the list.
        document.querySelector("#todo-list").prepend(wrapper);
    },
    delete(id) {
        /**
         * Delete a task from the to-do list.
         * 
         * @param {number} id - The ID of the task to delete.
         */
        // Remove task from array.
        user.tasks = user.tasks.filter(task => task.id !== id);

        // Remove toast from DOM.
        const task = document.getElementById(`task-${id}`);
        if (task) {
            task.remove();
        };

        // Log to console, and save changes.
        utils.log("Task", `Deleting task with ID: ${id}`);
        user.save();
    },
    edit(id) {
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
        /*let task = user.tasks.find(task => task.id === id);

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
                    utils.toast("Task title cannot be empty.", "error");
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
                    utils.toast("Task updated successfully.", "success");
                }
            });

            // Add event listener for the cancel button.
            document.getElementById(`update-task-cancel-${id}`).addEventListener("click", function() {
                // Cancel the edit and reload that list item.
                tasks.renderTasks(id);
            });
        };*/
    },
    complete(id) {
        /**
         * Mark a task as completed in the to-do list.
         * 
         * @param {number} id - The ID of the task to mark as completed.
         * 
         * TODO: Only toast the user when the task is completed.
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
        utils.toast("Task done, good job!", "success");
    }
};
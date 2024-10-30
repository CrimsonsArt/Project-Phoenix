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
     * @function cancel - Cancel an edit.
     * @function save - Save an edited task.
     * @function complete - Mark a task as completed.
     * 
     * @returns {object} - The functions for the to-do list.
     * 
     * TODO: Allow users to sort tasks.
     * TODO: Allow users to tag tasks.
     * TODO: Allow users to estimate the amount of pomodoros required to complete a task.
     * TODO: Add a way to filter tasks by date, tags and estimated pomodoros.
     * TODO: Let user pin tasks to the top of the list.
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
                date: Date.now(),
                text: taskInput.value,
                dependencies: [],
                dependents: [],
                completed: false,
                completedDate: null,
                archived: false,
                archivedDate: null
            };
            toast.add("Added task successfully.", "success"); // Success toast.
            user.tasks.push(task); // Add task to user.tasks array.
            user.nextTaskId++; // Increment ID.
            user.save(); // Save changes to user object.
            taskInput.value = ""; // Clear the task input.

            tasks.render(task);
        } else { // If task input is empty.
            toast.add("Task title can't be empty.", "error"); // Error toast.
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
    render(data, request = null) {
        /**
         * Render the to-do list.
         * 
         * @param {object} data - The task object.
         * 
         * CONSIDER: Click on task text to edit?
         */
        if (!data) return; // If no data is provided, return.

        // Create list item.
        const wrapper = document.createElement("li");

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
        wrapper.appendChild(checkbox).addEventListener("change", () => this.complete(data.id));

        // TODO: Add timestamp.

        // Check if data has been archived.
        if (data.archived) {
            // Grab the archive list.
            let archiveList = document.getElementById("task-archive");
            if (!archiveList) { // Create archive list if it doesn't exist.
                archiveList = document.createElement("ol");
                archiveList.id = "task-archive";
                archiveList.classList.add("task-list");

                // Add header to archive list.
                const heading = document.createElement("h3");
                heading.textContent = "Archived Tasks";

                // Add archive list and heading to DOM.
                const listSection = document.getElementById("todo");
                listSection.appendChild(archiveList);
                listSection.insertBefore(heading, archiveList);
            };
            // Add ID and class to list item.
            wrapper.id = `task-archived-${data.id}`;
            wrapper.classList.add("task", "archived");

            // Make checkbox un-clickable.
            label.innerHTML = "This task has been archived.";
            checkbox.disabled = true;
        } else {
            // Add ID and class to list item.
            wrapper.id = `task-${data.id}`;
            wrapper.classList.add("task", data.completed ? "complete" : "incomplete");

            // Check if task is completed.
            if (data.completed) { // Add archive button.
                wrapper.appendChild(utils.button("archive", "task", data.id))
                    .addEventListener("click", () => this.archive(data.id));
            } else { // Add edit button.
                wrapper.appendChild(utils.button("edit", "task", data.id))
                    .addEventListener("click", () => this.edit(data.id));
            };
        };

        // Add delete button.
        wrapper.appendChild(utils.button("delete", data.archived ? "archived task" : "task", data.id)).addEventListener("click", () => this.delete(data.id));

        // TODO: Make task draggable for hierarchy placement.
        // wrapper.draggable = true;

        // Check if request is "object".
        if (request === "object") {
            return wrapper; // Return as object.
        } else { // Add to DOM.
            if (data.archived) {
                // Add task to the top of the archive list.
                document.querySelector("#task-archive").prepend(wrapper);
            } else {
                // Add task to the top of the todo list.
                document.querySelector("#todo-list").prepend(wrapper);
            };
        };
    },
    delete(id) {
        /**
         * Delete a task from the to-do list.
         * 
         * @param {number} id - The ID of the task to delete.
         */
        // Find the task with the given id.
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
         */
        // Find the task in the user.tasks object.
        const wrapper = document.getElementById(`task-${id}`);

        // Check if the task exists.
        if (!wrapper) {
            return; // Return if the task doesn't exist.
        };

        // Save the original task title.
        const originalTitle = wrapper.querySelector("p").textContent;

        // Turn the task paragraph into an edit form.
        const editForm = document.createElement("form");
        editForm.id = `editing-task-wrapper-${id}`;

        // Create the label and input elements.
        const editLabel = document.createElement("label");
        const editInput = document.createElement("input");

        // Remove the original elements.
        wrapper.querySelector("p").remove();
        document.getElementById(`edit-task-${id}`).remove();
        document.getElementById(`delete-task-${id}`).remove();

        // Set the label attributes.
        editLabel.htmlFor = `editing-task-${id}`;
        editLabel.innerHTML = "Edit task: ";
        editLabel.classList.add("sr-only");

        // Set the input attributes.
        editInput.placeholder = originalTitle;
        editInput.id = `editing-task-${id}`;
        editInput.value = originalTitle;
        editInput.autocomplete = "off";
        editInput.class = "edit-task";
        editInput.type = "text";

        // Create the save and cancel buttons, and add event listeners.
        wrapper.appendChild(utils.button("save", "task", id)).addEventListener("click", () => this.save(id));
        wrapper.appendChild(utils.button("cancel", "task", id)).addEventListener("click", () => this.cancel(id));

        // Append the label and input elements to the edit form.
        editForm.appendChild(editLabel);
        editForm.appendChild(editInput).addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent the form from submitting.
                this.save(id);
            } else if (event.key === "Escape") {
                this.cancel(id);
            };
        });
        wrapper.prepend(editForm); // Add the edit form to the task wrapper.
        utils.log("Task", `Editing task with ID: ${id}`); // Log to console.
        editInput.focus(); // Focus on the input element.
    },
    cancel(id) {
        /**
         * Cancel an edit in the to-do list.
         * 
         * @param {number} id - The ID of the task to cancel.
         */
        const wrapper = document.getElementById(`task-${id}`); // Grab the task wrapper.
        if (wrapper) { // Check if the task wrapper exists.
            const original = this.render(user.tasks.find(task => task.id === id), "object"); // Grab the original task as an object.
            wrapper.replaceWith(original);
        };
    },
    save(id) {
        /**
         * Update a task in the to-do list.
         * 
         * @param {number} id - The ID of the task to update.
         * 
         * CONSIDER: Success toast.
         */
        // Find the task in the user.tasks object.
        const newText = document.getElementById(`editing-task-${id}`);
        const taskIndex = user.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            utils.log("Task", `Could not find task with ID: ${id}`);
            return; // Return if the task doesn't exist.
        };

        // Update the task in the user.tasks object, and save the changes.
        user.tasks[taskIndex].text = newText.value;
        user.tasks[taskIndex].updated = Date.now();
        user.save();

        // Reload the task.
        const wrapper = document.getElementById(`task-${id}`);
        if (wrapper) {
            const reloadedWrapper = this.render(user.tasks[taskIndex], "object");
            wrapper.replaceWith(reloadedWrapper);
            utils.log("Task", `Updated task with ID: ${id}`);
        };
    },
    complete(id) {
        /**
         * Mark a task as completed in the to-do list.
         * 
         * @param {number} id - The ID of the task to mark as completed.
         * 
         * TODO: Check if task can be completed, and if prerequisite tasks are completed.
         */
        // Find the task in the user.tasks object.
        const task = user.tasks.find(task => task.id === id);
        if (!task) return; // If the task doesn't exist, return.

        // Toggle the completed status of the task, and save the changes.
        task.completed = !task.completed;
        user.save();

        // Reload the task.
        const wrapper = document.getElementById(`task-${id}`);
        if (wrapper) {
            const reloadedWrapper = this.render(task, "object");
            wrapper.replaceWith(reloadedWrapper);
            if (task.completed) {
                utils.log("Task", `Completed task with ID: ${id}`);
                toast.add("Task complete, good job!", "success");
            } else {
                utils.log("Task", `Marked task incomplete with ID: ${id}`);
            };
        };
    },
    archive(id) {
        /**
         * Archive a completed task.
         * 
         * Should only be called when a task is completed. It is also intended
         * that once a task has been archived, it cannot be undone, only deleted
         * from the archive by the user. This is to prevent the user from going
         * back and fourth between archiving and un-archiving a task.
         * 
         * @param {number} id - The ID of the task to archive.
         */
        // Find the task in the user.tasks object.
        const taskIndex = user.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            utils.log("Task", `Could not find task with ID: ${id}`);
            return; // Return if the task doesn't exist.
        };

        // Check if the task is completed.
        if (user.tasks[taskIndex].completed) {
            // Mark the task as archived, and save the changes.
            user.tasks[taskIndex].archived = true;
            user.save();

            // Render the task in the archive, and remove it from the to-do list.
            this.render(user.tasks[taskIndex]);
            document.getElementById(`task-${id}`).remove();

            // Log to console and toast.
            utils.log("Task", `Archived task with ID: ${id}`);
            toast.add("Task archived", "success");
        };
    }
};
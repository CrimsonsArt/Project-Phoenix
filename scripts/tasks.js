/*---------------------------------- IMPORT ----------------------------------*/
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
                dueDate: null,
                text: taskInput.value,
                pomodoroEstimate: null,
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

            //tasks.render(task); // TODO: Fix.
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
    render: {
        /**
         * Renders elements of the to-do list.
         */
        list() {
            /**
             * Renders the to-do list.
             */
            const wrapper = document.getElementById("todo-list");
            user.tasks.forEach(task => {
                wrapper.prepend(tasks.render.task(task.id));
            });
        },
        task(id) {
            /**
             * Renders a task in the to-do list.
             * 
             * @param {number} id - The ID of the task to render.
             * 
             * TODO: Check if task with that id is already there.
             */
            // Get the task data.
            const task = user.tasks.find(task => task.id === id);

            // Create the wrapper.
            const wrapper = document.createElement("li");
            wrapper.id = `task-${task.id}`;
            wrapper.classList.add("task");

            // Create the text element.
            const text = document.createElement("p");
            text.classList.add("task-text");
            text.id = `task-text-${task.id}`;
            text.textContent = task.text;
            wrapper.appendChild(text);

            // Create the checkbox.
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("check");
            checkbox.id = `check-${task.id}`;
            if (task.completed) {
                checkbox.checked = true;
            };
            wrapper.appendChild(checkbox);

            // Create the timestamp.
            const timestamp = document.createElement("time");
            timestamp.classList.add("task-time");
            timestamp.id = `task-time-${task.id}`;
            timestamp.textContent = utils.formatRelativeTime(new Date(task.date), true);
            wrapper.appendChild(timestamp);

            // Create the controls.
            const controls = document.createElement("div");
            controls.classList.add("task-controls");
            controls.id = `task-controls-${task.id}`;
            wrapper.appendChild(controls);

            // Create the delete button.
            const delBtn = document.createElement("button");
            delBtn.classList.add("task-delete");
            delBtn.id = `task-delete-${task.id}`;
            delBtn.textContent = "Remove";
            controls.appendChild(delBtn);

            // Create the dropdown wrapper.
            const dropWrapper = document.createElement("div");
            dropWrapper.classList.add("task-dropdown");
            dropWrapper.id = `task-dropdown-${task.id}`;
            controls.appendChild(dropWrapper);

            // Create the menu button.
            const menu = document.createElement("button");
            menu.classList.add("task-menu");
            menu.id = `task-menu-${task.id}`;
            menu.ariaLabel = "Open task menu.";
            menu.appendChild(utils.icon("chevron-down"));
            dropWrapper.appendChild(menu);

            // Create the options wrapper.
            const options = document.createElement("div");
            options.classList.add("task-dropdown-content", "closed");
            options.id = `task-dropdown-content-${task.id}`;
            dropWrapper.appendChild(options);

            // Create the edit button.
            const edit = document.createElement("button");
            edit.classList.add("task-edit");
            edit.id = `task-edit-${task.id}`;
            edit.textContent = "Edit";
            options.appendChild(edit);

            // Create the dependency button.
            const dependency = document.createElement("button");
            dependency.classList.add("task-dependency");
            dependency.id = `task-dependency-${task.id}`;
            dependency.textContent = "Dependency";
            options.appendChild(dependency);

            // Create the due date button.
            const due = document.createElement("button");
            due.classList.add("task-due");
            due.id = `task-due-${task.id}`;
            due.textContent = "Due date";
            options.appendChild(due);

            // Return the HTML object.
            return wrapper;
        }
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
        editForm.classList.add("edit-task-wrapper");

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
        editInput.classList.add("edit-task");
        editInput.type = "text";

        // Create the save and cancel buttons, and add event listeners.
        wrapper.appendChild(utils.button("save", "task", id)).addEventListener("click", () => this.save(id));
        wrapper.appendChild(utils.button("cancel", "task", id)).addEventListener("click", () => this.cancel(id));

        // Append the label and input elements to the edit form.
        editForm.appendChild(editLabel);
        editForm.appendChild(editInput).addEventListener("keydown", (event) => {
            // BUG: Fix, still saves on button and enter press.
            if (utils.meetsRequirements("task-form")) { // Check if the form is valid.
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevent the form from submitting.
                    this.save(id);
                } else if (event.key === "Escape") {
                    this.cancel(id);
                };
            } else {
                utils.log("Task", "Form requirements not met.");
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
    },
    hierarchy: {
        /**
         * Functions for task hierarchies.
         * TODO: On click, open hierarchy box.
         * TODO: If box is open, let user set hierarchy inside it.
         * TODO: Drag and drop to add hierarchy.
         * TODO: If task has dependents, display them below it.
         * TODO: Add progress bar for task with dependents.
         * TODO: Make task draggable for hierarchy placement.
         */
        open(id) {
            /**
             * Opens the hierarchy modal.
             */
            /*const wrapper = document.createElement("div");
            wrapper.classList.add("hierarchy-wrapper");
            wrapper.id = `hierarchy-${id}`;*/

            console.log("clicked hierarchy");
            //document.getElementById("todo").prepend(utils.modal("Hierarchy", "Selects for dependents."));
        }
    }
};
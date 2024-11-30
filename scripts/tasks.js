/*---------------------------------- IMPORT ----------------------------------*/
import { companion } from "./companion.js";
import { utils } from "./utils.js";
import { toast } from "./toast.js";
import { user } from "./user.js";

/*--------------------------- TO-DO LIST FUNCTIONS ---------------------------*/
export const tasks = {
    /**
     * To-do list data and functions.
     * 
     * @function add - Add a new task to the task object.
     * @param {object} render - Functions for rendering tasks.
     * @function delete - Delete a task from the to-do list.
     * @function openMenu - Open the task menu.
     * @function edit - Edit a task.
     * @function cancel - Cancel an edit.
     * @function save - Save an edited task.
     * @function complete - Mark a task as completed.
     * @param {object} hierarchy - Functions for task hierarchies.
     * 
     * @returns {object} - The functions for the to-do list.
     */
    add () {
        /**
         * Add a new task to the to-do list.
         */
        const taskInput = document.getElementById("todo-task");
        const taskDue = document.getElementById("todo-due");
        if (taskInput.value != "") { // Check if task input is not empty.
            const task = { // Create task object.
                id: user.nextTaskId,
                date: Date.now(),
                dueDate: null,
                text: taskInput.value,
                pomodoroEstimate: null,
                parentID: null,
                childIDs: [],
                completed: false,
                completedDate: null
            };
            if (taskDue.value != "") {
                task.dueDate = taskDue.value;
            };

            const subtask = document.getElementById("task-add-subtask");
            if (subtask && subtask.value !== "") {
                console.log("Adding subtask to parent task.");
                // Add the task as a subtask of the selected task.
                const parentTaskID = Number(subtask.value);
                task.parentID = parentTaskID;

                // Get the index of the parent task.
                const parentIndex = user.tasks.findIndex(task => task.id === parentTaskID);
                if (parentIndex > -1) {
                    console.log("Parent task found.");
                    user.tasks[parentIndex].childIDs.push(user.nextTaskId);
                    if (user.debug === true) {
                        console.log(`[tasks.add]: Added task with ID: ${user.nextTaskId} as a subtask of task with ID: ${parentTaskID}`);
                    };
                };
            };

            // Log to console, and save changes.
            console.log(`Adding task: ${task}`);
            user.tasks.push(task); // Add task to user.tasks array.
            user.nextTaskId++; // Increment ID.
            user.save(); // Save changes to user object.
            tasks.render.list(); // Re-render the task list.
            taskInput.value = ""; // Clear the task input.
            taskDue.value = ""; // Clear the due date input.
            tasks.hierarchy.add(); // Re-render the subtask selector.
            if (subtask) subtask.value = ""; // Clear the subtask selector.
            toast.add("Task added successfully.", "success");

        // If task input is empty.
        } else {
            toast.add("Task title can't be empty.", "error"); // Error toast.
        };
    },
    render: {
        /**
         * Renders elements of the to-do list.
         * 
         * @function list - Renders the to-do list.
         * @function task - Renders a task in the to-do list.
         * @function compact - Render a compact task display in the calendar.
         */
        list () {
            /**
             * Renders the to-do list.
             */
            // Clear the list.
            const wrapper = document.getElementById("todo-list");
            wrapper.innerHTML = "";

            // Get tasks with no parents.
            const rootTasks = user.tasks.filter(task => task.parentID === null);

            // Render the root tasks.
            rootTasks.forEach(task => {
                const parentTask = tasks.render.task(task.id);
                wrapper.appendChild(parentTask);

                // Render subtasks recursively.
                function renderSubtasks(task, parentElement) {
                    if (task.childIDs.length > 0) {
                        const subtaskList = document.createElement("ul");
                        subtaskList.classList.add("has-subtasks");
                        parentElement.appendChild(subtaskList);

                        // Find the subtask.
                        task.childIDs.forEach(subtaskID => {
                            const subtask = user.tasks.find(task => task.id === subtaskID);

                            // Render the subtask.
                            if (subtask) {
                                const subtaskElement = tasks.render.task(subtask.id);
                                subtaskList.appendChild(subtaskElement);

                                // Recursively render any subtasks of this subtask.
                                renderSubtasks(subtask, subtaskElement);
                            };
                        });
                    };
                };
                // Start rendering subtasks for the root task
                renderSubtasks(task, parentTask);
            });
        },
        task (id) {
            /**
             * Renders a task in the to-do list.
             * 
             * @param {number} id - The ID of the task to render.
             */
            // Get the task data.
            const task = user.tasks.find(task => task.id === id);
            if (!task) return; // Return if the task doesn't exist.

            // Create the wrapper.
            const listItem = document.createElement("li");
            listItem.id = `task-${task.id}`;
            listItem.classList.add("task");

            // Create the wrapper.
            const wrapper = document.createElement("div");
            wrapper.classList.add("task-wrapper");
            listItem.appendChild(wrapper);

            // Create the text element.
            const text = document.createElement("p");
            text.classList.add("task-text");
            text.id = `task-text-${task.id}`;
            text.textContent = task.text;
            wrapper.appendChild(text);

            // Create the checkbox.
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("task-check");
            checkbox.id = `check-${task.id}`;
            if (task.completed) {
                checkbox.checked = true;
            };

            // Add due date, if any.
            if (task.dueDate) {
                const due = document.createElement("time");
                due.classList.add("task-due");
                due.id = `task-due-${task.id}`;
                due.textContent = `Due: ${task.dueDate}`;
                due.dateTime = task.dueDate;
                wrapper.appendChild(due);
            };

            // Check if the task has subtasks.
            if (task.childIDs.length > 0) {
                // Recursive function to calculate task progress.
                function calculateProgress(taskId) {
                    const task = user.tasks.find(t => t.id === taskId);
                    if (!task) return { total: 0, completed: 0 };

                    // Initialize counts.
                    let total = 1; // Count the current task.
                    let completed = task.completed ? 1 : 0;

                    // Recursively calculate progress for child tasks.
                    task.childIDs.forEach(childId => {
                        const childProgress = calculateProgress(childId);
                        total += childProgress.total;
                        completed += childProgress.completed;
                    });
                    return { total, completed };
                };

                // Get progress for this task.
                const { total, completed } = calculateProgress(id);

                // Create the progress element.
                const progressBar = document.createElement("progress");
                progressBar.max = total; // Total number of tasks.
                progressBar.value = completed; // Number of completed tasks.
                progressBar.classList.add("task-progress-bar");

                // Optional: Add a text label for progress.
                const progressLabel = document.createElement("span");
                progressLabel.classList.add("progress-label");
                progressLabel.textContent = `${Math.round((completed / total) * 100)}%`;

                // Optional: Add a screen reader span for progress.
                const progressSpan = document.createElement("span");
                progressSpan.classList.add("sr-only");
                progressSpan.textContent = " completed";
                progressLabel.appendChild(progressSpan);

                // Wrap the progress bar and label.
                const progressWrapper = utils.wrapInput(progressBar, progressLabel);
                progressWrapper.classList.remove("form-field");
                progressWrapper.classList.add("task-progress");
                wrapper.appendChild(progressWrapper);

                // Check if any child tasks are incomplete.
                const hasIncompleteChildren = task.childIDs.some(childId => {
                    const childTask = user.tasks.find(t => t.id === childId);
                    return childTask && !childTask.completed;
                });

                // Disable the checkbox if any child is incomplete
                if (hasIncompleteChildren) {
                    checkbox.disabled = true;
                    checkbox.title = "Complete all subtasks first"; // Tooltip for user feedback
                };
            };
            wrapper.appendChild(checkbox).addEventListener("change", () => tasks.complete(task.id));

            // Create the timestamp.
            const timestamp = document.createElement("time");
            timestamp.classList.add("task-time");
            timestamp.id = `task-time-${task.id}`;
            timestamp.textContent = "(" + utils.formatRelativeTime(new Date(task.date), true) + ")";
            wrapper.appendChild(timestamp);

            // Create the dropdown wrapper.
            const dropWrapper = document.createElement("div");
            dropWrapper.classList.add("task-dropdown");
            dropWrapper.id = `task-dropdown-${task.id}`;
            wrapper.appendChild(dropWrapper);

            // Create the menu button.
            const menu = document.createElement("button");
            menu.classList.add("task-menu");
            menu.id = `task-menu-${task.id}`;
            menu.ariaLabel = "Open task menu.";
            menu.ariaExpanded = false;
            menu.type = "button";
            const menuIcon = document.createElement("span");
            menuIcon.ariaHidden = true;
            menuIcon.classList.add("bi", "bi-chevron-down");
            menuIcon.id = `task-menu-icon-${task.id}`;
            menu.appendChild(menuIcon);
            dropWrapper.appendChild(menu);
            menu.addEventListener("click", () => tasks.openMenu(task.id));

            // Create the options wrapper.
            const options = document.createElement("div");
            options.classList.add("task-dropdown-content", "closed");
            options.id = `task-dropdown-content-${task.id}`;
            dropWrapper.appendChild(options);

            /*// Create the goal button.
            const goal = document.createElement("button");
            goal.classList.add("task-goal");
            goal.id = `task-goal-${task.id}`;
            goal.textContent = "Set as goal";
            goal.type = "button";
            options.appendChild(goal);*/

            // Create the edit button.
            const edit = document.createElement("button");
            edit.classList.add("task-edit");
            edit.id = `task-edit-${task.id}`;
            edit.textContent = "Edit";
            edit.type = "button";
            options.appendChild(edit);
            edit.addEventListener("click", () => tasks.edit(task.id));

            // Create the delete button.
            const delBtn = utils.button("delete", "Delete task", "trash");
            delBtn.classList.add("task-delete");
            options.appendChild(delBtn).addEventListener("click", () => tasks.delete(task.id));

            // Return the HTML object.
            return listItem;
        },
        compact (data) {
            /**
             * Render a compact task display in the calendar.
             * 
             * @param {Object} data - The task data object.
             */
            // Create the elements for the compact task display.
            const wrapper = document.createElement("div");
            const span = document.createElement("span");

            // Set the properties of the wrapper.
            wrapper.classList.add("compact-task");
            wrapper.id = `compact-task-${data.id}`;
            wrapper.tabindex = 0;

            // Set the properties of the task title span.
            span.classList.add("compact-task-title");
            span.textContent = data.text;

            // Add the elements to the wrapper, and return it.
            wrapper.appendChild(span);
            return wrapper;
        }
    },
    async delete (id) {
        /**
         * Delete a task from the to-do list.
         * 
         * @param {number} id - The ID of the task to delete.
         */
        // Find the task with the given id.
        const task = user.tasks.find(task => task.id === id);

        // Check if the task has subtasks, and warn the user.
        if (task.childIDs.length > 0) {
            console.warn("[tasks.delete]: This task has subtasks. Deleting it will also delete all subtasks.");
            const confirmDelete = await companion.dialog.ask("This task has subtasks. Deleting it will also delete all its subtasks. Are you sure you want to delete it?");
            if (!confirmDelete) {
                console.log("[tasks.delete]: User cancelled task deletion.");
                return; // If the user cancels, return.
            } else {
                console.log("[tasks.delete]: User confirmed task deletion.");
            };
        };

        // Remove task from DOM.
        const taskToRemove = document.getElementById(`task-${id}`);
        if (taskToRemove) {
            taskToRemove.remove();
        };

        // Remove the task from the user.tasks array.
        user.tasks = user.tasks.filter(task => task.id !== id);

        // Log to console, and save changes.
        if (user.debug === true) {
            console.log("[tasks.delete]: ", `Deleting task with ID: ${id}`);
        };
        user.save();
        toast.add("Task deleted successfully.", "success");
    },
    currentlyOpen: null,
    openMenu (id) {
        /**
         * Open the task menu.
         * 
         * @param {number} id - The ID of the task to open the menu for.
         */
        const dropdown = document.getElementById(`task-dropdown-content-${id}`);
        const menu = document.getElementById(`task-menu-${id}`);
        const icon = document.getElementById(`task-menu-icon-${id}`);

        // Check if another menu is open.
        if (tasks.currentlyOpen && tasks.currentlyOpen !== id) {
            // Close the open menu, and edit its aria attributes.
            const openMenu = document.getElementById(`task-menu-${tasks.currentlyOpen}`);
            const openDropdown = document.getElementById(`task-dropdown-content-${tasks.currentlyOpen}`);
            openDropdown.classList.add("closed");
            openMenu.ariaExpanded = false;
            openMenu.ariaLabel = "Open task menu";

            // Remove the "bi-chevron-up" class from the open icon.
            const openIcon = document.getElementById(`task-menu-icon-${tasks.currentlyOpen}`);
            openIcon.classList.toggle("bi-chevron-up");

            // Open the new menu, and edit its aria attributes.
            dropdown.classList.remove("closed");
            menu.ariaExpanded = true;
            menu.ariaLabel = "Close task menu";

            // Add the "bi-chevron-up" class to the new icon.
            icon.classList.toggle("bi-chevron-up");

            // Set the currently open menu to the new menu.
            tasks.currentlyOpen = id;
        } else {
            // Toggle the open/close state of the menu.
            if (dropdown.classList.contains("closed")) {
                dropdown.classList.remove("closed");
                menu.ariaExpanded = true;
                menu.ariaLabel = "Close task menu";

                // Toggle the "bi-chevron-up" class on the icon.
                icon.classList.add("bi-chevron-up");

                // Set the currently open menu to the new menu.
                tasks.currentlyOpen = id;
            } else {
                dropdown.classList.add("closed");
                menu.ariaExpanded = false;
                menu.ariaLabel = "Open task menu";

                // Toggle the "bi-chevron-up" class on the icon.
                icon.classList.remove("bi-chevron-up");

                // Set the currently open menu to null.
                tasks.currentlyOpen = null;
            };
        };
    },
    edit (id) {
        /**
         * Edit a task in the to-do list.
         * 
         * @param {number} id - The ID of the task to edit.
         */
        // Find the task in the user.tasks object.
        const task = user.tasks.find(task => task.id === id);
        if (task && document.getElementById(`task-${id}`)) {
            if (user.debug === true) {
                console.log(`[tasks.edit]: Editing task: ${task.text}`);
            };

            // Get the task wrapper, and clear it.
            const wrapper = document.getElementById(`task-${id}`);
            wrapper.innerHTML = "";

            // Create the edit form.
            const editForm = document.createElement("form");
            editForm.id = `editing-task-${id}`;
            editForm.classList.add("edit-task-wrapper");

            // Create the text input.
            const editInput = document.createElement("input");
            editInput.id = `task-editing-text-${id}`;
            editInput.placeholder = task.text;
            editInput.value = task.text;
            editInput.type = "text";
            editInput.spellcheck = true;
            editInput.autocomplete = "off";
            editInput.classList.add("task-edit-text");

            // Create the label for the input.
            const editLabel = document.createElement("label");
            editLabel.htmlFor = `task-editing-text-${id}`;
            editLabel.textContent = "Edit task: ";
            //editLabel.classList.add("sr-only");

            // Wrap the input and label.
            const editWrap = utils.wrapInput(editLabel, editInput);

            // Append the wrapped input to the form.
            editForm.appendChild(editWrap);

            // Add the due date input.
            const dueInput = document.createElement("input");
            dueInput.type = "date";
            dueInput.id = `task-editing-due-${id}`;
            dueInput.classList.add("edit-task-due");

            // Create the label for the due date input.
            const dueLabel = document.createElement("label");
            dueLabel.htmlFor = `task-editing-due-${id}`;
            dueLabel.textContent = "Due date: ";
            //dueLabel.classList.add("sr-only");

            // Add the due date to the input, if it exists.
            if (task.dueDate) {
                dueInput.value = task.dueDate;
            };

            // Wrap the due date input and label.
            const dueWrap = utils.wrapInput(dueLabel, dueInput);

            // Add subtask selector.
            const subtaskWrap = tasks.hierarchy.add("return", id);
            const subtaskSelect = subtaskWrap.querySelector("select");

            // Set the selected option to the parent task.
            if (task.parentID !== null && subtaskSelect) {
                console.log("Setting parent task as selected option.");
                Array.from(subtaskSelect.options).forEach(option => {
                    if (Number(option.value) === task.parentID) {
                        option.selected = true;
                    };
                });
            };

            // Add the save and cancel buttons.
            const controls = document.createElement("div");
            controls.classList.add("controls");
            const saveBtn = utils.button("save", "Save changes to task", "floppy");
            const cancelBtn = utils.button("cancel", "Cancel editing task");
            controls.appendChild(saveBtn).addEventListener("click", () => tasks.save(id));
            controls.appendChild(cancelBtn).addEventListener("click", () => tasks.cancel(id));

            // Append the inputs and controls to the form.
            editForm.appendChild(editWrap);
            editForm.appendChild(dueWrap);
            editForm.appendChild(subtaskWrap);
            editForm.appendChild(controls);

            // Replace the task with the edit form.
            wrapper.appendChild(editForm);
            editForm.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevent the form from submitting.
                    tasks.save(id);
                } else if (event.key === "Escape") {
                    tasks.cancel(id);
                };
            });

            // Focus on the text input element.
            editInput.focus();


        // Error handling.
        } else {
            if (user.debug === true) {
                console.log(`[tasks.edit]: ERROR - Could not find task with ID: ${id}. If this issue persists, please report it on GitHub.`);
            };
        };
    },
    cancel (id) {
        /**
         * Cancel an edit in the to-do list.
         * 
         * @param {number} id - The ID of the task to cancel.
         */
        // Grab the task wrapper.
        const wrapper = document.getElementById(`editing-task-${id}`);

        // Check if the task wrapper exists.
        if (wrapper) {
            const list = document.getElementById("todo-list");

            // Clear the list, and re-render it.
            list.innerHTML = "";
            tasks.render.list();

            // Log to console.
            if (user.debug === true) {
                console.log(`[tasks.cancel]: Cancelled editing task with ID: ${id}`);
            };
        };
    },
    save (id) {
        /**
         * Update a task in the to-do list.
         * 
         * @param {number} id - The ID of the task to update.
         */
        // Find the task and its index in the user.tasks object.
        const taskIndex = user.tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {

            // Get the new task text.
            const newText = document.getElementById(`task-editing-text-${id}`);
            if (newText) user.tasks[taskIndex].text = newText.value;
            
            // Get the new due date.
            const newDue = document.getElementById(`task-editing-due-${id}`);
            if (newDue) user.tasks[taskIndex].dueDate = newDue.value;

            // Add the task as a subtask of the selected task.
            const newSubtask = document.getElementById(`task-add-subtask-${id}`);
            if (newSubtask && newSubtask.value !== "") {
                const parentTaskID = Number(newSubtask.value);
                user.tasks[taskIndex].parentID = parentTaskID;

                // Get the index of the parent task.
                const parentIndex = user.tasks.findIndex(task => task.id === parentTaskID);
                if (parentIndex > -1) {
                    user.tasks[parentIndex].childIDs.push(id);
                    if (user.debug === true) {
                        console.log(`[tasks.save]: Added task with ID: ${id} as a subtask of task with ID: ${parentTaskID}`);
                    };
                };

            // Remove the parent task if the subtask is empty.
            } else if (newSubtask && newSubtask.value === "") {
                user.tasks[taskIndex].parentID = null;

                // Remove the task from the parent's childIDs array.
                const parentTask = user.tasks.find(task => task.childIDs.includes(id));
                if (parentTask) {
                    parentTask.childIDs = parentTask.childIDs.filter(childID => childID !== id);
                    if (user.debug === true) {
                        console.log(`[tasks.save]: Removed task with ID: ${id} from the subtasks of task with ID: ${parentTask.id}`);
                    };
                };
            };

            // Save the changes, and re-render the task.
            user.tasks[taskIndex].updated = Date.now();
            user.save();

            // Clear the list, and re-render it.
            const list = document.getElementById("todo-list");
            list.innerHTML = "";
            tasks.render.list();

            // Log to console.
            if (user.debug === true) {
                console.log(`[tasks.save]: Saved changes to task with ID: ${id}`);
            };

        // Error handling.
        } else {
            if (user.debug === true) {
                console.log(`[tasks.save]: ERROR - Could not find task with ID: ${id}. If this issue persists, please report it on GitHub.`);
            };
        };
    },
    complete (id) {
        /**
         * Mark a task as completed in the to-do list.
         * 
         * @param {number} id - The ID of the task to mark as completed.
         */
        // Find the task in the user.tasks object.
        const task = user.tasks.find(task => task.id === id);
        if (!task) return; // If the task doesn't exist, return.

        // Check if the task has subtasks.
        if (task.childIDs.length > 0) {
            // Verify if all child tasks are completed
            const allChildrenCompleted = task.childIDs.every(childId => {
                const childTask = user.tasks.find(t => t.id === childId);
                return childTask && childTask.completed;
            });
            if (!allChildrenCompleted) {
                console.warn("[tasks.complete]: Cannot complete this task until all subtasks are completed.");
                return false; // Prevent marking the parent as complete
            };
        };

        // Toggle the completed status of the task, and save the changes.
        task.completed = !task.completed;
        user.save();

        // Reload the task.
        tasks.render.list();

        // Log to console.
        if (task.completed) {
            if (user.debug === true) {
                console.log("[tasks.complete]: " + `Completed task with ID: ${id}`);
            };
            // Have the companion congratulate the user.
            companion.dialog.say("Good job on completing the task!");
        } else {
            if (user.debug === true) {
                console.log("[tasks.complete]: " + `Marked task incomplete with ID: ${id}`);
            };
        };
    },
    hierarchy: {
        /**
         * Functions for task hierarchies.
         * 
         * @function add - Add a subtask selector to a task form.
         */
        add (target = null, id = null) {
            /**
             * Lets the user select a task as a dependency.
             * 
             * @param {object} target - The target element to append the dependency selector to.
             * @param {number} id - The ID of the task to add a dependency to.
             */
            // Remove the existing subtask selector.
            if (document.getElementById("task-add-subtask")) {
                document.getElementById("task-add-subtask").remove();
            };

            // Create the task select element.
            const select = document.createElement("select");
            select.classList.add("task-hierarchy", "task-subtask");
            select.name = `task-add-subtask`;
            select.id = `task-add-subtask`;

            // Create the default select option.
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select a task";
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            // Add the tasks as options.
            if (user.tasks && user.tasks.length > 0) {
                // Sort tasks into hierarchical and non-hierarchical groups.
                const hierarchicalTasks = user.tasks.filter(task => task.parentID !== null || task.childIDs.length > 0);
                const nonHierarchicalTasks = user.tasks.filter(task => task.parentID === null && task.childIDs.length === 0);

                // Recursive function to render tasks hierarchically.
                function renderHierarchy(taskId, level = 0) {
                    const task = user.tasks.find(task => task.id === taskId);
                    if (!task) return;

                    // Create and append the option.
                    const option = document.createElement("option");
                    option.value = task.id;

                    // Indent based on hierarchy level.
                    option.textContent = `${"—".repeat(level)} ${task.text}`;
                    option.classList.add(level === 0 ? "optionGroup" : "optionChild");
                    select.appendChild(option);

                    // Disable the option if it's the current task.
                    if (task.id === id) {
                        option.disabled = true;
                        option.textContent += " (Current Task)";
                    };

                    // Render child tasks recursively.
                    if (task.childIDs.length > 0) {
                        task.childIDs.forEach(childID => renderHierarchy(childID, level + 1));
                    };
                };

                // Render hierarchical tasks, starting with root tasks.
                hierarchicalTasks.forEach(task => {
                    if (task.parentID === null) {
                        renderHierarchy(task.id);
                    };
                });

                // Render non-hierarchical tasks.
                nonHierarchicalTasks.forEach(task => {
                    const option = document.createElement("option");
                    option.value = task.id;
                    option.textContent = task.text;

                    // Disable the option if it's the current task.
                    if (task.id === id) {
                        option.disabled = true;
                        option.textContent += " (Current Task)";
                    };

                    // Append the option to the select element.
                    select.appendChild(option);
                });
            };

            // Create the subtask label element.
            const label = document.createElement("label");
            label.textContent = `This task is a subtask of: `;

            // Add id if entered.
            if (id) {
                select.id = `task-add-subtask-${id}`;
                label.htmlFor = `task-add-subtask-${id}`;
            } else {
                select.id = `task-add-subtask`;
                label.htmlFor = `task-add-subtask`;
            };

            // Wrap the select and label.
            const wrapper = utils.wrapInput(label, select);

            // Append the wrapper to the target element.
            if (target === "return") {
                return wrapper;
            } else {
                // Remove the "add as subtask" button.
                const button = document.getElementById("add-hierarchy");
                if (button) {
                    button.remove();
                };
                document.getElementById("task-field").appendChild(wrapper);
            };
        }
    }
};
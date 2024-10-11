/*-------------------------- USER DATA & FUNCTIONS ---------------------------*/
const user = {
    /**
     * User data.
     * 
     * @param {string} name - The user's name.
     * @param {array} events - The user's events.
     * @param {array} tasks - The user's to-do list.
     * @param {array} pomodoros - The user's pomodoro log.
     * 
     * @function save - Save user object to local storage.
     * @function load - Load user object from local storage.
     * @function export - Export user data to a JSON file.
     * @function import - Import user data from a JSON file.
     * @function showEvents - See all of the user's events in the console.
     * @function showTasks - See all of the user's tasks in the console.
     * 
     * @returns {object} user - The user's data.
     */
    name: "",
    events: [],
    tasks: [],
    pomodoros: [],

    save: function() {
        /**
         * Save user data to local storage.
         */
        const userData = JSON.stringify(this);
        localStorage.setItem("user", userData);
        ui.log("User - save", "User data successfully saved to local storage.");
    },
    load: function() {
        /**
         * Load user data from local storage.
         */
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            // Update user object with saved data.
            Object.assign(this, parsedUser);
            ui.log("User - load", "User data successfully loaded from local storage.");
        } else {
            ui.log("User - load", "No user data found in local storage.");
        };
    },
    export: function() {
        /**
         * Export user data to a JSON file.
         */
        // Convert user object to a JSON string.
        const jsonString = JSON.stringify(this, null, 2)
        
        // Create a blob with the JSON data.
        const blob = new Blob([jsonString], {type: "application/json"});

        // Generate a URL for the blob.
        const url = URL.createObjectURL(blob);

        // Create a temporary link element.
        const tempLink = document.createElement("a");
        tempLink.href = url;
        tempLink.download = `Project-Phoenix-${calendar.timestamp()}.json`;

        // Click the link to download the file, and remove it from the DOM.
        tempLink.click();
        URL.revokeObjectURL(url);

        // Toast success message.
        ui.toast("User data exported successfully.", "success");
    },
    import: function() {
        /**
         * Import user data from a JSON file.
         */
        const file = document.getElementById("import-data").files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // Update user object with imported data.
                    Object.assign(user, importedData);
                    ui.log("User - import", "User data successfully imported from file.");

                    // Save the imported data to local storage.
                    user.save();

                    // Show a success toast.
                    ui.toast("User data imported and saved successfully.", "success");

                    // Re-render the calendar and tasks.
                    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
                    tasks.renderTasks();
                } catch (error) {
                    // Show error toast.
                    ui.toast("Failed to import user data. Please ensure it is a valid JSON file and try again.", "error");
                };
            };
            // Read the file as text.
            reader.readAsText(file);
        };
    },
    showEvents: function() {
        /**
         * Show all of the user's events in the console.
         */
        ui.log("Console - showEvents", "Showing all of the user's events in the console...");
        this.events.forEach((event, index) => {
            ui.log(`Console - event ${index + 1}`, `${event.title}, Date: ${event.date}, Time: ${event.time}, Description: ${event.description}`);
        });
    },
    showTasks: function() {
        /**
         * Show all of the user's tasks in the console.
         */
        ui.log("Console - showTasks", "Showing all of the user's tasks in the console...");
        this.tasks.forEach((task) => {
            ui.log(`Console - task ${task.id}`, `${task.title} - ${task.completed ? "Complete" : "Incomplete"}`);
        });
    }
};

/*------------------------- USER INTERFACE FUNCTIONS -------------------------*/
const ui = {
    /**
     * Controls the user interface.
     * 
     * @function log - Logs messages to the console.
     * @function icon - Generates an icon HTML string.
     * @function controls - Generate control panels.
     * @function toast - Show a toast message.
     * 
     * @returns {object} ui - The user interface object. 
     */
    log: function(origin, message) {
        /**
         * Logs messages to the console.
         * 
         * @param {string} origin - The origin of the message.
         * @param {string} message - The message to log.
         * */
        console.log(`[${origin}]: ${message}`);
    },
    icon: function(iconName) {
        /**
         * Generates an icon HTML string.
         */
        return `<span class="bi bi-${iconName}" aria-hidden="true"></span>`;
    },
    controls: function(buttons = [], labelContext = "", events = {}) {
        /**
         * Generate control buttons.
         * 
         * TODO: Update icons.
         */
        // Define button types.
        const buttonTypes = {
            edit: {
                text: "edit",
                icon: "pencil-square",
                ariaLabel: `Edit ${labelContext}`
            },
            delete: {
                text: "delete",
                icon: "trash",
                ariaLabel: `Delete ${labelContext}`
            },
            add: {
                text: "add",
                icon: "plus-circle",
                ariaLabel: `Add new ${labelContext}`
            },
            submit: {
                text: "submit",
                icon: "plus-circle",
                ariaLabel: `Submit ${labelContext}`
            },
            update: {
                text: "update",
                icon: "arrow-repeat",
                ariaLabel: `Update ${labelContext}`
            }
        };

        // Create the control panel.
        let panel = document.createElement("div");
        panel.classList.add("control-panel");

        // Add buttons to the control panel.
        buttons.forEach((buttonType) => {
            if (buttonTypes[buttonType]) {
                // Create the button.
                const button = document.createElement("button");

                // Add attributes to the button.
                button.title = buttonTypes[buttonType].ariaLabel;
                button.ariaLabel = buttonTypes[buttonType].ariaLabel;
                button.classList.add(`btn-${labelContext}-${buttonTypes[buttonType].text}`);
                button.type = "button";

                // Add event listeners to the button.
                if (events[buttonType]) {
                    button.addEventListener("click", events[buttonType]);
                } else if (!events) {
                    // Log error.
                    ui.log("Control Panel - error", `No event listener defined for button type: ${buttonType}`);
                } else {
                    // Log error.
                    ui.log("Control Panel - error", `Invalid event type: ${buttonType}`);
                };

                // Generate the button icon.
                button.innerHTML = this.icon(buttonTypes[buttonType].icon);

                // Add the button to the panel.
                panel.appendChild(button);
            } else {
                // Log error.
                ui.log("Control Panel - error", `Invalid button type: ${buttonType}`);
            };
        });

        return panel;
    },
    toast: function(message, title = "info") {
        /**
         * Show toast messages.
         * 
         * TODO: Ensure that toast messages don't overlap.
         * CONSIDER: Toast-log for the user.
         */
        // Create toast container.
        let toastContainer = document.getElementsByTagName("header")[0];
        let toast = document.createElement("div");

        // Add info to toast.
        toast.classList.add("toast", title, "show");
        toast.innerHTML = `<h2>${title.charAt(0).toUpperCase() + title.slice(1)}:</h2>
        <p>${message}</p>
        <button id="toast-close" aria-label="Close toast">
            <span class="bi bi-x-square" aria-hidden="true"></span>
        </button>`;

        // Add toast to container and log to console.
        toastContainer.appendChild(toast);
        ui.log(`Toast - ${title}`, message);

        // Initial removal timer (e.g., 5 seconds = 5000 milliseconds).
        const totalTimeout = 5000;
        let startTime = Date.now();
        let remainingTime = totalTimeout;
        let toastClose = document.getElementById("toast-close");

        // Function to remove the toast.
        const removeToast = (fadeout = 100) => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), fadeout);
            ui.log(`Toast - ${title}`, `Removed ${title} toast.`);
        };

        // Start the removal timer.
        let removalTimer = setTimeout(removeToast, remainingTime);
        ui.log(`Toast - start timer`, `Removing in ${totalTimeout}ms.`);

        // Pause and resume the removal timer.
        const toggleTimer = (pause) => {
            if (pause) {
                clearTimeout(removalTimer);
                remainingTime -= (Date.now() - startTime);
                ui.log(`Toast - pause timer`, `Pausing removal timer.`);
            } else if (!document.activeElement.closest(".toast")) {
                startTime = Date.now();
                removalTimer = setTimeout(removeToast, remainingTime);
                ui.log(`Toast - resume timer`, `Resuming removal timer.`);
            };
        };

        // Event listeners for pause and resume.
        toast.addEventListener("mouseenter", () => toggleTimer(true));
        toast.addEventListener("mouseleave", () => toggleTimer(false));
        toastClose.addEventListener("focus", () => toggleTimer(true));
        toastClose.addEventListener("focusout", () => toggleTimer(false));

        // Close the toast on click.
        toastClose.addEventListener("click", () => {
            clearTimeout(removalTimer);
            removeToast(0);
        });
    }
};

/*---------------------------- CALENDAR FUNCTIONS ----------------------------*/
const calendar = {
    /**
     * Calendar data and functions.
     * 
     * @param {date} today - The current date.
     * @param {array} months - The months of the year.
     * @param {number} thisMonth - The current month.
     * @param {number} thisYear - The current year.
     * @param {date} activeDay - The selected day.
     * 
     * @function timestamp - Convert a date to a timestamp.
     * @function renderCalendar - Render the calendar.
     * @function openDay - Open the selected day in the calendar.
     * @function isEventDay - Check if the date is in the user's events.
     * @function addEvent - Add a new event to the calendar.
     * @function next - Move to the next month.
     * @function previous - Move to the previous month.
     * 
     * @returns {object} calendar - The calendar object.
     */
    today: new Date(),
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    thisMonth: new Date().getMonth(),
    thisYear: new Date().getFullYear(),
    activeDay: null,

    timestamp: function() {
        /**
         * Format a date as YYYY-MM-DD.
         */
        const date = new Date();
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    },
    renderCalendar: function(month, year) {
        /**
         * Render the calendar.
         * 
         * @param {number} month - The month to render.
         * @param {number} year - The year to render.
         */
        // Grab the calendar body.
        let title = document.getElementById("cal-title");
        let table = document.getElementById("cal-body");
        let firstDay = (((new Date(year, month)).getDay() - 1) + 7) % 7;
        let date = 1;
        
        // Fill data about month and year in the page via DOM.
        title.innerHTML = this.months[month] + " " + year;

        // Clear the table.
        table.innerHTML = "";

        // Loop through weeks of the month.
        for (let i = 0; i < 6; i++) {
            let week = document.createElement("tr");

            // Loop through days of the week.
            for (let j = 0; j < 7; j++) {
                let day = document.createElement("td");
                let dayNum = document.createTextNode("");
                let dayEvent = "";

                // Add empty cells for previous month's days.
                if (i === 0 && j < firstDay) {
                    // TODO: Add previous month's days, and have them look faded out.
                    day.appendChild(dayNum);
                    week.appendChild(day);

                // Break the loop when all days are added.
                } else if (date > (32 - new Date(year, month, 32).getDate())) {
                    // TODO: If more days in the week add next month's days, and have them look faded out.
                    break;

                // Add days to the table.
                } else {
                    // Highlight today's date.
                    if (date === this.today.getDate() && month === this.today.getMonth() && year === this.today.getFullYear()) {
                        day.classList.add("today");
                    };

                    // Create a full date string.
                    let fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

                    // Check if this day has an event.
                    if (this.isEventDay(fullDate)) {
                        // Add a class to the day if it has an event.
                        day.classList.add("event-day");

                        // Find the event in the user.events object.
                        let event = user.events.find(event => event.date === fullDate);

                        // Add the event data to the day.
                        dayEvent = `<div class="cal-event">
                            <span class="event-title">${event.title}</span>
                            <time class="event-time" datetime="${event.time}">${event.time}</time>
                            <span class="event-description">${event.description}</span>
                        </div>`;
                    };

                    // Add the date as an attribute to the day cell.
                    day.setAttribute("data-date", `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`);
                    day.classList.add("cal-day");

                    // Add the date to the day, and add the day to the week.
                    // TODO: Turn date into a title?
                    // TODO: Improve date formatting. (.th, .st, etc.)
                    day.innerHTML = `<time class="cal-date" datetime="${fullDate}">
                        ${date}
                        <span class="sr-only">${this.months[month]}</span>
                    </time>
                    ${dayEvent}`;
                    week.appendChild(day);
                    date++;
                };
            };

            // Add week to the table.
            table.appendChild(week);
        };

        // Add event listener to activate a day.
        document.getElementById("cal-body").addEventListener("click", (event) => {
            // Use closest() to find the nearest day element.
            const clickedDay = event.target.closest(".cal-day");
            // BUG: clickedDay is null if having used the previous or next functions.

            // Check if the clicked element is a day.
            if (clickedDay.classList.contains("cal-day")) {
                // Get the date of the clicked day.
                const selectedDay = clickedDay.getAttribute("data-date");

                // Focus on the selected day.
                this.openDay(selectedDay);
            };
        });
    },
    openDay: function(day) {
        /**
         * Focus on the selected day.
         * 
         * @param {string} day - The date string to focus on.
         * 
         * TODO: Only open edit and delete buttons on days that have events.
         * TODO: Add the ability to edit and remove events.
         * TODO: Ensure that if a day is already open, keep it open.
         */

        // If a day is already active, clear the old active day.
        if (this.activeDay) {
            // Remove the active class.
            this.activeDay.classList.remove("active");

            // Remove the control panel.
            this.activeDay.removeChild(this.activeDay.querySelector(".control-panel"));
        };

        // Find the correct day cell to focus on.
        const selectedDay = document.querySelector(`[data-date="${day}"]`);

        // If a day is found, open it.
        if (selectedDay) {
            // Update the active day reference to the new active day.
            this.activeDay = selectedDay;

            // Add the active class to the selected day, and log to console.
            selectedDay.classList.add("active");
            ui.log("Calendar - select", `Opened day: ${day}`);

            // Render the control panel for the selected day.
            const controlPanel = ui.controls(["edit", "delete"], "event", {edit: this.editEvent, delete: this.deleteEvent});
            selectedDay.appendChild(controlPanel);
        };
    },
    isEventDay: function(dateString) {
        /**
         * Check if the date is in the user's events.
         * 
         * @param {string} dateString - The date string to check.
         * 
         * @returns {boolean} - True if the date is in the user's events, false otherwise.
         * 
         * TODO: Toast if today is an event day.
         */
        return user.events.some(event => event.date === dateString);
    },
    addEvent: function() {
        /**
         * Add an event to the calendar.
         * 
         * TODO: Allow users to submit the event using the enter key.
         * TODO: Remove data from input fields after submission.
         */
        let eventTitle = document.getElementById("event-title").value;
        let eventDate = document.getElementById("event-date").value;
        let eventTime = document.getElementById("event-time").value;
        let eventDescription = document.getElementById("event-description").value;

        // Add event to the calendar.
        if (eventTitle && eventDate) {
            // Create an event object.
            const event = {
                title: eventTitle,
                date: eventDate,
                time: eventTime,
                description: eventDescription
            };

            // Add the event to the user object.
            user.events.push(event);
            user.save();

            // Re-render the calendar.
            calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);

            // Clear the input fields.
            document.getElementById("event-title").value = "";
            document.getElementById("event-date").value = "";
            document.getElementById("event-description").value = "";

            // Toast success message.
            ui.toast("Calendar event added successfully.", "success");

            // Log the success to the console.
            ui.log("Calendar - add event", `${event.title} added on ${event.date} at ${event.time}.`);
        } else {
            // Show error toast and log the error.
            ui.toast("Please enter an event title and date.", "error");
            ui.log("Calendar - add event", "Error: Missing event title and/or date.");
        };
    },
    editEvent: function() {
        /**
         * Edit an event in the calendar.
         * 
         * TODO: Implement edit event functionality.
         */
        ui.log("Calendar - edit event", "Editing an event in the calendar...");
    },
    deleteEvent: function() {
        /**
         * Delete an event from the calendar.
         * 
         * TODO: Implement delete event functionality.
         */
        ui.log("Calendar - delete event", "Deleting an event from the calendar...");
    },
    next: function() {
        /**
         * Go to the next month.
         */
        // If at the end of the year, go back to the first month.
        if (this.thisMonth === 11) {
            this.thisMonth = 0;
            this.thisYear++;
        // Else, go to the next month.
        } else {
            this.thisMonth++;
        };
        // Re-render the calendar.
        calendar.renderCalendar(this.thisMonth, this.thisYear);
    },
    previous: function() {
        /**
         * Go to the previous month.
         */
        // If at the beginning of the year, go to the last month of last year.
        if (this.thisMonth === 0) {
            this.thisMonth = 11;
            this.thisYear--;
        // Else, go to the previous month.
        } else {
            this.thisMonth--;
        };
        // Re-render the calendar.
        calendar.renderCalendar(this.thisMonth, this.thisYear);
    }
};

/*--------------------------- TO-DO LIST FUNCTIONS ---------------------------*/
const tasks = {
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
        // Create a new task object
        let task = {
            id: 0,
            title: document.getElementById("todo-task").value,
            completed: false
        };

        // Check if the ID counter exists in localStorage, if not, initialize it to 1
        if (!localStorage.getItem("taskIdCounter")) {
            localStorage.setItem("taskIdCounter", "1"); // Initialize counter to 1
        };

        // Fallback check if task title is empty.
        if (task.title !== "") {
            // Get the current task ID from localStorage.
            let currentId = parseInt(localStorage.getItem("taskIdCounter"));

            // Update the task object with new data.
            task.id = currentId;

            // Increment the ID and save it back to localStorage.
            currentId++;
            localStorage.setItem("taskIdCounter", currentId.toString());

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

/*----------------------------- HELPER FUNCTIONS -----------------------------*/
const helper = {
    /**
     * Adds functions for the emotional support creature.
     * 
     * @function summon - Summon the creature.
     * 
     * TODO: Have helper give reminders.
     * TODO: Have helper give advice.
     * TODO: Have helper tell the user to take breaks.
     */
    summon: function() {
        let phoenix = document.getElementById("phoenix");
    }
};

/*---------------------------- POMODORO FUNCTIONS ----------------------------*/
const pomodoro = {
    /**
     * Controls the pomodoro timer.
     * 
     * @function updateButton - Toggles the text and icon for the pomodoro timer button.
     * @function start - Starts the pomodoro timer.
     * @function update - Updates the pomodoro timer display.
     * @function reset - Resets the pomodoro timer.
     * 
     * TODO: Let user select pomodoro length.
     * TODO: Reward user for participation.
     * TODO: Loop 4 times.
     * TODO: Count down from 25 minutes.
     * TODO: Take a 5 minute break.
     * TODO: After 4 pomodoros, take a 15-30 minute break.
     * TODO: Save pomodoro stats to user.
     * CONSIDER: Reward user for completing a loop.
     * CONSIDER: If the user completes 4 pomodoros in a row, and returns from their break, give bigger reward.
     */
    timer: null,
    minutes: 15,
    seconds: 0,
    isActive: false,
    isPaused: false,
    updateButton: function(state = "play") {
        /**
         * Toggles the text and icon for the pomodoro timer button.
         * 
         * @param {string} state - The state of the pomodoro timer.
         * @param {string} state - "play" | "pause" | "resume"
         */
        let button = document.getElementById("pomodoro-start");
        let buttonIcon = document.getElementById("pomodoro-activity-icon");

        // Toggle the button text and icon.
        button.title = `${state === "play" ? "Start" : `${state}`} timer`;
        button.ariaLabel = `${state === "play" ? "Start" : `${state}`} timer`;
        buttonIcon.className = "bi";
        buttonIcon.classList.add(`bi-${state === "resume" ? "play" : state}-fill`);
    },
    start: function() {
        /**
         * Starts the pomodoro timer.
         * 
         * BUG: Timer starts slowly.
         */
        if (!pomodoro.isActive) {
            // If not active, start.
            this.timer = setInterval(() => this.update(), 1000);
            pomodoro.isActive = true;
            this.updateButton("pause");
            ui.toast("Pomodoro timer has been started.", "info");
        } else {
            // Else, act as pause.
            if (!pomodoro.isPaused) {
                pomodoro.isPaused = true;
                this.updateButton("resume");
                ui.toast("Pomodoro timer has been paused.", "info");
            } else {
                pomodoro.isPaused = false;
                this.updateButton("pause");
                ui.toast("Pomodoro timer has been resumed.", "info");
            };
        };
    },
    update: function() {
        /**
         * Updates the pomodoro timer display.
         * 
         * BUG: Pause is slow to react.
         * CONSIDER: Should the padStarts be its own function?
         */
        const timerElement = document.getElementById("pomodoro-countdown");

        // Format the time for display.
        function formatTime(minutes, seconds) {
            return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        };

        // Update the timer display.
        timerElement.textContent = formatTime(this.minutes, this.seconds);

        if (this.minutes === 0 && this.seconds === 0) {
            clearInterval(this.timer);
            ui.toast("Time's up!", "success");
        } else if (!this.isPaused) {
            if (this.seconds > 0) {
                this.seconds--;
            } else {
                this.seconds = 59;
                this.minutes--;
            };
        };
    },
    reset: function() {
        /**
         * Resets the pomodoro timer.
         */
        if (!pomodoro.isActive) {
            ui.toast("No pomodoro timer is currently active.", "error");
        } else {
            clearInterval(this.timer);
            pomodoro.isActive = false;
            pomodoro.isPaused = false;
            this.minutes = 15;
            this.seconds = 0;
            this.update();
            this.updateButton();
            ui.toast("Pomodoro timer has been reset.", "info");
        };
    }
};

/*---------------------------------- ONLOAD ----------------------------------*/
window.onload = function() {
    /**
     * Onload function that runs when the page is loaded.
     */
    // Load user data from local storage.
    user.load();

    // Render the calendar and tasks.
    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
    tasks.renderTasks();

    // Testing area
    ui.toast("Welcome back!");
};
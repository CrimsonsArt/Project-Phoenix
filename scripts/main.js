/*-------------------------- USER DATA & FUNCTIONS ---------------------------*/
const user = {
    /**
     * User data.
     * 
     * @param {string} name - The user's name.
     * @param {array} events - The user's events.
     * @param {array} tasks - The user's to-do list.
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

    // Save user object to local storage.
    save: function() {
        const userData = JSON.stringify(this);
        localStorage.setItem("user", userData);
        console.log("User data saved to local storage.");
    },

    // Load user object from local storage.
    load: function() {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            // Update user object with saved data.
            Object.assign(this, parsedUser);
            console.log("User data loaded from local storage.");
        } else {
            console.log("No user data found in local storage.");
        };
    },
    export: function() {
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
        toast.show("User data exported successfully.", "success");
    },
    import: function() {
        const file = document.getElementById("import-data").files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // Update user object with imported data.
                    Object.assign(user, importedData);
                    console.log("User data imported from file.");

                    // Save the imported data to local storage.
                    user.save();

                    // Show a success toast.
                    toast.show("User data imported and saved successfully.", "success");

                    // Re-render the calendar and tasks.
                    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
                    tasks.renderTasks();
                } catch (error) {
                    // Show error toast.
                    toast.show("Failed to import user data. Please ensure it is a valid JSON file and try again.", "error");
                };
            };
            // Read the file as text.
            reader.readAsText(file);
        };
    },

    // See all of the user's events in the console.
    showEvents: function() {
        console.log("User's events:")
        this.events.forEach((event, index) => {
            console.log(`[${index + 1}]: ${event.title}, Date: ${event.date}, Time: ${event.time}, Description: ${event.description}`);
        });
    },

    // See all of the user's tasks in the console.
    showTasks: function() {
        console.log("User's tasks:")
        this.tasks.forEach((task) => {
            console.log(`[${task.id}]: ${task.title} - ${task.completed ? "Complete" : "Incomplete"}`);
        });
    }
};

/*----------------------------- TOAST FUNCTIONS ------------------------------*/
const toast = {
    /**
     * Show toast messages.
     * 
     * TODO: Ensure that toast messages don't overlap.
     * CONSIDER: Toast-log for the user.
     */
    show: function(message, type = 'info'){
        // Create toast container.
        let toastContainer = document.getElementsByTagName("header")[0];
        let toast = document.createElement("div");

        // Add info to toast.
        toast.classList.add('toast', type, 'show');
        toast.innerHTML = `<h2>${type.charAt(0).toUpperCase() + type.slice(1)}:</h2>
        <p>${message}</p>
        <button id="toast-close" aria-label="Close toast">
            <span class="bi bi-x-square" aria-hidden="true"></span>
        </button>`;

        // Add toast to container and log to console.
        toastContainer.appendChild(toast);
        console.log(`[Toast - ${type}] ${message}`);

        // Initial removal timer (e.g., 5 seconds = 5000 milliseconds).
        const totalTimeout = 5000;
        let startTime = Date.now();
        let remainingTime = totalTimeout;
        let toastClose = document.getElementById("toast-close");

        // Function to remove the toast.
        const removeToast = (fadeout = 500) => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), fadeout);
            console.log("[Toast - remove] Removing toast!");
        };

        // Start the removal timer.
        let removalTimer = setTimeout(removeToast, remainingTime);
        console.log(`[Toast - start timer] Starting removal timer for ${totalTimeout}ms.`);

        // Pause and resume the removal timer.
        const toggleTimer = (pause) => {
            if (pause) {
                clearTimeout(removalTimer);
                remainingTime -= (Date.now() - startTime);
                console.log(`[Toast - pause timer] Pausing removal timer.`);
            } else if (!document.activeElement.closest(".toast")) {
                startTime = Date.now();
                removalTimer = setTimeout(removeToast, remainingTime);
                console.log("[Toast - resume timer] Resuming removal timer.");
            };
        };

        // Event listeners for pause and resume.
        toast.addEventListener("mouseenter", () => toggleTimer(true));
        toast.addEventListener("mouseleave", () => toggleTimer(false));
        toastClose.addEventListener("focus", () => toggleTimer(true));
        toastClose.addEventListener("focusout", () => toggleTimer(false));
        /*
        ["mouseenter", "focus"].forEach(event => toast.addEventListener(event, () => toggleTimer(true)));
        ["mouseleave", "focusout"].forEach(event => toast.addEventListener(event, () => toggleTimer(false)));
        */

        // Close the toast on click.
        toastClose.addEventListener('click', () => {
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
     * 
     * @function addEvent - Add a new event to the calendar.
     * @function isEventDay - Check if the date is in the user's events.
     * @function renderCalendar - Render the calendar.
     * @function next - Move to the next month.
     * @function previous - Move to the previous month.
     * 
     * @returns {object} calendar - The calendar object.
     */
    today: new Date(),
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    thisMonth: new Date().getMonth(),
    thisYear: new Date().getFullYear(),

    timestamp: function() {
        const date = new Date();

        // Format the date as YYYY-MM-DD or any other preferred format
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },

    addEvent: function() {
        // TODO: Allow users to submit the event using the enter key.
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

            // TODO: Remove data from input fields.

            // Re-render the calendar.
            calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);

            // Clear the input fields.
            document.getElementById("event-title").value = "";
            document.getElementById("event-date").value = "";
            document.getElementById("event-description").value = "";

            // Toast success message.
            toast.show("Calendar event added successfully.", "success");
        } else {
            // Show error toast.
            toast.show("Please enter an event title and date.", "error");
        };
    },
    isEventDay: function(dateString) {
        // Check if the date is in the user's events.
        return user.events.some(event => event.date === dateString);
        // TODO: Toast for event day!
    },
    renderCalendar: function(month, year) {
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
                        day.classList.add('today');
                    };

                    // Create a full date string.
                    let fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

                    // Check if this day has an event.
                    if (this.isEventDay(fullDate)) {
                        // Add a class to the day if it has an event.
                        day.classList.add('event-day');

                        // Find the event in the user.events object.
                        let event = user.events.find(event => event.date === fullDate);

                        dayEvent = `<div class="cal-event">
                            <span class="event-title">${event.title}</span>
                            <time class="event-time" datetime="${event.time}">${event.time}</time>
                            <span class="event-description">${event.description}</span>
                        </div>`;
                    };

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
    },
    openDay: function() {
        // TODO: Add event listener for each day.
        // TODO: When clicked, focus on the day.
        // TODO: Display edit and remove buttons.
    },
    openEvent: function() {
        // TODO: Add event listener for each event.
        // TODO: When clicked, focus on the event and display edit and remove buttons.
    },
    next: function() {
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
     * @function addTask - Add a new task to the to-do list.
     * @function renderTasks - Render the to-do list.
     * 
     * @returns {object} - The functions for the to-do list.
     * 
     * TODO: Add way to sort tasks.
     * TODO: Add a way to add an estimate of the amount of pomodoros required to complete a task.
     */
    addTask: function() {
        // TODO: Allow users to submit the task using the enter key.
        // Create a new task object
        let task = {
            id: 0,
            title: document.getElementById("todo-task").value,
            completed: false
        };

        // Check if the ID counter exists in localStorage, if not, initialize it to 1
        if (!localStorage.getItem('taskIdCounter')) {
            localStorage.setItem('taskIdCounter', '1'); // Initialize counter to 1
        };

        // Fallback check if task title is empty.
        if (task.title !== "") {
            // Get the current task ID from localStorage.
            let currentId = parseInt(localStorage.getItem('taskIdCounter'));

            // Update the task object with new data.
            task.id = currentId;

            // Increment the ID and save it back to localStorage.
            currentId++;
            localStorage.setItem('taskIdCounter', currentId.toString());

            // Save to user object, and re-render tasks.
            user.tasks.push(task);
            user.save();
            tasks.renderTasks();

            // Clear input field.
            document.getElementById("todo-task").value = "";

            // Toast success message.
            toast.show("Task added successfully.", "success");
        } else {
            // Toast error message.
            toast.show("Please enter a task title.", "error");
        };
    },
    renderTasks: function(target = 0) {
        let taskList = document.getElementById("todo-list");

        let generateTask = (task) => {
            return `<p class="todo-task">${task.title}</p>
            <label for="task-${task.id}-check" class="sr-only">${task.completed ? "Mark task as incomplete" : "Mark task as completed"}:</label>
            <input class="todo-check" type="checkbox" name="task-${task.id}-check" onclick="tasks.completeTask(${task.id})" ${task.completed ? "checked" : ""}>
            <div class="todo-actions">
                <button class="todo-edit" type="button" onclick="tasks.editTasks(${task.id})" title="Edit task" aria-label="Edit task">${generateIcon("pencil-square")}</button>
                <button class="todo-delete" type="button" onclick="tasks.deleteTask(${task.id})" title="Delete task" aria-label="Delete task">${generateIcon("trash")}</button>
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
    deleteTask: function(id) {
        // Remove the array item in the user.tasks object..
        user.tasks.splice(id, 1);

        // Save the updated user object, and reload tasks.
        user.save();
        tasks.renderTasks();

        // Toast success message.
        toast.show("Task deleted successfully.", "success");
    },
    completeTask: function(id) {
        // Find the task in the user.tasks object.
        let task = user.tasks.find(task => task.id === id);

        // Check if the task exists.
        if (task) {
            // Toggle the completed status.
            task.completed = !task.completed;
        };

        // Save the updated user object and reload tasks.
        user.save();
        tasks.renderTasks();

        // Toast success message.
        // CONSIDER: Have the creature praise the user for completing a task.
    },
    editTasks: function(id) {
        // BUG: When editing a task, and deleting another task the wrong task is deleted.
        // BUG: When multiple tasks are edited, and one is submitted all are closed.
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
                // TODO: Allow users to update the task using the enter key.
                let updatedTitle = document.getElementById(`editing-task-${id}`).value;

                if (updatedTitle === "") {
                    // Toast error message.
                    toast.show("Task title cannot be empty.", "error");
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
                    toast.show("Task updated successfully.", "success");
                }
            });

            // Add event listener for the cancel button.
            document.getElementById(`update-task-cancel-${id}`).addEventListener("click", function() {
                // TODO: Allow users to cancel the task edit using the esc key.
                // Cancel the edit and reload that list item.
                tasks.renderTasks(id);
            });
        };
    },
    submitEdit: function(id) {
        // TODO: Allow users to submit the edit using the enter key.
        // TODO: Move this function from the editTasks function.
    },
    cancelEdit: function(id) {
        // TODO: Allow users to cancel the edit using the esc key.
        // TODO: Move this function from the editTasks function.
    },
    reorderTasks: function() {
        // TODO: Reorder tasks in user object and reload tasks.
    }
};

const helper = {
    /**
     * Adds functions for the emotional support creature.
     */
    // TODO: Figure out where to start.
    // TODO: Have helper give reminders.
    // TODO: Have helper give advice.
    // TODO: Have helper tell the user to take breaks.
    summon: function() {
        let phoenix = document.getElementById("phoenix");
    }
};

/* FUNCTIONS */
// Pomodoro

const pomodoro = {
    /**
     * TODO: Let user select pomodoro length.
     * TODO: Reward user for participation.
     * TODO: Loop 4 times.
     * TODO: Count down from 25 minutes.
     * TODO: Take a 5 minute break.
     * TODO: After 4 pomodoros, take a 15-30 minute break.
     * TODO: Don't react if pomodoro is not active.
     * CONSIDER: Reward user for completing a loop.
     * CONSIDER: If the user completes 4 pomodoros in a row, and returns from their break, give bigger reward.
     */
    timer: null,
    minutes: 15,
    seconds: 0,
    isActive: false,
    isPaused: false,
    updateButton: function(state = "play") {
        let button = document.getElementById("pomodoro-start");
        let buttonIcon = document.getElementById("pomodoro-activity-icon");

        // Toggle the button text and icon.
        button.title = `${state === "play" ? "Start" : `${state}`} timer`;
        button.ariaLabel = `${state === "play" ? "Start" : `${state}`} timer`;
        buttonIcon.className = "bi";
        buttonIcon.classList.add(`bi-${state === "resume" ? "play" : state}-fill`);
    },
    start: function() {
        if (!pomodoro.isActive) {
            // If not active, start.
            // BUG: Timer starts slowly.
            this.timer = setInterval(() => this.update(), 1000);
            pomodoro.isActive = true;
            this.updateButton("pause");
            toast.show("Pomodoro timer has been started.", "info");
        } else {
            // Else, act as pause.
            if (!pomodoro.isPaused) {
                pomodoro.isPaused = true;
                this.updateButton("resume");
                toast.show("Pomodoro timer has been paused.", "info");
            } else {
                pomodoro.isPaused = false;
                this.updateButton("pause");
                toast.show("Pomodoro timer has been resumed.", "info");
            };
        };
    },
    update: function() {
        const timerElement = document.getElementById("pomodoro-countdown");

        // Format the time for display.
        // TODO: Combine the function into the call.
        function formatTime(minutes, seconds) {
            return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        };

        // Update the timer display.
        timerElement.textContent = formatTime(this.minutes, this.seconds);

        if (this.minutes === 0 && this.seconds === 0) {
            clearInterval(this.timer);
            toast.show("Time's up!", "success");
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
        if (!pomodoro.isActive) {
            toast.show("No pomodoro timer is currently active.", "error");
        } else {
            // BUG: Timer display does not reset.
            clearInterval(this.timer);
            pomodoro.isActive = false;
            pomodoro.isPaused = false;
            this.updateButton();
            toast.show("Pomodoro timer has been reset.", "info");
        };
    }
};

// Generate an icon HTML string.
function generateIcon(iconName) {
    return `<span class="bi bi-${iconName}" aria-hidden="true"></span>`;
};

// Load user data from local storage.
window.onload = function() {
    user.load();
    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
    tasks.renderTasks();

    // Testing area
    toast.show("Welcome back!");
};
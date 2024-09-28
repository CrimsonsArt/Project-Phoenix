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
        tempLink.download = "user-data.json";

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
            console.log(`[${index + 1}]: ${event.title}, Date: ${event.date}`);
            // TODO: Count events and return number of events.
        });
    },

    // See all of the user's tasks in the console.
    showTasks: function() {
        console.log("User's tasks:")
        this.tasks.forEach((task, index) => {
            console.log(`[${index + 1}]: ${task}`);	
            // TODO: Count tasks and return number of tasks.
        });
    }
};

/*----------------------------- TOAST FUNCTIONS ------------------------------*/
const toast = {
    /**
     * Show toast messages.
     * 
     * TODO: Add animation for timeout.
     * TODO: Add close button.
     * TODO: Add a progress bar for timeout.
     * TODO: Add a toast-log for the user.
     */
    show: function(message, type = 'info'){
        // Create toast container.
        let toastContainer = document.getElementsByTagName("header")[0];
        let toast = document.createElement("div");

        // Add info to toast.
        toast.classList.add('toast', type, 'show');
        toast.innerHTML = `<h2>${type.charAt(0).toUpperCase() + type.slice(1)}:</h2><p>${message}</p>`;

        // Add toast to container.
        toastContainer.appendChild(toast);

        // TODO: Pause the removal timer on hover.

        // Remove toast after 5 seconds.
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 60000);

        // Log the toast message to the console.
        console.log(`[Toast - ${type}] ${message}`);
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

    addEvent: function() {
        let eventTitle = document.getElementById("event-title").value;
        let eventDate = document.getElementById("event-date").value;
        let eventDescription = document.getElementById("event-description").value;

        // Add event to the calendar.
        if (eventTitle && eventDate) {
            // Create an event object.
            const event = {
                title: eventTitle,
                date: eventDate,
                description: ""
            };

            // Add event description if provided.
            if (eventDescription) {
                event.description = eventDescription;
            };

            // Add the event to the user object.
            user.events.push(event);
            user.save();

            // TODO: Remove data from input fields.

            // Re-render the calendar.
            calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);

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

                // Add empty cells for previous month's days.
                if (i === 0 && j < firstDay) {
                    // TODO: Add previous month's days, and have them look faded out.
                    day.appendChild(dayNum);
                    week.appendChild(day);

                // Break the loop when all days are added.
                } else if (date > (32 - new Date(year, month, 32).getDate())) {
                    break;

                // Add days to the table.
                } else {
                    // Highlight today's date.
                    if (date === this.today.getDate() && month === this.today.getMonth() && year === this.today.getFullYear()) {
                        // TODO: Ensure that the date is visible.
                        day.classList.add('today');
                    };

                    // Create a full date string.
                    let fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

                    // Check if this day has an event.
                    if (this.isEventDay(fullDate)) {
                        // Add a class to the day if it has an event.
                        day.classList.add('event-day');
                        // TODO: Ensure that the event is visible.
                        // TODO: Show event title and description in cell.
                    };

                    // Add the date to the day, and add the day to the week.
                    // TODO: Turn date into a date object.
                    // TODO: Turn date into a title.
                    // TODO: Show event title below date.
                    dayNum = document.createTextNode(`${date}`);
                    day.appendChild(dayNum);
                    week.appendChild(day);
                    date++;
                };
            };

            // Add week to the table.
            table.appendChild(week);
        };
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
     */
    addTask: function() {
        // TODO: Turn task into an object that holds date and title.
        // TODO: Add hierarchy options.
        let task = document.getElementById("todo-task").value;

        // Save to user object.
        user.tasks.push(task);
        user.save();

        // TODO: Clear input field.

        // Re-render tasks.
        tasks.renderTasks();

        // Toast success message.
        toast.show("Task added successfully.", "success");
    },
    renderTasks: function() {
        let taskList = document.getElementById("todo-list");

        // Clear list.
        taskList.innerHTML = "";

        // Add tasks to list.
        user.tasks.forEach((task, index) => {
            let taskItem = document.createElement("li");

            // FIXME: Delete not working.
            /*
            taskItem.innerHTML = `${task} <button class="task-delete" data-index="${index}">Delete</button>`;
            */

            taskItem.innerHTML = task;

            //taskItem.textContent = task;
            taskList.appendChild(taskItem);
        });

        // FIXME: Delete not working.
        /*
        // Add event listeners to delete buttons.
        const deleteButtons = taskList.querySelectorAll(".task-delete");
        deleteButtons.forEach((button) => {
            deleteButtons.forEach (button => {
                button.addEventListener('click', this.deleteTask.bind(this));
            });
        });
        */
    },
    deleteTask: function(event) {
        // FIXME: Delete not working.
        /*
        // 
        const taskIndex = event.target.getAttribute('data-index');

        // Remove task from the array.
        user.tasks.splice(taskIndex, 1);

        // Save to user object.
        user.save();

        // Re-render tasks.
        tasks.renderTasks();
        */
    },
    reorderTasks: function() {
        // TODO: Reorder tasks in user object and reload tasks.
    },
    completeTask: function(index) {
        // TODO: Complete task in user object and reload tasks.
    },
    uncompleteTask: function(index) {
        // TODO: Uncomplete task in user object and reload tasks.
    }
};

// Load user data from local storage.
window.onload = function() {
    user.load();
    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
    tasks.renderTasks();

    // Testing area
    toast.show("Welcome back!");
};
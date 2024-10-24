import { user } from "./user.js";

/*---------------------------- CALENDAR FUNCTIONS ----------------------------*/
export const calendar = {
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
     * 
     * TODO: Add secondary display, as a journal-style calendar.
     */
    today: new Date(),
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    thisMonth: new Date().getMonth(),
    thisYear: new Date().getFullYear(),
    activeDay: null,
    activeEvent: null,

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

                    // Initialize an empty string to hold event data.
                    let dayEvents = "";

                    // Check if this day has an event.
                    if (this.isEventDay(fullDate)) {
                        // Add a class to the day if it has an event.
                        day.classList.add("event-day");

                        // Find all events dor this day using filter().
                        let eventsForDay = user.events.filter(event => event.date === fullDate);

                        // Loop through the events and add each to the day.
                        eventsForDay.forEach(event => {
                            dayEvents += `<div class="cal-event" data-event-id="${event.id}">
                                <span class="event-title">${event.title}</span>
                                <time class="event-time" datetime="${event.time}">${event.time}</time>
                                <span class="event-description">${event.description}</span>
                            </div>`;
                        });
                    };

                    // Add the date as an attribute to the day cell.
                    day.setAttribute("data-date", `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`);
                    day.classList.add("cal-day");

                    // Add the date to the day, and add the day to the week.
                    // TODO: Turn date into a title and improve date formatting. (.th, .st, etc.)
                    day.innerHTML = `<time class="cal-date" datetime="${fullDate}">
                        ${date}
                        <span class="sr-only">${this.months[month]}</span>
                    </time>
                    ${dayEvents}`;
                    week.appendChild(day);
                    date++;
                };
            };

            // Add week to the table.
            table.appendChild(week);
        };

        // Add event listeners for days and events.
        document.getElementById("cal-body").addEventListener("click", (event) => {
            // Use closest() to find the nearest clicked element.
            const clickedEvent = event.target.closest(".cal-event");
            const clickedDay = event.target.closest(".cal-day");

            // If the user clicked on an event, open the event.
            if (clickedEvent && this.activeEvent !== clickedEvent) {
                // If an event is already open, close it.
                if (this.activeEvent) {
                    this.activeEvent.classList.remove("active-event");
                    if (this.activeEvent.querySelector(".control-panel")) {
                        this.activeEvent.removeChild(this.activeEvent.querySelector(".control-panel"));
                    };
                };

                // If a day is already open, close it.
                if (this.activeDay) {
                    if (this.activeDay.querySelector(".control-panel")) {
                        this.activeDay.removeChild(this.activeDay.querySelector(".control-panel"));
                    };
                    this.activeDay.classList.remove("active-day");
                };

                // Mark the event as active.
                const eventId = clickedEvent.getAttribute("data-event-id");
                this.activeEvent = clickedEvent;
                clickedEvent.classList.add("active-event");

                // Mark the day as active too.
                const eventDay = clickedEvent.closest(".cal-day");
                this.activeDay = eventDay;
                eventDay.classList.add("active-day");

                // Render the control panel for the selected event.
                let controlPanel = ui.controls(
                    ["edit", "delete"],
                    "event",
                    {
                        // TODO: FIX!
                        edit: function (id) {
                            // Find the event with the given id.
                            let eventId = user.events.findIndex(event => event.id === id);
                        },
                        delete: this.deleteEvent(eventId)
                    }
                );
                this.activeEvent.appendChild(controlPanel);

            // If the user didn't click on an event, focus on the active day.
            } else if (clickedDay && this.activeDay !== clickedDay) {
                // If an event is already open, close it.
                if (this.activeEvent) {
                    if (this.activeEvent.querySelector(".control-panel")) {
                        this.activeEvent.removeChild(this.activeEvent.querySelector(".control-panel"));
                    }
                    this.activeEvent.classList.remove("active-event");
                    this.activeEvent = null;
                };

                // If a day is already open, close it.
                if (this.activeDay) {
                    if (this.activeDay.querySelector(".control-panel")) {
                        this.activeDay.removeChild(this.activeDay.querySelector(".control-panel"));
                    };
                    this.activeDay.classList.remove("active-day");
                };

                // If the user didn't click on an event, focus on the active day.
                const selectedDate = clickedDay.getAttribute("data-date");
                this.activeDay = clickedDay;
                clickedDay.classList.add("active-day");

                // Render the control panel for the selected day.
                let controlPanel = ui.controls(
                    ["add"],
                    "event",
                    {
                        add: function () {
                            let eventDate = clickedDay.getAttribute("data-date");
                            let dateInput = document.getElementById("event-date");
                            dateInput.value = eventDate;
                        }
                    }
                );
                clickedDay.appendChild(controlPanel);
            };
        });
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
            // Get the id of the next event.
            let eventId = user.nextEventId;

            // Create an event object.
            const event = {
                title: eventTitle,
                date: eventDate,
                time: eventTime,
                description: eventDescription,
                id: eventId
            };

            user.nextEventId++;

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
    editEvent: function(id) {
        /**
         * Edit an event in the calendar.
         * 
         * TODO: Implement edit event functionality.
         */
        //ui.log(`Calendar - edit event", "Editing event ${id} in the calendar...`);
        // TODO: Grab the date from active day.
    },
    deleteEvent: function(id) {
        /**
         * Delete an event from the calendar.
         * 
         * TODO: Implement delete event functionality.
         */
        // Find the event with the given id.
        let eventId = user.events.findIndex(event => event.id);

        // If the event exists, remove it from the array.
        if (eventId !== -1 && eventId !== 0) {
            user.events.splice(eventId, 1);
            this.renderCalendar();
            user.save();
            ui.log(`Calendar - event`, `Event ${eventId} has been deleted from the calendar.`);
        } else {
            ui.log(`Calendar - event`, `Event ${eventId} does not exist in the calendar.`);
        };
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
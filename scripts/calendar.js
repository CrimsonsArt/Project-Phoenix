import { utils } from "./utils.js";
import { user } from "./user.js";

/*---------------------------- CALENDAR FUNCTIONS ----------------------------*/
export const calendar = {
    /**
     * Calendar data and functions.
     * 
     * @variable currentMonth - The current month to display.
     * @variable currentYear - The current year to display.
     * 
     * @object render - Functions for rendering the calendar.
     * @object controls - Functions for controlling the calendar.
     * @object event - Functions for calendar events.
     * 
     * @returns {object} calendar - The calendar object.
     * 
     * CONSIDER: Add secondary display, as a journal-style calendar.
     */
    currentMonth: new Date().getMonth(), // 0-11 (Jan-Dec).
    currentYear: new Date().getFullYear(),
    render: {
        /**
         * Render the calendar elements.
         * 
         * @function calendar - Render the full calendar.
         * @function days - Render the days of the month.
         * @function title - Render the calendar title. 
         */
        fullCalendar(year, month) {
            /**
             * Renders the full calendar.
             */
            // Get the first day of the month.
            const firstDayOfMonth = (((new Date(year, month)).getDay() - 1) + 7) % 7;
            const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month.
            const calendarBody = document.getElementById("cal-body"); // Grab the calendar body.
            const date = {
                year: year,
                month: month
            };
            calendarBody.innerHTML = ""; // Clear the table.
            
            // Update the table title to display the correct month and year.
            calendar.render.title(year, month);

            // Render the days.
            calendar.render.days(daysInMonth, firstDayOfMonth, date);

            // Make the previous and next month buttons.
            const backButton = utils.button("previous", "month", null, "Go to the");
            const forwardButton = utils.button("next", "month", null, "Go to the");

            // Add the buttons to the calendar, if not there already.
            if (!document.getElementById("cal-controller")) {
                const controlWrapper = document.createElement("div");
                controlWrapper.id = "cal-controller";
                controlWrapper.appendChild(backButton).addEventListener("click", calendar.controls.previous);
                controlWrapper.appendChild(forwardButton).addEventListener("click", calendar.controls.next);
                document.getElementById("calendar").insertBefore(controlWrapper, document.getElementById("cal-table"));
            };
        },
        days(daysInMonth, startDay, date) {
            /**
             * Renders the days of the month.
             * 
             * @param {number} daysInMonth - The total number of days in the month.
             * @param {number} startDay - The first day of the month.
             * @param {object} date - The date to display.
             * 
             * TODO: Add today class if today is in the month.
             */
            const calendarBody = document.getElementById("cal-body");
            let day = 1;
            for (let weeks = 0; weeks < 6; weeks++) { // Up to 6 weeks.
                const weekRow = document.createElement("tr");

                for (let days = 0; days < 7; days++) { // 7 days per week.
                    const dayCell = document.createElement("td");

                    // Fill cells before the first day with blanks.
                    if (weeks === 0 && days < startDay) {
                        dayCell.innerHTML = ""; // Blank cell.
                        weekRow.appendChild(dayCell);
                    } else if (day > daysInMonth) {
                        // TODO: Display empty days at the end of the month.
                        break; // End of month reached.
                    } else {
                        // Add the day number, and other data to the cell.
                        dayCell.classList.add("calendar-day");
                        dayCell.textContent = day;

                        // Store the date in the cell, for later use.
                        const dateData = `${date.year}-${date.month + 1}-${day}`;
                        dayCell.dataset.date = dateData;

                        // Check if there is an event on this day.
                        if (calendar.event.search(dateData)) {
                            dayCell.classList.add("event-day");
                            // TODO: Add event related data to the cell.
                        };

                        // Add the cell to the week row and increment the day.
                        // TODO: Add event listener to the cell.
                        weekRow.appendChild(dayCell);
                        day++;
                    };
                };
                // Add the week row to the calendar body.
                calendarBody.appendChild(weekRow);
            };
        },
        title(year, month) {
            /**
             * Renders the calendar title.
             * 
             * @param {number} year - The current year.
             * @param {number} month - The current month.
             * 
             * TODO: Add dropdown menu to change the month and year.
             * TODO: Allow users to change the month and year using the spans.
             */
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            document.getElementById("cal-title-month").textContent = months[month];
            document.getElementById("cal-title-year").textContent = year;
        }
    },
    controls: {
        /**
         * Controls for the calendar.
         * 
         * @function next - Jump to the next month.
         * @function previous - Jump to the previous month.
         */
        next() {
            /**
             * Jump to the next month.
             */
            calendar.currentMonth++;
            if (calendar.currentMonth > 11) { // Move to next year.
                calendar.currentMonth = 0;
                calendar.currentYear++;
            };
            calendar.render.fullCalendar(calendar.currentYear, calendar.currentMonth);
        },
        previous() {
            /**
             * Jump to the previous month.
             */
            calendar.currentMonth--;
            if (calendar.currentMonth < 0) { // Move to previous year.
                calendar.currentMonth = 11;
                calendar.currentYear--;
            };
            calendar.render.fullCalendar(calendar.currentYear, calendar.currentMonth);
        }
    },
    event: {
        /**
         * Functions for events.
         * 
         * @function add - Add a new event to the events array in the user object.
         * @function delete - Delete an event.
         * @function edit - Edit an event.
         */
        prototype: {
            /**
             * The prototype for the event object.
             */
            id: "",
            title: "",
            date: "", // YYYY-MM-DD
            time: "",
            description: ""
        },
        add() {
            /**
             * Add a new event to the events array in the user object.
             * 
             * TODO: Allow users to submit the event using the enter key.
             * TODO: Remove data from input fields after submission.
             */
            const event = calendar.event.prototype;

            // Add the event to the user object.
            user.events.push(event);
            user.nextEventId++;
            user.save();

            // TODO: Render the new event.
        },
        search(date) {
            /**
             * Checks if the given day has an event.
             * 
             * @param {string} date - The date to check.
             * @param {string} date - YYYY-MM-DD format.
             * 
             * @returns {object} - The event object if it exists, otherwise null.
             */
            return user.events.find(event => event.date === date);
        },
        delete(id) {
            /**
             * Delete an event.
             * 
             * @param {number} id - The ID of the event to delete.
             */
        },
        edit(id) {
            /**
             * Edit an event.
             * 
             * @param {number} id - The ID of the event to edit.
             */
        }
    }
};
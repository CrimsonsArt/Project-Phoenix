/*---------------------------------- IMPORT ----------------------------------*/
import { utils } from "./utils.js";
import { events } from "./events.js";
import { user } from "./user.js";

/*---------------------------- CALENDAR FUNCTIONS ----------------------------*/
export const calendar = {
    /**
     * Calendar data and functions.
     * 
     * @variable displayMonth - The current month to display.
     * @variable displayYear - The current year to display.
     * 
     * @object render - Functions for rendering the calendar.
     * @object controls - Functions for controlling the calendar.
     * @object event - Functions for calendar events.
     * 
     * @returns {object} calendar - The calendar object.
     * 
     * CONSIDER: Add secondary display, as a journal-style calendar.
     * CONSIDER: Move event-related functions to their own file.
     */
    today: new Date(),
    displayMonth: new Date().getMonth(), // 0-11 (Jan-Dec).
    displayYear: new Date().getFullYear(),
    render: {
        /**
         * Render the calendar elements.
         * 
         * @function calendar - Render the full calendar.
         * @function days - Render the days of the month.
         * @function title - Render the calendar title. 
         * 
         * @returns render - The calendar render object.
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

            // Render the event picker.
            // TODO: Add a button that opens the event picker form.
            events.render.form();

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
             * TODO: Add week numbers.
             */
            const calendarBody = document.getElementById("cal-body");
            let day = 1;
            for (let weeks = 0; weeks < 6; weeks++) { // Up to 6 weeks.
                const weekRow = document.createElement("tr");

                for (let days = 0; days < 7; days++) { // 7 days per week.
                    const dayCell = document.createElement("td");

                    // Add days for the previous month to fill the first week.
                    if (weeks === 0 && days < startDay) {
                        const prevMonth = date.month === 0 ? 11 : date.month - 1;
                        const prevYear = date.month === 0 ? date.year - 1 : date.year;
                        const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
                        const prevMonthDay = daysInPrevMonth - (startDay - days - 1);
                        const prevMonthDate = `${prevYear}-${prevMonth + 1}-${prevMonthDay}`;

                        // TODO: Check for events in the previous month.

                        // Add data to the cell.
                        dayCell.dataset.date = prevMonthDate;
                        dayCell.classList.add("faded-day");
                        dayCell.textContent = prevMonthDay;
                        weekRow.appendChild(dayCell);

                    // Add days for the next month to fill the last week.
                    } else if (day > daysInMonth) {
                        const nextMonth = date.month === 11 ? 0 : date.month + 1;
                        const nextYear = date.month === 11 ? date.year + 1 : date.year;
                        const nextMonthDay = day - daysInMonth;
                        const nextMonthDate = `${nextYear}-${nextMonth + 1}-${nextMonthDay}`;

                        // TODO: Check for events in the next month.

                        // Add data to the cell.
                        dayCell.dataset.date = nextMonthDate;
                        dayCell.classList.add("faded-day");
                        dayCell.textContent = nextMonthDay;
                        weekRow.appendChild(dayCell);
                        day++;

                    // Add days for the current month.
                    } else {
                        // Add the day number, and other data to the cell.
                        dayCell.classList.add("calendar-day");
                        dayCell.textContent = day;

                        // Store the date in the cell, for later use.
                        const dateData = `${date.year}-${date.month + 1}-${day}`;
                        dayCell.dataset.date = dateData;

                        // Check if the current day is today.
                        if (date.year === calendar.today.getFullYear() && date.month === calendar.today.getMonth() && day === calendar.today.getDate()) {
                            dayCell.classList.add("today");
                        };

                        // Check if there is an event on this day.
                        const eventsForDate = events.search(dateData);
                        if (eventsForDate) {
                            // TODO: Add a [more] bit if there is more than a certain number of events.
                            // Add the event data to the cell.
                            dayCell.classList.add("event-day");
                            eventsForDate.forEach(event => {
                                // Add event related data to the cell.
                                dayCell.appendChild(events.render.compact(event));
                                // TODO: Add event listener to the compact event.
                            })
                            utils.log("Calendar", `There is at least one event on ${dateData}`);
                        };

                        // TODO: Add event listener to the cell.
                        // TODO: Button to add event from the cell.
                        // TODO: Button to open journal from the cell.

                        // Add the cell to the week row and increment the day.
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
             * TODO: Add a reasonable year-range.
             * TODO: Allow users to change the month and year using the spans.
             * TODO: Style the spans to make it obvious that the user can change the month and year.
             */
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthDisplay = document.getElementById("cal-title-month");
            const monthDropdown = document.getElementById("month-dropdown");
            const yearDisplay = document.getElementById("cal-title-year");
            const yearDropdown = document.getElementById("year-dropdown");

            // Set text content.
            monthDisplay.textContent = months[month];
            yearDisplay.textContent = year;

            // TODO: Complete this.
            /*
            // Toggle dropdown menu for the month.
            monthDisplay.addEventListener("click", () => {
                monthDropdown.classList.toggle("dropdown-closed");
                utils.log("Calendar", "Toggled month dropdown menu.");
            });

            // Toggle dropdown menu for the year.
            yearDisplay.addEventListener("click", () => {
                yearDropdown.classList.toggle("dropdown-closed");
                utils.log("Calendar", "Toggled year dropdown menu.");
            });*/
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
            calendar.displayMonth++;
            if (calendar.displayMonth > 11) { // Move to next year.
                calendar.displayMonth = 0;
                calendar.displayYear++;
            };
            calendar.render.fullCalendar(calendar.displayYear, calendar.displayMonth);
        },
        previous() {
            /**
             * Jump to the previous month.
             */
            calendar.displayMonth--;
            if (calendar.displayMonth < 0) { // Move to previous year.
                calendar.displayMonth = 11;
                calendar.displayYear--;
            };
            calendar.render.fullCalendar(calendar.displayYear, calendar.displayMonth);
        },
        open() {
            /**
             * Open a day or event.
             */
        }
    }
};
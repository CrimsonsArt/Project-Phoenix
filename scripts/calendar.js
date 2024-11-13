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
     * 
     * @returns {object} calendar - The calendar object.
     * 
     * CONSIDER: Add secondary display, as a journal-style calendar.
     * CONSIDER: Move event-related functions to their own file.
     */
    today: new Date(),
    displayMonth: new Date().getMonth(), // 0-11 (Jan-Dec).
    displayYear: new Date().getFullYear(),
    lastClickedCell: null,
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
             * 
             * CONSIDER: Display faded out events for last and next month.
             */
            const calendarTable = document.getElementById("cal-table");
            const calendarBody = document.getElementById("cal-body");
            const date = {
                year: year,
                month: month
            };

            // Get the first day of the month.
            const firstDayOfMonth = (((new Date(year, month)).getDay() - 1) + 7) % 7;

            // Total days in the month.
            const daysInMonth = new Date(year, month + 1, 0).getDate();

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
                controlWrapper.classList.add("controller");
                controlWrapper.appendChild(backButton).addEventListener("click", calendar.controls.previous);
                controlWrapper.appendChild(forwardButton).addEventListener("click", calendar.controls.next);
                document.getElementById("calendar").insertBefore(controlWrapper, calendarTable);
            };

            // Update the selected month and year in the select and input elements.
            calendar.render.setSelectedDate();

            // Add event listener to the table.
            calendarTable.addEventListener("click", (event) => {
                if (event.target.tagName === "TD") {
                    calendar.render.controls(event.target);
                }
            });
        },
        days(daysInMonth, startDay, date) {
            /**
             * Renders the days of the month.
             * 
             * @param {number} daysInMonth - The total number of days in the month.
             * @param {number} startDay - The first day of the month.
             * @param {object} date - The date to display.
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

                        // Add data to the cell.
                        dayCell.dataset.date = prevMonthDate;
                        dayCell.classList.add("day", "faded");
                        dayCell.textContent = prevMonthDay;
                        weekRow.appendChild(dayCell);

                    // Add days for the next month to fill the last week.
                    } else if (day > daysInMonth) {
                        const nextMonth = date.month === 11 ? 0 : date.month + 1;
                        const nextYear = date.month === 11 ? date.year + 1 : date.year;
                        const nextMonthDay = day - daysInMonth;
                        const nextMonthDate = `${nextYear}-${nextMonth + 1}-${nextMonthDay}`;

                        // Add data to the cell.
                        dayCell.dataset.date = nextMonthDate;
                        dayCell.classList.add("day","faded");
                        dayCell.textContent = nextMonthDay;
                        weekRow.appendChild(dayCell);
                        day++;

                    // Add days for the current month.
                    } else {
                        // Add the day number, and other data to the cell.
                        dayCell.classList.add("day");
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
                            // TODO: Add a [more] bit if there is too many to display.
                            // Add the event data to the cell.
                            dayCell.classList.add("event");
                            eventsForDate.forEach(event => {
                                // Add event related data to the cell.
                                dayCell.appendChild(events.render.compact(event));
                            });
                        };

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
             */
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthDisplay = document.getElementById("cal-title-month");
            const yearDisplay = document.getElementById("cal-title-year");

            // Create month selector.
            if (!document.getElementById("cal-nav-month")) {
                const monthNav = document.createElement("select");
                const monthNavLabel = document.createElement("label");

                monthNavLabel.htmlFor = "cal-nav-month";
                monthNavLabel.textContent = "Month:";
                monthNavLabel.classList.add("sr-only");

                monthNav.classList.add("cal-nav");
                monthNav.id = "cal-nav-month";
                months.forEach((month, index) => {
                    const option = document.createElement("option");
                    option.id = `cal-nav-month-${index}`;
                    option.value = index;
                    option.textContent = month;
                    monthNav.appendChild(option);
                });
                monthNav.addEventListener("change", (event) => {
                    calendar.displayMonth = parseInt(event.target.value);
                    calendar.render.fullCalendar(calendar.displayYear, calendar.displayMonth);
                })
                monthDisplay.appendChild(monthNav);
            };

            // Let user change year by writing.
            if (!document.getElementById("cal-nav-year")) {
                const yearNav = document.createElement("input");
                const yearNavLabel = document.createElement("label");

                yearNavLabel.htmlFor = "cal-nav-year";
                yearNavLabel.textContent = "Year:";
                yearNavLabel.classList.add("sr-only");

                yearNav.type = "number";
                yearNav.id = "cal-nav-year";
                yearNav.value = year;

                yearNav.addEventListener("change", (event) => {
                    calendar.displayYear = parseInt(event.target.value);
                    calendar.render.fullCalendar(calendar.displayYear, calendar.displayMonth);
                });
                yearDisplay.appendChild(yearNavLabel);
                yearDisplay.appendChild(yearNav);
            };
        },
        setSelectedDate() {
            /**
             * Sets the currently selected month in the select element.
             */
            // Set the month selector.
            const option = document.getElementById(`cal-nav-month-${calendar.displayMonth}`);
            if (option) {
                option.selected = "true";
            };

            // Set the year input.
            const yearNav = document.getElementById("cal-nav-year");
            if (yearNav) {
                yearNav.value = calendar.displayYear;
            };
        },
        controls(target) {
            /**
             * Renders the controls for a day.
             */
            if (calendar.lastClickedCell) {
                const previous = document.getElementById("day-control");
                if (previous) {
                    previous.remove();
                };
            };
            calendar.lastClickedCell = target;

            const wrapper = document.createElement("div");
            wrapper.id = "day-control";

            const addButton = document.createElement("button");
            wrapper.appendChild(addButton);
            const addIcon = utils.icon("plus-lg");
            addButton.appendChild(addIcon);

            wrapper.addEventListener("click", (event) => {
                events.render.form(target.dataset.date);
                // BUG: Does not set date on faded days at the end of the month.
            });

            target.appendChild(wrapper);
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
        }
    }
};
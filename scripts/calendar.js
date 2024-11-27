/*---------------------------------- IMPORT ----------------------------------*/
import { user } from "./user.js";
import { utils } from "./utils.js";
import { events } from "./events.js";
import { journal } from "./journal.js";

/*--------------------------------- PLANNER ----------------------------------*/
export const calendar = {
    /**
     * Planner functions.
     * 
     * @param {array} days - Weekday names for referencing in the calendar.
     * @param {array} months - Month names for referencing in the calendar.
     * @param {object} info - Object containing calendar render information.
     * @param {object} render - Functions for rendering the calendar.
     * @param {object} control - Functions for controlling the calendar.
     */
    days: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
    ],
    months: [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ],
    info: {
        cellIndex: 1,
        month: new Date().getMonth(), // Index is 0-11.
        year: new Date().getFullYear(),
        startDay: null,
        totalDays: null
    },
    render: {
        /**
         * Functions for rendering the calendar.
         * 
         * @function header - Renders the calendar header.
         * @function table - Renders the calendar table.
         * @function row - Renders a row in the calendar.
         * @param {object} cell - Functions for rendering calendar day cells.
         */
        header () {
            /**
             * Render the calendar header.
             */
            // Create the wrapper.
            const table = document.getElementById("calendar-table");
            const wrapper = document.createElement("div");
            wrapper.id = "calendar-header";
            wrapper.classList.add("row", "week");
            wrapper.role = "row";

            // Add the table title.
            const title = document.createElement("h3");
            title.textContent = `${calendar.months[calendar.info.month]} ${calendar.info.year}`;
            table.appendChild(title);

            // Create the month and year wrappers.
            const monthWrapper = document.createElement("span");
            const yearWrapper = document.createElement("span");

            // Create the month label and select, and append them to the wrapper.
            const monthLabel = document.createElement("label");
            monthLabel.classList.add("sr-only");
            monthLabel.textContent = "Month:";
            monthWrapper.appendChild(monthLabel);

            const monthSelect = document.createElement("select");
            monthSelect.classList.add("set-calendar");
            monthSelect.id = "calendar-nav-month";
            calendar.months.forEach((month, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = month;
                if (index === calendar.info.month) option.selected = true;
                monthSelect.appendChild(option);
            });
            monthWrapper.appendChild(monthSelect);

            // Create the year label and input, and append them to the wrapper.
            const yearLabel = document.createElement("label");
            yearLabel.classList.add("sr-only");
            yearLabel.textContent = "Year:";
            yearWrapper.appendChild(yearLabel);

            const yearInput = document.createElement("input");
            yearInput.classList.add("set-calendar");
            yearInput.id = "calendar-nav-year";
            yearInput.type = "number";
            yearInput.min = "1900";
            yearInput.max = "2100";
            yearInput.value = calendar.info.year;
            yearWrapper.appendChild(yearInput);

            // Append the month and year wrappers to the title.
            title.innerHTML = "";
            title.appendChild(monthWrapper).addEventListener("change", () => {
                calendar.info.month = parseInt(monthSelect.value, 10);
                calendar.render.table(calendar.info.year, calendar.info.month);
            });
            title.appendChild(yearWrapper).addEventListener("change", () => {
                calendar.info.year = parseInt(yearInput.value, 10);
                calendar.render.table(calendar.info.year, calendar.info.month);
            });

            // Create a navigation wrapper.
            const navWrapper = document.createElement("div");
            navWrapper.classList.add("row");
            navWrapper.id = "calendar-nav";

            // Create the "previous month" button.
            const prev = document.createElement("button");
            prev.ariaLabel = "Go to the previous month";
            prev.title = "Go to the previous month";
            prev.textContent = "Previous";
            prev.type = "button";
            prev.id = "calendar-nav-previous";

            // Create the "next month" button.
            const next = document.createElement("button");
            next.ariaLabel = "Go to the next month";
            next.title = "Go to the next month";
            next.textContent = "Next";
            next.type = "button";
            next.id = "calendar-nav-next";

            // Add a button to go to the current month.
            const current = document.createElement("button");
            current.ariaLabel = "Go to this month";
            current.title = "Go to this month";
            current.textContent = "Current";
            current.type = "button";
            current.id = "calendar-nav-current";

            // Add the buttons to the nav wrapper, and append it to the header.
            navWrapper.appendChild(prev).addEventListener("click", calendar.control.previous);
            navWrapper.appendChild(next).addEventListener("click", calendar.control.next);
            navWrapper.appendChild(current).addEventListener("click", () => {
                const today = new Date();
                calendar.render.table(today.getFullYear(), today.getMonth());
            });
            table.appendChild(navWrapper);

            // Render the week day headers.
            calendar.days.forEach((day) => {
                const header = document.createElement("div");
                header.classList.add("cell", "day-header");
                header.textContent = day;
                header.dataset.weekday = calendar.days.indexOf(day);
                header.id = `${day.toLowerCase()}-header`;
                wrapper.appendChild(header);
            });

            // Append the wrapper to the calendar container.
            table.appendChild(wrapper);
        },
        table (year, month) {
            /**
             * Renders the calendar frame.
             * 
             * @param {number} year - The current year to render.
             * @param {number} month - The current month to render (0-11).
             */
            // Check if the year and month are provided.
            if (!year || !month) {
                year = calendar.info.year;
                month = calendar.info.month;
                if (user.debug === true) {
                    console.log("[calendar.render.table]: Year and month not provided. Using current date." + `\n\tYear: ${year}, Month: ${month}`);
                };

            // If the year and month are provided, update the calendar info.
            } else {
                calendar.info.month = month;
                calendar.info.year = year;
                if (user.debug === true) {
                    console.log("[calendar.render.table]: Year and month provided." + `\n\tYear: ${year}, Month: ${month}`);
                };
            };

            // Reset the cell index counter.
            calendar.info.cellIndex = 1;

            // Calculate the first day of the month, and the month length.
            calendar.info.startDay = (((new Date(year, month)).getDay() - 1) + 7) % 7;
            calendar.info.totalDays = new Date(year, month + 1, 0).getDate();

            // Check if there is a pre-existing table.
            if (document.getElementById("calendar-table")) {
                document.getElementById("calendar-table").remove();
            };

            // Create the new table, and set its attributes.
            const table = document.createElement("section");
            table.ariaLabel = "Calendar";
            table.id = "calendar-table";
            table.role = "grid";

            // Append the table to the calendar container.
            const wrapper = document.getElementById("calendar-container");
            wrapper.appendChild(table);

            // Render the week day headers.
            calendar.render.header();

            // Call for 6 weeks to be rendered.
            for (let week = 1; week < 7; week++) {
                calendar.render.row(week);
            };

            // Add event listener to spawn cell controls.
            table.addEventListener("click", (event) => {
                if (event.target.classList.contains("cell") && !event.target.querySelector("button")) {
                    calendar.control.select(event.target);
                };
            });
        },
        row (number) {
            /**
             * Renders a row in the calendar.
             * 
             * @param {number} number - The row number (1-6).
             */
            // Create the row.
            const week = document.createElement("div");
            week.dataset.week = number;
            week.id = `week-${number}`;
            week.classList.add("row", "week");
            week.role = "row";

            // Append the row to the table.
            const table = document.getElementById("calendar-table");
            table.appendChild(week);

            // Call for 7 days to be rendered.
            for (let cell = 0; cell < 7; cell++) {
                calendar.render.cell.simplified(cell, week);
            };
        },
        cell: {
            /**
             * Functions for rendering cells in the calendar.
             * 
             * @function simplified - Renders a simplified date cell.
             * @function expanded - Renders an expanded date cell.
             */
            simplified (number, row) {
                /**
                 * Renders a simplified cell in the calendar. Each cell holds a
                 * number that acts as coordinates.
                 * 
                 * @param {number} number - The cell number (1-42).
                 * @param {object} row - The row to append the cell to.
                 */
                const cellIndex = (parseInt(row.dataset.week) - 1) * 7 + number;
                const cell = document.createElement("div");
                const dateNumber = document.createElement("time");
                const today = new Date();
                let day = cellIndex - calendar.info.startDay + 1;

                cell.id = `cell-${row.dataset.week}-${number+1}`;
                cell.classList.add("cell");
                cell.dataset.weekday = number;
                cell.role = "gridcell";
                cell.tabIndex = 0;

                // Render the end of the previous month, if needed.
                if (cellIndex < calendar.info.startDay) {
                    const prevYear = calendar.info.month === 0 ? calendar.info.year - 1 : calendar.info.year;
                    const prevMonth = calendar.info.month === 0 ? 11 : calendar.info.month - 1;
                    day = new Date(prevYear, prevMonth - 1, 0).getDate() - (calendar.info.startDay - number - 1);
                    dateNumber.dateTime = utils.createISODate({
                        year: prevYear,
                        month: prevMonth,
                        day
                    });
                    cell.classList.add("faded");

                // Render the current month.
                } else if (cellIndex >= calendar.info.startDay && (cellIndex - calendar.info.startDay) < calendar.info.totalDays) {
                    dateNumber.dateTime = utils.createISODate({
                        year: calendar.info.year,
                        month: calendar.info.month,
                        day
                    });
                    cell.classList.add("day");

                    // Check if the day is today.
                    if (calendar.info.year === today.getFullYear()
                    && calendar.info.month === today.getMonth()
                    && day === today.getDate()) {
                        cell.classList.add("today");
                    };

                // Render the start of next month, if needed.
                } else {
                    day = day - calendar.info.totalDays;
                    dateNumber.dateTime = utils.createISODate({
                        year: calendar.info.month === 11 ? calendar.info.year + 1 : calendar.info.year,
                        month: calendar.info.month === 11 ? 0 : calendar.info.month + 1,
                        day
                    });
                    cell.classList.add("faded");
                };

                // Append the cell to the row, and increment the day counter.
                dateNumber.textContent = day;
                cell.dataset.date = dateNumber.dateTime;
                cell.appendChild(dateNumber);
                row.appendChild(cell);

                // Look for events to display in the cell.
                if (user.events.length > 0) {
                    events.find(dateNumber.dateTime, cell);
                };

                // Look for journals for the day.
                if (user.journals.length > 0) {
                    const entry = journal.find(dateNumber.dateTime);
                    if (entry) {
                        cell.classList.add("journal-entry");
                    }
                };

                // Increment the cell index.
                calendar.info.cellIndex++;
            },
            expanded (cell) {
                /**
                 * Renders an expanded cell in the calendar.
                 * 
                 * @param {object} cell - The cell to render.
                 */
                // Create the wrapper, and append it to the cell.
                const wrapper = document.createElement("div");
                wrapper.id = "day-view";
                cell.appendChild(wrapper);

                // Create the close button.
                const close = document.createElement("button");
                close.textContent = "Close";
                close.ariaLabel = "Close the day view.";
                close.title = "Close the day view.";
                close.type = "button";
                close.id = "close-day-view";
                wrapper.appendChild(close).addEventListener("click", () => calendar.control.close(cell));

                // Get the date for the cell.
                const datetime = cell.querySelector("time");
                const day = parseInt(cell.dataset.date.split("-")[2], 10);
                const month = parseInt(cell.dataset.date.split("-")[1], 10);

                // Set suffix for the day number.
                let suffix = "";
                if (day % 100 >= 11 && day % 100 <= 13) {
                    suffix = "th";
                } else if (day % 10 === 1) {
                    suffix = "st";
                } else if (day % 10 === 2) {
                    suffix = "nd";
                } else if (day % 10 === 3) {
                    suffix = "rd";
                } else {
                    suffix = "th";
                };

                // Set the attributes for the time element.
                datetime.textContent = calendar.months[month - 1] + " " + day + suffix;
                datetime.id = "day-title";

                // Create the title.
                const title = document.createElement("h3");
                title.appendChild(datetime);
                wrapper.appendChild(title);

                // Render the planner.
                events.render.planner(cell);

                // Render the journal.
                journal.render(cell.dataset.date);
            }
        }
    },
    control: {
        /**
         * Functions for controlling the calendar.
         * 
         * @param {object} selected - The currently selected cell.
         * @function next - The function to go to the next month.
         * @function previous - The function to go to the previous month.
         * @function select - The function to select a cell.
         * @function open - The function to open a cell.
         * @function close - The function to close a cell.
         * 
         * @returns {object} control - The calendar control functions.
         */
        selected: null,
        next () {
            /**
             * Go forward to the next month.
             */
            calendar.info.month++;
            if (calendar.info.month > 11) { // Move to next year.
                calendar.info.month = 0;
                calendar.info.year++;
            };
            calendar.render.table();
        },
        previous () {
            /**
             * Go back to the previous month.
             */
            calendar.info.month--;
            if (calendar.info.month < 0) { // Move to previous year.
                calendar.info.month = 11;
                calendar.info.year--;
            };
            calendar.render.table();
        },
        select (cell) {
            /**
             * Selects a day in the calendar and spawns control buttons for it.
             * 
             * @param {object} cell - The cell to select.
             */
            // Don't spawn if cell is expanded.
            if(cell.classList.contains("expanded-day")) return;

            // Remove previous controls, if any.
            if (document.getElementById("day-controls")) {
                document.getElementById("day-controls").remove();
            };

            // Create the wrapper.
            const wrapper = document.createElement("div");
            wrapper.id = "day-controls";
            cell.appendChild(wrapper);

            // Create the open day button.
            const openButton = document.createElement("button");
            openButton.ariaLabel = "Open the detailed view for this day.";
            openButton.title = "Open the detailed view for this day.";
            openButton.textContent = "Open";
            openButton.id = "open-day-view";
            openButton.type = "button";
            wrapper.appendChild(openButton).addEventListener("click", () => calendar.control.open(cell));
        },
        open (cell) {
            /**
             * Opens a selected day in the calendar.
             * 
             * @param {object} cell - The cell to open.
             * 
             * TODO: Highlight the day header for the selected day.
             * CONSIDER: Hide sibling cells, and add a back and forward button.
             */
            // Close the previous day view.
            if (calendar.control.selected) {
                calendar.control.selected.classList.remove("expanded-day");
                calendar.control.selected.parentElement.classList.remove("expanded-week");
                cell.classList.remove("shrunk-day");

                // Remove items from the day view, if any.
                if (document.getElementById("day-view")) {
                    const selectedCell = document.getElementById("day-view").parentElement;
                    selectedCell.classList.remove("expanded-day", "expanded");
                    selectedCell.classList.add("shrunk-day", "shrunk");

                    // Remove the shrunk week class from the row container.
                    const selectedRow = selectedCell.parentElement;
                    selectedRow.classList.remove("expanded-week");
                    selectedRow.classList.add("shrunk-week");

                    // Re-add day number.
                    const datetime = document.createElement("time");
                    datetime.setAttribute("datetime", selectedCell.dataset.date);
                    datetime.textContent = parseInt(selectedCell.dataset.date.split("-")[2], 10);
                    selectedCell.appendChild(datetime);

                    document.getElementById("day-view").remove();
                };

                // Re-add compact events, if any.
                const [year, month, day] = calendar.control.selected.dataset.date.split("-");
            };

            let cellToOpen = cell;

            // If the day is in a different month, go to that month first.
            const month = parseInt(cellToOpen.dataset.date.split("-")[1], 10) - 1;

            if (month !== calendar.info.month) {
                // Grab the data-date attribute from the cell.
                const moveToDate = cellToOpen.dataset.date;
                if (month == calendar.info.month + 1 || month === 0 && calendar.info.month === 11) {
                    calendar.control.next();
                    if (user.debug === true) {
                        console.log("[calendar.control.open]: Going to next month.");
                    };
                } else if (month == calendar.info.month - 1 || month === 11 && calendar.info.month === 0) {
                    calendar.control.previous();
                    if (user.debug === true) {
                        console.log("[calendar.control.open]: Going to previous month.");
                    };
                };
                // Use the data-date attribute to select the correct date.
                const newCell = document.querySelector(`.cell[data-date="${moveToDate}"]`);
                cellToOpen = newCell;
            };

            // Set the selected cell.
            calendar.control.selected = cellToOpen;

            // Expand the cell and its parent.
            cellToOpen.parentElement.classList.remove("shrunk-week");
            cellToOpen.parentElement.classList.add("expanded-week");
            cellToOpen.classList.remove("shrunk-day");
            cellToOpen.classList.add("expanded-day");

            // Expand the week.
            const cellWeek = cellToOpen.parentElement;
            cellWeek.classList.add("expanded-week");

            // Expand the column.
            const cellColumn = document.querySelectorAll(`.cell[data-weekday="${cellToOpen.dataset.weekday}"]`);
            cellColumn.forEach(cell => cell.classList.add("expanded-column"));

            // Shrink the other weeks.
            const shrunkRows = document.querySelectorAll(".row:not(.expanded-week, #calendar-header, #calendar-nav)");
            shrunkRows.forEach(row => row.classList.add("shrunk-week"));

            // Shrink the other days.
            const shrunkCells = document.querySelectorAll(".cell:not(.expanded-day");
            shrunkCells.forEach(day => day.classList.add("shrunk-day"));

            // Remove the controls.
            if (document.getElementById("day-controls")) {
                document.getElementById("day-controls").remove();
            };

            // Remove compact events, if any.
            const compactEvents = cellToOpen.querySelectorAll(".compact-event");
            if (compactEvents) {
                compactEvents.forEach(event => event.remove());
            };

            // Render the day view.
            calendar.render.cell.expanded(cellToOpen);
        },
        close (cell) {
            /**
             * Close any opened day in the calendar.
             * 
             * @param {object} cell - The cell to close.
             */
            // Remove the day view related classes.
            const cells = document.querySelectorAll(".expanded-day, .expanded-week, .shrunk-day, .shrunk-week, .expanded-column");
            cells.forEach(cell => cell.classList.remove("expanded-day", "expanded-week", "shrunk-day", "shrunk-week", "expanded-column"));

            // Close the day view.
            document.getElementById("day-view").remove();

            // Re-add the day number.
            const datetime = document.createElement("time");
            const date = cell.dataset.date;
            datetime.dataset.date = date;
            datetime.textContent = parseInt(date.split("-")[2], 10);
            cell.appendChild(datetime);

            // Re-add compact events, if any.
            events.find(date, cell);
        }
    }
};
/*---------------------------------- IMPORT ----------------------------------*/
import { events } from "./events.js";

/*--------------------------------- PLANNER ----------------------------------*/
export const calendar = {
    /**
     * Planner functions.
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
        day: 1,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        startDay: null,
        totalDays: null
    },
    render: {
        /**
         * Functions for rendering the parts of the calendar.
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
            // TODO: Add month and year navigation.

            // Create a navigation wrapper.
            const navWrapper = document.createElement("div");
            navWrapper.classList.add("row");

            // Create the "previous month" button.
            const prev = document.createElement("button");
            prev.ariaLabel = "Go to the previous month";
            prev.title = "Go to the previous month";
            prev.textContent = "Previous";
            prev.type = "button";

            // TODO: Add a button to go to the current month.

            // Create the "next month" button.
            const next = document.createElement("button");
            next.ariaLabel = "Go to the next month";
            next.title = "Go to the next month";
            next.textContent = "Next";
            next.type = "button";

            // Add the buttons to the nav wrapper, and append it to the header.
            navWrapper.appendChild(prev).addEventListener("click", calendar.control.previous);
            navWrapper.appendChild(next).addEventListener("click", calendar.control.next);
            table.appendChild(navWrapper);

            // Render the week day headers.
            calendar.days.forEach((day) => {
                const header = document.createElement("div");
                header.classList.add("cell", "day-header");
                header.textContent = day;
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
            // If no parameters are passed, use the current set month and year.
            if (!year) year = calendar.info.year;
            if (!month) month = calendar.info.month;

            // Add the month and year to the render info.
            calendar.info.month = month;
            calendar.info.year = year;

            // Reset the day counter.
            calendar.info.day = 1;

            // Calculate the first day of the month, and the month length.
            calendar.info.startDay = (((new Date(year, month)).getDay() - 1) + 7) % 7;
            calendar.info.totalDays = new Date(year, month + 1, 0).getDate();

            // Create the table.
            const table = document.createElement("section");

            // Check if there is a pre-existing table.
            if (document.getElementById("calendar-table")) {
                document.getElementById("calendar-table").remove();
            };

            // Set the table attributes.
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

            // Add event listener.
            table.addEventListener("click", (event) => {
                if (event.target.classList.contains("cell")) {
                    // Spawn cell controls.
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
             * Renders a specific cell in the calendar.
             */
            simplified (number, row) {
                /**
                 * Renders a simplified cell in the calendar. Each cell holds a
                 * number that acts as coordinates.
                 * 
                 * @param {number} number - The cell number (1-42).
                 * @param {object} row - The row to append the cell to.
                 * 
                 * TODO: Add icon for days with deadlines, events, journal entries, and for days where the user has checked in.
                 * TODO: Check for deadlines.
                 */
                // Create the cell.
                const cell = document.createElement("div");
                cell.id = `cell-${row.dataset.week}-${number+1}`;
                cell.classList.add("cell");
                cell.role = "gridcell";
                cell.tabIndex = 0;

                // Set the number for the day to display.
                const currentDay = calendar.info.day - calendar.info.startDay;

                // Last month.
                if (parseInt(row.dataset.week) === 1 && number < calendar.info.startDay) {
                    // Calculate the number of days in the previous month.
                    const prevMonth = calendar.info.month === 0 ? 11 : calendar.info.month - 1;
                    const prevYear = calendar.info.month === 0 ? calendar.info.year - 1 : calendar.info.year;
                    const prevTotalDays = new Date(prevYear, prevMonth + 1, 0).getDate();
                    const prevDay = (prevTotalDays + 1) - (calendar.info.startDay - number);

                    // Add data to the cell.
                    cell.classList.add("faded");

                    // Set the day number.
                    const dateNumber = document.createElement("time");
                    dateNumber.textContent = prevDay;
                    dateNumber.dateTime = `${prevYear}-${prevMonth + 1}-${prevDay}`;
                    cell.dataset.date = `${prevYear}-${prevMonth + 1}-${prevDay}`;
                    cell.appendChild(dateNumber);

                    // Check if there is any events on this day.
                    events.find(cell.dataset.date, cell);
                }

                // Next month.
                else if (currentDay > calendar.info.totalDays) {
                    // Add data to the cell.
                    cell.classList.add("faded");

                    // Set the day number.
                    const dateNumber = document.createElement("time");
                    dateNumber.textContent = currentDay - calendar.info.totalDays;
                    if (calendar.info.month === 11) {
                        dateNumber.dateTime = `${calendar.info.year + 1}-01-${currentDay - calendar.info.totalDays}`;
                        cell.dataset.date = `${calendar.info.year + 1}-01-${currentDay - calendar.info.totalDays}`;
                    } else {
                        dateNumber.dateTime = `${calendar.info.year}-${calendar.info.month + 2}-${currentDay - calendar.info.totalDays}`;
                        cell.dataset.date = `${calendar.info.year}-${calendar.info.month + 2}-${currentDay - calendar.info.totalDays}`;
                    };
                    cell.appendChild(dateNumber);

                    // Check if there is any events on this day.
                    events.find(cell.dataset.date, cell);
                }

                // This month.
                else {
                    // Add days for this month.
                    cell.dataset.date = `${calendar.info.year}-${calendar.info.month + 1}-${currentDay}`;

                    // Set the day number.
                    const dateNumber = document.createElement("time");
                    dateNumber.textContent = currentDay;
                    dateNumber.dateTime = `${calendar.info.year}-${calendar.info.month + 1}-${currentDay}`;
                    cell.appendChild(dateNumber);

                    cell.classList.add("day");

                    // Check if the day is today.
                    if (calendar.info.year === new Date().getFullYear() && calendar.info.month === new Date().getMonth() && currentDay === new Date().getDate()) {
                        cell.classList.add("today");
                    };

                    // Check if there is any events on this day.
                    events.find(cell.dataset.date, cell);
                };

                // Append the cell to the row, and increment the day counter.
                row.appendChild(cell);
                calendar.info.day++;
            },
            expanded (cell) {
                /**
                 * Renders an expanded cell in the calendar.
                 * 
                 * @param {object} cell - The cell to render.
                 * 
                 * TODO: Display events and journal entries, if any.
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
                datetime.textContent = calendar.months[month-1] + " " + day + suffix;
                datetime.id = "day-title";

                // Create the title.
                const title = document.createElement("h3");
                title.appendChild(datetime);
                wrapper.appendChild(title);

                // Render the planner.
                events.render.planner(cell);

                // Render the journal.
                calendar.render.journal();

                console.log(`Showing expanded view of day ${cell.dataset.date}`);
            }
        },
        journal () {
            /**
             * Renders a daily journal.
             * 
             * TODO: Move to its own file.
             * TODO: Check for existing journal entries.
             * TODO: Render entries as articles.
             * TODO: Click on an entry to edit it.
             */
            // Create the wrapper, and append it to the day view.
            const wrapper = document.createElement("div");
            wrapper.id = "journal";
            document.getElementById("day-view").appendChild(wrapper);

            // Create the title.
            const title = document.createElement("h4");
            title.textContent = "Journal";
            wrapper.appendChild(title);

            // Create the form.
            const form = document.createElement("form");
            form.id = "journal-form";
            wrapper.appendChild(form);

            // Create the journal textarea label.
            const textareaLabel = document.createElement("label");
            textareaLabel.setAttribute("for", "journal-text");
            textareaLabel.textContent = "Journal entry:";
            //textareaLabel.classList.add("sr-only");
            form.appendChild(textareaLabel);

            // Create the journal textarea.
            const textarea = document.createElement("textarea");
            textarea.id = "journal-text";
            textarea.placeholder = "Today I...";
            textarea.rows = "5";
            textarea.autocomplete = "off";
            textarea.spellcheck = "true";
            textarea.required = "true";
            form.appendChild(textarea);

            // Create the mood select label.
            const selectLabel = document.createElement("label");
            selectLabel.setAttribute("for", "journal-mood");
            selectLabel.textContent = "Current mood:";
            //selectLabel.classList.add("sr-only");
            form.appendChild(selectLabel);

            // Create the mood select.
            const select = document.createElement("select");
            select.id = "journal-mood";
            //select.required = "true";
            const options = ["--- Select ---", "good", "neutral", "bad"];
            options.forEach(option => {
                const opt = document.createElement("option");
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
                if (option === "--- Select ---") {
                    opt.value = "";
                    opt.selected = "true";
                };
            });
            form.appendChild(select);

            // Create the save button.
            const save = document.createElement("button");
            save.ariaLabel = "Save the journal entry.";
            save.title = "Save the journal entry.";
            save.textContent = "Save";
            save.id = "journal-save";
            save.type = "submit";
            form.appendChild(save);

            // TODO: Stop default form submit handler.

            console.log("Rendering the journal.");
        }
    },
    control: {
        /**
         * Functions for controlling the calendar.
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
            // Remove previous controls, if any.
            if (document.getElementById("day-controls")) {
                document.getElementById("day-controls").remove();
            };

            // Don't spawn if cell is expanded.
            if(cell.classList.contains("expanded-day")) return;

            // Create the wrapper.
            const wrapper = document.createElement("div");
            wrapper.id = "day-controls";
            cell.appendChild(wrapper);

            // Create the open day button.
            const openButton = document.createElement("button");
            openButton.ariaLabel = "Open the detailed view for this day.";
            openButton.title = "Open the detailed view for this day.";
            openButton.textContent = "Open";
            wrapper.appendChild(openButton).addEventListener("click", () => calendar.control.open(cell));

            // Create the add event button.
            const addButton = document.createElement("button");
            addButton.ariaLabel = "Add an event to this day.";
            addButton.title = "Add an event to this day.";
            addButton.textContent = "Add event";
            //wrapper.appendChild(addButton).addEventListener("click", () => events.render.form(cell.dataset.date));

            // Add a button to add deadline.
            const deadlineButton = document.createElement("button");
            deadlineButton.ariaLabel = "Add a deadline to this day.";
            deadlineButton.title = "Add a deadline to this day.";
            deadlineButton.textContent = "Add deadline";
            //wrapper.appendChild(deadlineButton);
            // TODO: Add event listener to add task deadline.
        },
        open (cell) {
            /**
             * Opens a selected day in the calendar.
             * 
             * @param {object} cell - The cell to open.
             * 
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
                events.find(calendar.control.selected.dataset.date, calendar.control.selected);
            };

            let cellToOpen = cell;

            // If the day is in a different month, go to that month first.
            const month = parseInt(cellToOpen.dataset.date.split("-")[1], 10);
            console.log(month);

            // BUG: Events are not being rendered after moving month.
            if (month !== calendar.info.month) {
                // Grab the data-date attribute from the cell.
                const moveToDate = cellToOpen.dataset.date;
                if (month == calendar.info.month + 2) {
                    calendar.control.next();
                    console.log("Going to next month.");
                } else if (month == calendar.info.month - 2) {
                    calendar.control.previous();
                    console.log("Going to previous month.");
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

            // Shrink the other weeks.
            const shrunkRows = document.querySelectorAll(".row:not(.expanded-week)");
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
             */
            // Remove the day view related classes.
            const cells = document.querySelectorAll(".expanded-day, .expanded-week, .shrunk-day, .shrunk-week");
            cells.forEach(cell => cell.classList.remove("expanded-day", "expanded-week", "shrunk-day", "shrunk-week"));

            // Close the day view.
            document.getElementById("day-view").remove();

            // Re-add the day number.
            const datetime = document.createElement("time");
            const date = cell.dataset.date;
            datetime.dataset.date = date;
            datetime.textContent = parseInt(date.split("-")[2], 10);
            cell.appendChild(datetime);

            // Re-add compact events, if any.
            events.find(cell.dataset.date, cell);
        }
    }
};
/*---------------------------------- IMPORT ----------------------------------*/
import { utils } from "./utils.js";
import { user } from "./user.js";
import { calendar } from "./calendar.js";

/*----------------------------- EVENT FUNCTIONS ------------------------------*/
export const events = {
    /**
     * Events data and functions.
     * 
     * @object render - Functions for rendering the events.
     * 
     * @returns {object} events - The events object.
     */
    render: {
        /**
         * Render events.
         * 
         * @function compact - Render a compact event display.
         * @function expanded - Render an expanded event display.
         * @function form - Render the event picker form.
         * 
         * @returns {object} events - The events render object.
         */
        compact (data) {
            /**
             * Render a compact event display in the calendar.
             * 
             * @param {Object} data - The event data object.
             */
            // Create the elements for the compact event display.
            const wrapper = document.createElement("div");
            const span = document.createElement("span");
            const time = document.createElement("time");

            // Set the properties of the wrapper.
            wrapper.classList.add("compact-event");
            wrapper.id = `compact-event-${data.id}`;
            wrapper.ariaExpanded = false;
            wrapper.role = "button";
            wrapper.tabindex = 0;

            // Set the properties of the event title span.
            span.classList.add("compact-event-title");
            span.textContent = data.title;

            // Add the elements to the wrapper.
            wrapper.appendChild(span);
            // wrapper.appendChild(time);

            // Add event listener.
            wrapper.addEventListener("click", () => {
                events.render.expanded(data);
            });

            // Return the wrapper.
            return wrapper;
        },
        expanded (data) {
            /**
             * Renders an expanded event display in a closed day view.
             * 
             * @param {Object} data - The event data object.
             */
            // CONSIDER: Add expanded event display when clicking compact event.
            console.log(`Clicked on event ${data.id}`);
        },
        full (data, update = null) {
            /**
             * Renders a full event.
             * 
             * @param {Object} data - The event data object.
             * @param {Object} update - The full event to update.
             */
            // Create the wrapper.
            const wrapper = document.createElement("li");
            wrapper.classList.add("full-event");
            wrapper.dataset.id = data.id;
            if (user.debug === true) {
                console.log(`[events.render.full]: Rendering full event ${data.id}`);
            };

            // Add the title.
            const title = document.createElement("h6");
            title.classList.add("full-event-title");
            title.textContent = data.title;
            wrapper.appendChild(title);

            // Add the date.
            const date = document.createElement("time");
            date.classList.add("full-event-date");
            date.textContent = data.date.start;
            date.dateTime = data.date.start;
            wrapper.appendChild(date);

            // Add the time.
            const timeWrapper = document.createElement("p");
            timeWrapper.classList.add("full-event-time");
            timeWrapper.textContent = "Time:";
            wrapper.appendChild(timeWrapper);

            if (data.time.allDay) {
                const time = document.createElement("time");
                time.classList.add("full-event-time");
                time.textContent = "All day";
                time.dateTime = data.date.start;
                timeWrapper.appendChild(time);
            } else {
                if (data.time.start) {
                    const startTime = document.createElement("time");
                    startTime.classList.add("full-event-start-time");
                    startTime.textContent = data.time.start;
                    startTime.dateTime = data.time.start;
                    timeWrapper.appendChild(startTime);
                };
                if (data.time.end) {
                    const span = document.createElement("span");
                    span.textContent = " - ";
                    timeWrapper.appendChild(span);

                    const endTime = document.createElement("time");
                    endTime.classList.add("full-event-end-time");
                    endTime.textContent = data.time.end;
                    endTime.dateTime = data.time.end;
                    timeWrapper.appendChild(endTime);
                };
            };

            // Add the description.
            if (data.description) {
                const description = document.createElement("p");
                description.classList.add("full-event-description");
                description.textContent = data.description;
                wrapper.appendChild(description);
            };

            // Add the location.
            if (data.location) {
                const location = document.createElement("p");
                location.classList.add("full-event-location");
                location.textContent = "Location: " + data.location;
                wrapper.appendChild(location);
            };

            // Add the controls wrapper.
            const controls = document.createElement("div");
            controls.id = "full-event-controls";
            wrapper.appendChild(controls);

            // TODO: Add button icons.

            // Add the edit button.
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.ariaLabel = "Edit this event.";
            editButton.title = "Edit this event.";
            editButton.textContent = "Edit";
            controls.appendChild(editButton).addEventListener("click", () => events.edit(data.id));
            if (user.debug === true) {
                console.log(`[events.render.full]: Adding edit button for event ${data.id}`);
            };

            // Add the delete button.
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.ariaLabel = "Delete this event.";
            deleteButton.title = "Delete this event.";
            deleteButton.textContent = "Delete";
            controls.appendChild(deleteButton).addEventListener("click", () => events.delete(data.id));

            // If update is specified, replace the element.
            if (update) {
                update.replaceWith(wrapper);

            // Otherwise, return the element.
            } else {
                return wrapper;
            };
        },
        plannerControls (cell) {
            /**
             * Renders the planner controls.
             * 
             * @param {object} cell - The cell to get the date from.
             */
            // Grab the planner wrapper.
            const wrapper = document.getElementById("planner");

            // Create the control wrapper.
            const controls = document.createElement("div");
            controls.id = "planner-controls";
            wrapper.appendChild(controls);

            // Create the add event button.
            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.ariaLabel = "Add a new event to this day.";
            addButton.title = "Add a new event to this day.";
            addButton.textContent = "Add new event";
            controls.appendChild(addButton).addEventListener("click", () => {
                events.render.form("new-event", cell.dataset.date, wrapper);
                if (document.getElementById("new-event-cancel")) {
                    document.getElementById("new-event-cancel").addEventListener("click", () => events.cancel("new-event", cell));
                };
            });
            // TODO: Add keydown event listener for the cancel button.
        },
        planner (cell) {
            /**
             * Renders a daily planner in the calendar day-view.
             */
            // Create the wrapper, and append it to the day view.
            const wrapper = document.createElement("div");
            wrapper.id = "planner";
            document.getElementById("day-view").appendChild(wrapper);

            // Create the title.
            const title = document.createElement("h4");
            title.textContent = "Planner";
            wrapper.appendChild(title);

            // Create the event list wrapper.
            const listWrapper = document.createElement("div");
            listWrapper.id = "planner-list-wrapper";
            wrapper.appendChild(listWrapper);

            // Create the event list title.
            const listTitle = document.createElement("h5");
            listTitle.textContent = "Events for this day:";
            listWrapper.appendChild(listTitle);

            // Create the list of events.
            const list = document.createElement("ul");
            list.dataset.date = cell.dataset.date;
            list.dataset.weekday = cell.dataset.weekday;
            list.id = "planner-list";
            listWrapper.appendChild(list);

            // Find events for today, and add them to the planner.
            events.find(cell.dataset.date, list, "full");

            // Render the planner control panel.
            // CONSIDER: Append this before the list.
            events.render.plannerControls(cell);
        },
        form (id, date = null, parent = null, action = null) {
            /**
             * Renders the event picker form that lets users create new events.
             * 
             * @param {string} id - The ID of the form.
             * @param {string} date - The date to render the form for.
             * @param {object} parent - The parent element to append the form to.
             * @param {string} action - The action to take when adding the event.
             */
            // Set the form ID.
            if (user.debug === true) {
                console.log(`[events.render.form]: Rendering form for ${id}`);
            };
            const formId = `${id}-form`;

            // If a previous form exists, remove it.
            if (document.getElementById(formId)) {
                document.getElementById(formId).remove();
            };

            // Remove the "add event" button.
            if (document.getElementById("planner-controls")) {
                document.getElementById("planner-controls").remove();
            };

            // Create the form, and set its properties.
            const form = document.createElement("form");
            form.id = formId;

            // Create the header, set its properties, and add it to the form.
            let header = document.createElement("h5");
            if (id === "new-event") {
                header.textContent = "Add a new event";
            } else {
                header = document.createElement("h6");
                header.textContent = "Edit event";
            };
            form.appendChild(header);

            // Add the date fieldset.
            const dateFieldset = document.createElement("fieldset");
            dateFieldset.id = `${id}-date-fieldset`;
            form.appendChild(dateFieldset);

            // Add the legend for the date fieldset.
            const dateLegend = document.createElement("legend");
            dateLegend.textContent = "Date and time";
            dateFieldset.appendChild(dateLegend);

            // Add the start and end date inputs.
            utils.input(`${id}-start-date`, "date", true, dateFieldset, date);
            if (date) {
                if (document.getElementById(`${id}-start-date`)) {
                    document.getElementById(`${id}-start-date`).value = date;
                };
            };
            // TODO: Add a button for "add end date", that spawns this.
            utils.input(`${id}-end-date`, "date", false, dateFieldset);

            // Add the all day and repeat checkboxes.
            utils.input(`${id}-all-day`, "checkbox", false, dateFieldset);
            utils.input(`${id}-repeat`, "checkbox", false, dateFieldset);

            // Add the info fieldset.
            const infoFieldset = document.createElement("fieldset");
            infoFieldset.id = `${id}-info-fieldset`;
            form.appendChild(infoFieldset);

            // Add the legend for the info fieldset.
            const infoLegend = document.createElement("legend");
            infoLegend.textContent = "Details";
            infoFieldset.appendChild(infoLegend);

            // Add the title, description and location inputs.
            utils.input(`${id}-title`, "text", true, infoFieldset);
            utils.input(`${id}-description`, "textarea", false, infoFieldset);
            utils.input(`${id}-location`, "text", false, infoFieldset);

            // Add the form control panel fieldset.
            const buttonsFieldset = document.createElement("fieldset");
            buttonsFieldset.id = `${id}-buttons-fieldset`;
            form.appendChild(buttonsFieldset);

            // Add the form control panel legend.
            const buttonsLegend = document.createElement("legend");
            buttonsLegend.textContent = "Actions";
            buttonsFieldset.appendChild(buttonsLegend);

            // Add the cancel and submit buttons.
            utils.input(`${id}-cancel`, "button", false, buttonsFieldset);
            utils.input(`${id}-submit`, "button", false, buttonsFieldset);

            // Add event listener for form interactions.
            form.addEventListener("change", (event) => {
                if (event.target.id === `${id}-all-day`) {
                    toggleAllDay(id);
                } else if (event.target.id === `${id}-repeat`) {
                    toggleRepeatEvent(id);
                };
            });

            // Add event listener for the form submission.
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                if (action === "edit") {
                    events.add(id, "update");
                } else {
                    events.add(id);
                };
            });
            form.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    if (action === "edit") {
                        events.add(id, "update");
                    } else {
                        events.add(id);
                    };
                };
            });

            // Append the form to the parent element.
            if (parent) {
                parent.appendChild(form);

            // Otherwise, return the form for manual placement.
            } else {
                return form;
            };
        }
    },
    new () {
        /**
         * Creates a new event object to modify.
         * 
         * @returns {object} event - The new event object.
         * 
         * CONSIDER: Add a category and status to the event object.
         */
        return {
            id: null, // Unique ID.
            title: null, // Event title.
            date: { // YYYY-MM-DD.
                start: null, // Start date.
                end: null, // End date.
            },
            time: { // HH:MM.
                allDay: null, // Boolean for all day events.
                start: null, // Start time.
                end: null // End time.
            },
            description: null, // Event description.
            location: null, // Event location.
            recurring: {
                isRecurring: false, // Boolean for recurring events.
                isCustom: false, // Boolean for custom recurring events.
                time: null, // Time frequency. (daily, weekly, monthly, yearly, custom)
                number: null, // Number of times to repeat.
                weekday: null // Day of the week to repeat. (0-6)
            } // If the event is recurring.
        };
    },
    add (id, action = null) {
        /**
         * Add a new event to the events array in the user object.
         * 
         * @param {string} id - The id of the form to get event data from.
         * @param {string} action - The action to take when adding the event.
         */
        const form = document.getElementById(`${id}-form`);
        const data = events.new();

        // Add event start date.
        if (document.getElementById(`${id}-start-date`).value) {
            data.date.start = document.getElementById(`${id}-start-date`).value;
        };

        // Add event end date.
        if (document.getElementById(`${id}-end-date`).value) {
            data.date.end = document.getElementById(`${id}-end-date`).value;
        };

        // Check if the event is all day.
        if (document.getElementById(`${id}-all-day`)) {
            // If the event is all day.
            if (document.getElementById(`${id}-all-day`).checked) {
                data.time.allDay = true;
                data.time.start = "00:00";
                data.time.end = "23:59";

            // If the event is not all day.
            } else {
                if (document.getElementById(`${id}-start-time`).value) {
                    data.time.start = document.getElementById(`${id}-start-time`).value;
                };
                if (document.getElementById(`${id}-end-time`).value) {
                    data.time.end = document.getElementById(`${id}-end-time`).value;
                };
            };
        };

        // Add repeat event data.
        if (document.getElementById(`${id}-repeat`).checked) {
            const select = document.getElementById(`${id}-repeat-select`);
            data.recurring.isRecurring = true;

            // Add the day of the week for the event.
            if (data.date.start) {
                // BUG: This is not working as expected.
                data.recurring.weekday = document.querySelector(`.cell[data-date="${data.date.start}"]`).dataset.weekday;
            };

            if (select.value === "custom") {
                data.recurring.isCustom = true;
                if (document.getElementById(`${id}-repeat-number`).value) {
                    data.recurring.number = document.getElementById(`${id}-repeat-number`).value;
                };
                if (document.getElementById(`${id}-repeat-time`).value) {
                    data.recurring.time = document.getElementById(`${id}-repeat-time`).value;
                };
            } else {
                data.recurring.time = select.value;
                data.recurring.number = 1;
            };
        };

        // Add event title.
        if (document.getElementById(`${id}-title`).value) {
            data.title = document.getElementById(`${id}-title`).value;
        };

        // Add event description.
        if (document.getElementById(`${id}-description`).value) {
            data.description = document.getElementById(`${id}-description`).value;
        };

        // Add event location.
        if (document.getElementById(`${id}-location`).value) {
            data.location = document.getElementById(`${id}-location`).value;
        };

        // If action is update, update the event in the array.
        if (action != null) {
            const index = user.events.findIndex(event => event.id === Number(form.parentElement.dataset.id));
            if (index !== -1) {
                // Keep the event ID the same.
                data.id = user.events[index].id;

                // Update the event in the array.
                user.events[index] = data;

                // Save the user data.
                user.save();

                // Remove the edit form and re-render the event.
                events.render.full(data, document.querySelector(`.full-event[data-id="${data.id}"]`));

            // If the event is not found, log an error.
            } else {
                console.log(`ERROR: Event with the id ${form.parentElement.dataset.id} not found, please report this issue on GitHub.`);
            };

        // Otherwise, add the event as a new array item.
        } else {
            data.id = user.nextEventId;
            user.events.push(data);
            user.nextEventId++;

            // Save the event start date, and reset the form.
            const startDate = document.getElementById(`${id}-start-date`).value;
            form.reset();

            // Re-add the event start date.
            if (document.getElementById(`${id}-start-date`)) {
                document.getElementById(`${id}-start-date`).value = startDate;
            };

            // Save the user data.
            user.save();

            // Render the new event.
            const renderedEvent = events.render.full(data);
            document.getElementById("planner-list").appendChild(renderedEvent);
            if (document.getElementById(`${id}-all-day`)) {
                document.getElementById(`${id}-all-day`).checked = true;
            };
        };
    },
    cancel (id = null, cell = null) {
        /**
         * Cancels the creation of a new event.
         * 
         * @param {object} id - The id of the form to cancel.
         * @param {object} cell - The cell to get the date from.
         */
        // Get the form element to remove.
        const form = document.getElementById(`${id}-form`);

        // Find the form variant.
        const formVariant = id.split("-")[0];
        if (formVariant === "edit") {
            // Get the event ID, and find the event in the user events array.
            const eventId = Number(id.split("-")[2]);
            const event = user.events.find(event => event.id === eventId);

            // If the event is found, re-render the full event.
            if (event) {
                const fullEvent = events.render.full(event);
                form.parentElement.replaceWith(fullEvent);
            };
        } else if (formVariant === "new") {
            form.remove();
            events.render.plannerControls(cell);
        };
    },
    find (date, cell, renderVariant = "compact") {
        /**
         * Finds events for the currently displayed days.
         * 
         * @param {string} date - The date to find events for. (YYYY-MM-DD)
         * @param {object} cell - The cell to add the event data to.
         * @param {function} renderVariant - The function to use for rendering the event.
         */
        if (user.events.length === 0) return; // Skip if there are no events.
        user.events.forEach(event => {
            if (!event) return; // Skip if the event is not found.

            // If the event is recurring, add it to the calendar multiple times.
            if (event.recurring.isRecurring) {
                const { time, number } = event.recurring;
                const eventDate = new Date(event.date.start);
                const cellDate = new Date(cell.dataset.date);
                const [eventYear, eventMonth, eventDay] = event.date.start.split("-").map(Number);
                const [cellYear, cellMonth, cellDay] = cell.dataset.date.split("-").map(Number);
                const diffInMilliseconds = cellDate - eventDate;
                const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
                const lastDayOfMonth = new Date(cellYear, cellMonth, 0).getUTCDate();
                let frequency = 0;
                if (event.recurring.isCustom) {
                    frequency = parseInt(number);
                };

                // Add yearly events.
                if (time === "yearly" || time === "years") {
                    const diffInYears = cellYear - eventYear;

                    // Handle custom yearly recurrence.
                    if (event.recurring.isCustom) {
                        if (diffInDays >= 0 && diffInYears % frequency === 0) {
                            if (eventDay === cellDay || (eventDay > lastDayOfMonth && cellDay === lastDayOfMonth)) {
                                if (renderVariant === "full") {
                                    cell.appendChild(events.render.full(event));
                                } else {
                                    cell.appendChild(events.render.compact(event));
                                    cell.classList.add("event");
                                };
                                if (user.debug === true) {
                                    console.log(`[events.find]: Adding custom yearly event ${event.id} for the date ${event.date.start} with the frequency ${frequency} to ${cell.dataset.date}`);
                                };
                            };
                        };

                    // Handle standard yearly recurrence.
                    } else {
                        if (eventMonth === cellMonth && eventDay === cellDay) {
                            if (eventYear <= cellYear && eventDate !== cellDate) {
                                if (renderVariant === "full") {
                                    cell.appendChild(events.render.full(event));
                                } else {
                                    cell.appendChild(events.render.compact(event));
                                    cell.classList.add("event");
                                };
                                if (user.debug === true) {
                                    console.log(`[events.find]: Adding yearly event ${event.id} for the date ${event.date.start} to ${cell.dataset.date}`);
                                };
                            };
                        };
                    };

                // Add monthly events.
                } else if (time === "monthly" || time === "months") {
                    const diffInMonths = (cellDate.getUTCFullYear() - eventDate.getUTCFullYear()) * 12 + (cellDate.getUTCMonth() - eventDate.getUTCMonth());

                    // Handle custom monthly recurrence.
                    if (event.recurring.isCustom) {
                        if (diffInMonths >= 0 && diffInMonths % frequency === 0) {

                            // Handle edge case: Ensure day matches or is valid for the month.
                            if (eventDay <= lastDayOfMonth && eventDay === cellDay) {
                                if (renderVariant === "full") {
                                    cell.appendChild(events.render.full(event));
                                } else {
                                    cell.appendChild(events.render.compact(event));
                                    cell.classList.add("event");
                                };
                                if (user.debug === true) {
                                    console.log(`[events.find]: Adding custom monthly event ${event.id} for the date ${event.date.start} with the frequency ${frequency} to ${cell.dataset.date}`);
                                };

                            // Allow events on the 31st to fall on the last day of shorter months.
                            } else if (eventDay > lastDayOfMonth && cellDay === lastDayOfMonth) {
                                if (renderVariant === "full") {
                                    cell.appendChild(events.render.full(event));
                                } else {
                                    cell.appendChild(events.render.compact(event));
                                    cell.classList.add("event");
                                };
                                if (user.debug === true) {
                                    console.log(`[events.find]: Adding custom monthly event ${event.id} for the date ${event.date.start} with the frequency ${frequency} to ${cell.dataset.date}`);
                                };
                            };
                        };

                    // Handle standard monthly recurrence.
                    } else {
                        if (eventDay === cellDay || (eventDay > lastDayOfMonth && cellDay === lastDayOfMonth)) {
                            if (event.date.start <= cell.dataset.date) {
                                if (renderVariant === "full") {
                                    cell.appendChild(events.render.full(event));
                                } else {
                                    cell.appendChild(events.render.compact(event));
                                    cell.classList.add("event");
                                };
                                if (user.debug === true) {
                                    console.log(`[events.find]: Adding monthly event ${event.id} for the date ${event.date.start} to ${cell.dataset.date}`);
                                };
                            };
                        };
                    };

                // Add weekly events.
                } else if (time === "weekly" || time === "weeks") {
                    // Handle custom weekly recurrence.
                    if (event.recurring.isCustom) {
                        const diffInWeeks = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 7));
                        if (diffInWeeks >= 0 && diffInWeeks % frequency === 0 && event.recurring.weekday === cell.dataset.weekday) {
                            if (renderVariant === "full") {
                                cell.appendChild(events.render.full(event));
                            } else {
                                cell.appendChild(events.render.compact(event));
                                cell.classList.add("event");
                            };
                            if (user.debug === true) {
                                console.log(`[events.find]: Adding custom weekly event ${event.id} for the date ${event.date.start} with the frequency ${frequency} to ${cell.dataset.date}`);
                            };
                        };

                    // Handle standard weekly recurrence.
                    } else {
                        if (event.date.start <= cell.dataset.date && event.recurring.weekday === cell.dataset.weekday) {
                            if (renderVariant === "full") {
                                cell.appendChild(events.render.full(event));
                            } else {
                                cell.appendChild(events.render.compact(event));
                                cell.classList.add("event");
                            };
                            if (user.debug === true) {
                                console.log(`[events.find]: Adding weekly event ${event.id} for the date ${event.date.start} to ${cell.dataset.date}`);
                            };
                        };
                    };

                // Add daily events
                } else if (time === "daily" || time === "days") {
                    // Handle custom daily recurrence.
                    if (event.recurring.isCustom) {
                        if (diffInDays >= 0 && diffInDays % frequency === 0) {
                            if (renderVariant === "full") {
                                cell.appendChild(events.render.full(event));
                            } else {
                                cell.appendChild(events.render.compact(event));
                                cell.classList.add("event");
                            };
                            if (user.debug === true) {
                                console.log(`[events.find]: Adding custom daily event ${event.id} for the date ${event.date.start} with the frequency ${frequency} to ${cell.dataset.date}`);
                            };
                        };

                    // Handle standard daily recurrence.
                    } else {
                        if (event.date.start <= cell.dataset.date) {
                            if (renderVariant === "full") {
                                cell.appendChild(events.render.full(event));
                            } else {
                                cell.appendChild(events.render.compact(event));
                                cell.classList.add("event");
                            };
                            if (user.debug === true) {
                                console.log(`[events.find]: Adding daily event ${event.id} for the date ${event.date.start} to ${cell.dataset.date}`);
                            };
                        };
                    };
                };

            // If the event is not recurring, add it to the calendar once.
            } else if (!event.recurring.isRecurring && event.date.start === date) {
                if (renderVariant === "full") {
                    cell.appendChild(events.render.full(event));
                } else {
                    cell.appendChild(events.render.compact(event));
                    cell.classList.add("event");
                };
                if (user.debug === true) {
                    console.log(`[events.find]: Found event ${event.id} for ${date}`);
                };
            };
        });
    },
    delete (id) {
        /**
         * Delete an event.
         * 
         * @param {number} id - The ID of the event to delete.
         */
        const event = user.events.findIndex(event => event.id === id);
        if (event !== -1) {
            if (user.debug === true) {
                console.log(`[events.delete]: Deleting event ${id}`);
            };
            user.events.splice(event, 1);
            user.save();
        };
        document.querySelector(`.full-event[data-id="${id}"]`).remove();
    },
    edit (id) {
        /**
         * Edit an event.
         * 
         * @param {number} id - The ID of the event to edit.
         */
        if (user.debug === true) {
            console.log(`[events.edit]: Editing event ${id}`);
        };

        // If the form exists, remove it.
        if (document.getElementById(`edit-event-${id}-form`)) {
            document.getElementById(`edit-event-${id}-form`).remove();
        };

        // Get event data, and render the form in the event to edit.
        const data = user.events.find(event => event.id === id);
        const event = document.querySelector(`.full-event[data-id="${id}"]`);
        const form = events.render.form(`edit-event-${id}`, data.date.start, null, "edit");

        if (event) {
            event.replaceChildren(form);

            // Add data from the event to the form.
            if (document.getElementById(`edit-event-${id}-form`)) {
                // Add the start and end dates.
                document.getElementById(`edit-event-${id}-start-date`).value = data.date.start;
                document.getElementById(`edit-event-${id}-end-date`).value = data.date.end;

                // Add the start and end times if the event is not all day.
                if (data.time.allDay === true) {
                    document.getElementById(`edit-event-${id}-all-day`).checked = true;
                } else {
                    document.getElementById(`edit-event-${id}-all-day`).checked = false;
                    toggleAllDay(`edit-event-${id}`);
                    document.getElementById(`edit-event-${id}-start-time`).value = data.time.start;
                    document.getElementById(`edit-event-${id}-end-time`).value = data.time.end;
                };

                // Add repeat event data.
                if (data.recurring.isRecurring) {
                    document.getElementById(`edit-event-${id}-repeat`).checked = true;

                    // Add the day of the week for the event.
                    if (data.date.start) {
                        data.recurring.day = document.querySelector(`.cell[data-date="${data.date.start}"]`).dataset.day;
                    };

                    toggleRepeatEvent(`edit-event-${id}`);
                    if (data.recurring.isCustom === true) {
                        if (document.getElementById(`edit-event-${id}-repeat-select`)) {
                            document.getElementById(`edit-event-${id}-repeat-select`).selectedIndex = 4;
                            toggleCustomRepeat(`edit-event-${id}`);

                            // Add repeat number.
                            if (data.recurring.number) {
                                if (document.getElementById(`edit-event-${id}-repeat-number`)) {
                                    document.getElementById(`edit-event-${id}-repeat-number`).value = data.recurring.number;
                                };
                            };

                            // Add repeat frequency.
                            if (data.recurring.time) {
                                if (document.getElementById(`edit-event-${id}-repeat-time`)) {
                                    document.getElementById(`edit-event-${id}-repeat-time`).value = data.recurring.time;
                                };
                            };
                        };

                    // If the event is not custom.
                    } else {
                        data.recurring.isCustom = false;

                        // Add repeat number.
                        if (data.recurring.number) {
                            if (document.getElementById(`edit-event-${id}-repeat-number`)) {
                                document.getElementById(`edit-event-${id}-repeat-number`).value = data.recurring.number;
                            };
                        };

                        // Add repeat frequency.
                        if (data.recurring.time) {
                            if (document.getElementById(`edit-event-${id}-repeat-select`)) {
                                document.getElementById(`edit-event-${id}-repeat-select`).value = data.recurring.time;
                            };
                        };
                    };
                };

                // Add the event title, description and location.
                document.getElementById(`edit-event-${id}-title`).value = data.title;
                document.getElementById(`edit-event-${id}-description`).value = data.description;
                document.getElementById(`edit-event-${id}-location`).value = data.location;
            };
        };
        //  Add event listener for cancel button.
        const cancelButton = document.getElementById(`edit-event-${id}-cancel`);
        if (cancelButton) {
            cancelButton.addEventListener("click", () => {
                events.cancel(`edit-event-${id}`);
            });
        };
    },
    import (url) {
        /**
         * Imports an iCalendar file from a given url.
         * 
         * Link to iCalendar documentation: https://icalendar.org/iCalendar-RFC-5545/4-icalendar-object-examples.html
         * 
         * @param {string} url - The URL of the iCal file.
         */
    }
};

/*----------------------------- HELPER FUNCTIONS -----------------------------*/
function toggleAllDay (id) {
    /**
     * Helper function for toggling the "all day" controls.
     * 
     * @param {object} id - The ID of the form to interact with.
     */

    // Get the checkbox.
    const checkboxId = id + "-all-day";
    const checkbox = document.getElementById(checkboxId);

    // Fallback check for the checkbox.
    if (checkbox) {
        // If the checkbox is not checked, create the inputs.
        if (!checkbox.checked) {
            // Create the start time input.
            const dateFieldset = document.getElementById(`${id}-date-fieldset`);
            const repeatWrapper = document.getElementById(`${id}-repeat-wrapper`);
            const idVariant = id.split("-")[0];

            // Get the event data if it exists.
            let event = null;
            if (idVariant === "edit") {
                event = user.events.find(event => event.id === Number(id.split("-")[2]));
            };

            // If no start time input exists, create one.
            if (!document.getElementById(`${id}-start-time-wrapper`)) {
                const startTime = utils.input(`${id}-start-time`, "time", true);
                dateFieldset.insertBefore(startTime, repeatWrapper);

                // If the event has a start time, add it to the input.
                if (event && event.time.start) {
                    document.getElementById(`${id}-start-time`).value = event.time.start;
                };
            };

            // If no end time input exists, create one.
            if (!document.getElementById(`${id}-end-time-wrapper`)) {
                const endTime = utils.input(`${id}-end-time`, "time");
                dateFieldset.insertBefore(endTime, repeatWrapper);

                // If the event has an end time, add it to the input.
                if (event && event.time.end) {
                    document.getElementById(`${id}-end-time`).value = event.time.end;
                };
            };

        // Otherwise, remove the inputs.
        } else {
            // If the start time input exists, remove it.
            if (document.getElementById(`${id}-start-time-wrapper`)) {
                document.getElementById(`${id}-start-time-wrapper`).remove();
            };

            // If the end time input exists, remove it.
            if (document.getElementById(`${id}-end-time-wrapper`)) {
                document.getElementById(`${id}-end-time-wrapper`).remove();
            };
        };
    
    // If the checkbox is not found, log an error.
    } else {
        console.log("[events toggleAllDay]: ERROR - All day checkbox not found! Please report this issue on GitHub.");
    };
};
function toggleRepeatEvent (id) {
    /**
     * Helper function for toggling the repeat event options.
     * 
     * @param {object} id - The ID of the form to interact with.
     */
    //const checkbox = document.getElementById("event-repeat-event");
    const checkbox = document.getElementById(`${id}-repeat`);

    // If the checkbox is checked, render the repeat controls.
    if (checkbox.checked) {
        // Create the wrapper for the repeat options.
        const wrapper = document.createElement("div");
        wrapper.id = `${id}-repeat-options`;
        checkbox.parentElement.appendChild(wrapper);

        // Create the label for the repeat select.
        const label = document.createElement("label");
        label.textContent = "Repeat:";
        label.htmlFor = `${id}-repeat-select`;
        wrapper.appendChild(label);

        // Create the select for the repeat options.
        const select = document.createElement("select");
        select.id = `${id}-repeat-select`;
        wrapper.appendChild(select);

        // Create the options for the select.
        const options = ["daily", "weekly", "monthly", "yearly", "custom"];
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            select.appendChild(opt);
        });

        // Add event listener for the select.
        select.addEventListener("change", () => {
            if (select.value === "custom") {
                toggleCustomRepeat(id);
            };
        });
    } else {
        // Remove the repeat options.
        if (document.getElementById(`${id}-repeat-options`)) {
            document.getElementById(`${id}-repeat-options`).remove();
        };
    };
};
function toggleCustomRepeat (id) {
    /**
     * Helper function for selecting custom repeat frequency.
     * 
     * @param {object} id - The ID of the form to interact with.
     */
    // Create the wrapper.
    const wrapper = document.createElement("div");
    wrapper.id = `${id}-custom-repeat-wrapper`;
    document.getElementById(`${id}-repeat-options`).appendChild(wrapper);

    // Create the number input wrapper.
    const numberWrapper = document.createElement("div");
    numberWrapper.classList.add("form-field");
    wrapper.appendChild(numberWrapper);

    // Create the number input label.
    const numberLabel = document.createElement("label");
    numberLabel.textContent = "Repeat every:";
    numberLabel.htmlFor = `${id}-repeat-number`;
    numberWrapper.appendChild(numberLabel);

    // Create the number input.
    const numberInput = document.createElement("input");
    numberInput.id = `${id}-repeat-number`;
    numberInput.type = "number";
    numberInput.min = 1;
    numberInput.value = 1;
    numberInput.required = true;
    numberWrapper.appendChild(numberInput);

    // Create the time frequency wrapper.
    const timeWrapper = document.createElement("div");
    timeWrapper.classList.add("form-field");
    wrapper.appendChild(timeWrapper);

    // Create the time frequency label.
    const timeLabel = document.createElement("label");
    timeLabel.textContent = "Time frequency:";
    timeLabel.htmlFor = `${id}-repeat-time`;
    timeLabel.classList.add("sr-only");
    timeWrapper.appendChild(timeLabel);

    // Create the time frequency selector.
    const timeSelect = document.createElement("select");
    timeSelect.id = `${id}-repeat-time`;
    timeWrapper.appendChild(timeSelect);

    // Create the time frequency options.
    const timeOptions = ["days", "weeks", "months", "years"];
    timeOptions.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        timeSelect.appendChild(opt);
    });
};
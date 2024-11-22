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
            // TODO: Add expanded event display when clicking compact event.
            console.log(`Clicked on event ${data.id}`);
        },
        full (data, update = null) {
            /**
             * Renders a full event.
             * 
             * @param {Object} data - The event data object.
             * @param {Object} update - The full event to update.
             * 
             * TODO: Add edit and delete buttons.
             */
            // Create the wrapper.
            const wrapper = document.createElement("li");
            wrapper.classList.add("full-event");
            wrapper.dataset.id = data.id;
            console.log(`[events.render.compact]: Rendering full event ${data.id}`);

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
            console.log(`[events.render.full]: Adding edit button for event ${data.id}`);
            controls.appendChild(editButton).addEventListener("click", () => events.edit(data.id));

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
            addButton.ariaLabel = "Add an event to this day.";
            addButton.title = "Add an event to this day.";
            addButton.textContent = "Add event";

            // BUG: The dataset date is not being set correctly.
            console.log(`[events.render.plannerControls]: Adding add event button for the date: ${cell.dataset.date}`);
            controls.appendChild(addButton).addEventListener("click", () => events.render.form("new-event", cell.dataset.date, wrapper));
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
            list.id = "planner-list";
            listWrapper.appendChild(list);

            // Find events for today, and add them to the planner.
            // TODO: Sort events by time, earliest first.
            console.log(`events.render.planner: Finding events for ${cell.dataset.date}`);
            const eventsForDate = user.events.filter(event => event.date.start === cell.dataset.date);
            if (eventsForDate) {
                eventsForDate.forEach((event, index) => {
                    let eventItem = events.render.full(event);
                    list.appendChild(eventItem);
                });
            };

            // Render the planner control panel.
            // CONSIDER: Append this before the list.
            events.render.plannerControls(cell);

            console.log("Rendering the planner.");
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
            console.log(`[events.render.form]: Rendering form for ${id}`);
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
            input(`${id}-start-date`, "date", true, dateFieldset, date);
            //if (date) document.getElementById(`${id}-start-date`).value = date;
            input(`${id}-end-date`, "date", false, dateFieldset);

            // Add the all day checkbox.
            input(`${id}-all-day`, "checkbox", false, dateFieldset);

            // Add the repeat date input.
            input(`${id}-repeat`, "checkbox", false, dateFieldset);

            // Add the info fieldset.
            const infoFieldset = document.createElement("fieldset");
            infoFieldset.id = `${id}-info-fieldset`;
            form.appendChild(infoFieldset);

            // Add the legend for the info fieldset.
            const infoLegend = document.createElement("legend");
            infoLegend.textContent = "Details";
            infoFieldset.appendChild(infoLegend);

            // Add the title, description and location inputs.
            input(`${id}-title`, "text", true, infoFieldset);
            input(`${id}-description`, "textarea", false, infoFieldset);
            input(`${id}-location`, "text", false, infoFieldset);

            // Add the form control panel fieldset.
            const buttonsFieldset = document.createElement("fieldset");
            buttonsFieldset.id = `${id}-buttons-fieldset`;
            form.appendChild(buttonsFieldset);

            // Add the form control panel legend.
            const buttonsLegend = document.createElement("legend");
            buttonsLegend.textContent = "Actions";
            buttonsFieldset.appendChild(buttonsLegend);

            // Add the cancel button.
            input(`${id}-cancel`, "button", false, buttonsFieldset);
            //document.getElementById("event-cancel").addEventListener("click", () => events.cancel(cell));

            // Add the submit button.
            input(`${id}-submit`, "button", false, buttonsFieldset);

            // Add event listener for form interactions.
            form.addEventListener("change", (event) => {
                if (event.target.id === `${id}-all-day`) {
                    toggleAllDay(id);
                } else if (event.target.id === `${id}-repeat`) {
                    toggleRepeatEvent(id);
                };
            });
            //document.getElementById(`${id}-cancel`);

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
                }; // TODO: Add esc key to cancel.
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
                time: null, // Time frequency. (daily, weekly, monthly, yearly)
                number: null // Number of times to repeat.
            } // If the event is recurring.
        };
    },
    add (id, action = null) {
        /**
         * Add a new event to the events array in the user object.
         * 
         * @param {string} id - The id of the form to get event data from.
         * @param {string} action - The action to take when adding the event.
         * 
         * BUG: When adding new events, a compact event renders twice.
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
            if (select.value === "custom") {
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
        };
    },
    cancel (form, cell) {
        /**
         * Cancels the creation of a new event.
         */
        // Remove the event form.
        //document.getElementById("event-form").remove();

        // Render the planner control panel.
        events.render.plannerControls(cell);
    },
    find (lookupDate, cell) {
        /**
         * Checks if the given day has an event, and adds it to the cell.
         * 
         * @param {string} lookupDate - The date to check.
         * @param {string} lookupDate - YYYY-MM-DD format.
         * @param {object} cell - The cell to add the event data to.
         * 
         * @returns {object} - The event object if it exists, otherwise null.
         */
        //console.log("[events.find]: Looking for events for a day.");
        const eventsForDate = user.events.filter(event => event.date.start === lookupDate);
        if (eventsForDate) {
            eventsForDate.forEach((event, index) => {
                if (index < 3) {
                    // Add event related data to the cell.
                    cell.classList.add("event");
                    cell.appendChild(events.render.compact(event));
                    console.log(`[events.find]: Found event ${event.id} for ${lookupDate}`);
                } else {
                    // TODO: Add a [more] bit if there is too many to display.
                    console.log("Too many events to display.");
                };
            });
        };
    },
    delete (id) {
        /**
         * Delete an event.
         * 
         * @param {number} id - The ID of the event to delete.
         */
        const event = user.events.findIndex(event => event.id === id);
        if (event !== -1) {
            console.log(`Deleting event ${id}`);
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
        console.log(`[events.edit]: Editing event ${id}`);
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
                    toggleRepeatEvent(`edit-event-${id}`);
                    if (data.recurring.time) {
                        document.getElementById(`edit-event-${id}-repeat-select`).value = data.recurring.time;
                        if (data.recurring.time === "custom") {
                            toggleCustomRepeat(`edit-event-${id}`);
                            if (data.recurring.number) {
                                document.getElementById(`edit-event-${id}-repeat-number`).value = data.recurring.number;
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
function input (name, type, required = null, location = null, extra = null) {
    /**
     * Helper function for creating inputs with a label and wrapper.
     * 
     * @param {string} name - The name of the input group.
     * @param {string} type - The type of input to make.
     * @param {boolean} required - Whether the input is required.
     * @param {object} location - The location to append to.
     * @param {object} extra - Extra data for the input.
     */
    // Create the wrapper.
    const wrapper = document.createElement("div");
    wrapper.id = `${name}-wrapper`;
    wrapper.classList.add("form-field");

    // If the input is invalid, log an error.
    if (!name || typeof name !== "string") {
        return "ERROR: Input name is not formatted correctly. Please report this issue on GitHub.";
    };

    // Replace dashes with spaces, and split the text.
    const rawText = name.replace(/-/g, " ").split(" ").filter(word => word.trim() !== "");

    // Remove the first two words from the text.
    const labelText = rawText.slice(2);

    // Check if the first word is a number, and remove it for the label.
    if (labelText.length > 0 && !isNaN(labelText[0])) {
        labelText.shift();
    };

    // Capitalize the first letter of the first word.
    if (labelText.length > 0) {
        labelText[0] = labelText[0][0].toUpperCase() + labelText[0].slice(1);

    // If no text is found, log an error.
    } else {
        console.log("ERROR: No text found for an input label. Please report this issue on GitHub.");
        return "Untitled";
    };

    // Join the text back together.
    const text = labelText.join(" ");

    // Create the label.
    const label = document.createElement("label");
    label.id = `${name}-label`;
    label.htmlFor = name;
    label.textContent = text + ":";
    wrapper.appendChild(label);

    // Create the input.
    let input = document.createElement("input");

    // If the input is a textarea, create one.
    if (type === "textarea") {
        input = document.createElement("textarea");

    // If the input is a button, create one.
    } else if (type === "button") {
        input = document.createElement("button");
        label.classList.add("sr-only");
        input.textContent = text;
        input.type = "button";

        // Check if the button is a submit button.
        if (name.includes("submit")) {
            input.type = "submit";

            // Check if the button is for adding or editing an event.
            if (name.includes("new-event")) {
                input.textContent = "Add event";
            } else if (name.includes("edit-event")) {
                input.textContent = "Update event";
            };
        };

    // Otherwise, create a normal input.
    } else {
        input = document.createElement("input");
        input.type = type;
    };

    // Set the input ID.
    input.id = name;

    // If the input is required, set the required attribute.
    if (required === true) {
        input.required = true;
    };

    // If the input is a checkbox, and the text is "All day", check it.
    if (type === "checkbox" && text === "All day") {
        if (location != null) {
            input.checked = true;
        };
    };

    // BUG: Does not insert the date into the input after changing months.
    if (type === "date" && extra) {
        console.log(`[events - input]: Adding date ${extra} to input ${name}`);
        input.value = extra;
    };

    wrapper.appendChild(input);

    // Append the wrapper to the location, or return it.
    if (location != null) {
        location.appendChild(wrapper);
    } else {
        return wrapper;
    };
};
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

            // If no start time input exists, create one.
            if (!document.getElementById(`${id}-start-time-wrapper`)) {
                const startTime = input(`${id}-start-time`, "time", true);
                dateFieldset.insertBefore(startTime, repeatWrapper);
            };

            // If no end time input exists, create one.
            if (!document.getElementById(`${id}-end-time-wrapper`)) {
                const endTime = input(`${id}-end-time`, "time");
                dateFieldset.insertBefore(endTime, repeatWrapper);
            };

            // TODO: Add event data for time inputs if they exist.

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
        console.log("ERROR: All day checkbox not found! Please report this issue on GitHub.");
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
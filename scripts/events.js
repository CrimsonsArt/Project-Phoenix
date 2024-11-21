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
        form (id, date = null, parent = null) {
            /**
             * Renders the event picker form that lets users create new events.
             * 
             * @param {string} id - The ID of the form.
             * @param {string} date - The date to render the form for.
             * @param {object} parent - The parent element to append the form to.
             * 
             */
            // Set the form ID.
            const formId = `${id}-form`;

            // If a previous form exists, remove it.
            if (document.getElementById(formId)) {
                document.getElementById(formId).remove();
            };

            // Remove the "add event" button. // TODO: Fix.
            if (document.getElementById("planner-controls")) {
                document.getElementById("planner-controls").remove();
            };

            // Create the form, and set its properties.
            const form = document.createElement("form");
            form.id = formId;

            // Create the header, set its properties, and add it to the form.
            const header = document.createElement("h5"); // TODO: Change to h6, if needed.
            header.textContent = "Add a new event";
            form.appendChild(header);

            // Add the date fieldset.
            const dateFieldset = document.createElement("fieldset");
            form.appendChild(dateFieldset);

            // Add the legend for the date fieldset.
            const dateLegend = document.createElement("legend");
            dateLegend.textContent = "Date and time";
            dateFieldset.appendChild(dateLegend);

            // Add the start and end date inputs.
            input(`${id}-start-date`, "date", true, dateFieldset);
            //if (date) document.getElementById(`${id}-start-date`).value = date;
            input(`${id}-end-date`, "date", false, dateFieldset);

            // Add the all day checkbox.
            input(`${id}-all-day`, "checkbox", false, dateFieldset);
            //const allDay = document.getElementById("event-all-day");
            //allDay.checked = true;

            // Add event listener for toggling the "all day" controls.
            //allDay.addEventListener("change", toggleAllDay);

            // Add the repeat date input.
            input(`${id}-repeat`, "checkbox", false, dateFieldset);
            const repeatEvent = document.getElementById(`${id}-repeat`);
            //repeatEvent.checked = false;

            // Show repeat options.
            //repeatEvent.addEventListener("change", toggleRepeatEvent);

            // Add the info fieldset.
            const infoFieldset = document.createElement("fieldset");
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
            form.appendChild(buttonsFieldset);

            // Add the form control panel legend.
            const buttonsLegend = document.createElement("legend");
            buttonsLegend.textContent = "Actions";
            buttonsFieldset.appendChild(buttonsLegend);

            // Add the cancel button.
            input(`${id}-cancel`, "button", false, buttonsFieldset);
            //document.getElementById("event-cancel-label").classList.add("sr-only");
            //document.getElementById("event-cancel").addEventListener("click", () => events.cancel(cell));

            // Add the submit button.
            input(`${id}-submit`, "button", false, buttonsFieldset);
            //document.getElementById("event-submit-label").classList.add("sr-only");

            form.addEventListener("submit", (event) => {
                event.preventDefault();
                events.add();
            });
            form.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    events.add();
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
                time: null, // Time frequency. (daily, weekly, monthly, yearly)
                number: null // Number of times to repeat.
            } // If the event is recurring.
        };
    },
    add () {
        /**
         * Add a new event to the events array in the user object.
         */
        const form = document.getElementById("event-form");
        const event = events.new();

        // Add event id, and increment next event id.
        event.id = user.nextEventId;

        // Add event start date.
        if (document.getElementById("event-start-date").value) {
            event.date.start = document.getElementById("event-start-date").value;
        };

        // Add event end date.
        if (document.getElementById("event-end-date").value) {
            event.date.end = document.getElementById("event-end-date").value;
        };

        // Check if the event is all day.
        if (document.getElementById("event-all-day")) {
            // If the event is all day.
            if (document.getElementById("event-all-day").checked) {
                event.time.allDay = true;
                event.time.start = "00:00";
                event.time.end = "23:59";

            // If the event is not all day.
            } else {
                if (document.getElementById("event-start-time").value) {
                    event.time.start = document.getElementById("event-start-time").value;
                };
                if (document.getElementById("event-end-time").value) {
                    event.time.end = document.getElementById("event-end-time").value;
                };
            };
        };

        // Add repeat event data.
        if (document.getElementById("event-repeat-event").checked) {
            const select = document.getElementById("event-repeat-select");
            if (select.value === "custom") {
                if (document.getElementById("event-repeat-number").value) {
                    event.recurring.number = document.getElementById("event-repeat-number").value;
                };
                if (document.getElementById("event-repeat-time").value) {
                    event.recurring.time = document.getElementById("event-repeat-time").value;
                };
            } else {
                event.recurring.time = select.value;
                event.recurring.number = 1;
            };
        };

        // TODO: Do something with the repeat event data.

        // Add event title.
        if (document.getElementById("event-title").value) {
            event.title = document.getElementById("event-title").value;
        };

        // Add event description.
        if (document.getElementById("event-description").value) {
            event.description = document.getElementById("event-description").value;
        };

        // Add event location.
        if (document.getElementById("event-location").value) {
            event.location = document.getElementById("event-location").value;
        };

        // Save to user.
        user.events.push(event);
        user.nextEventId++;
        user.save();

        // Save the event start date, and reset the form.
        const startDate = document.getElementById("event-start-date").value;
        form.reset();

        // Re-add the event start date.
        if (document.getElementById("event-start-date")) {
            document.getElementById("event-start-date").value = startDate;
        };

        // Render the new event.
        const renderedEvent = events.render.full(event);
        document.getElementById("planner-list").appendChild(renderedEvent);
    },
    cancel (cell) {
        /**
         * Cancels the creation of a new event.
         */
        // Remove the event form.
        document.getElementById("event-form").remove();

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
        console.log("Finding events for a day.");
        const eventsForDate = user.events.filter(event => event.date.start === lookupDate);
        if (eventsForDate) {
            eventsForDate.forEach((event, index) => {
                if (index < 3) {
                    // Add event related data to the cell.
                    cell.classList.add("event");
                    cell.appendChild(events.render.compact(event));
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
         * 
         * TODO: Make use of events.render.form() to create the edit form.
         */
        /*// Remove the form if it exists.
        if (document.getElementById(`event-edit-form-${id}`)) {
            document.getElementById(`event-edit-form-${id}`).remove();
        };
        const event = document.querySelector(`.full-event[data-id="${id}"]`);
        event.replaceChildren();

        // Get the event data.
        const data = user.events.find(event => event.id === id);

        // Create the edit heading.
        const heading = document.createElement("h6");
        heading.textContent = "Edit event";
        event.appendChild(heading);

        // Create the form.
        const form = document.createElement("form");
        form.classList.add("edit-form");
        form.id = `event-edit-form-${id}`;
        event.appendChild(form);

        // Create the date and time fieldset.
        const dateFieldset = document.createElement("fieldset");
        form.appendChild(dateFieldset);

        // Create the date and time legend.
        const dateLegend = document.createElement("legend");
        dateLegend.textContent = "Date and time";
        dateFieldset.appendChild(dateLegend);

        // Create the date inputs.
        input("edit-start-date", "date", true, dateFieldset);
        document.getElementById("event-edit-start-date").value = data.date.start;
        input("edit-end-date", "date", false, dateFieldset);
        if (data.date.end) {
            document.getElementById("event-edit-end-date").value = data.date.end;
        };

        // Create the time inputs.
        input("edit-start-time", "time", false, dateFieldset);
        if (data.time.start) {
            document.getElementById("event-edit-start-time").value = data.time.start;
        };
        input("edit-end-time", "time", false, dateFieldset);
        if (data.time.end) {
            document.getElementById("event-edit-end-time").value = data.time.end;
        };

        // TODO: Create the all day checkbox.

        // Create the details fieldset.
        const detailsFieldset = document.createElement("fieldset");
        form.appendChild(detailsFieldset);

        // Create the details legend.
        const detailsLegend = document.createElement("legend");
        detailsLegend.textContent = "Details";
        detailsFieldset.appendChild(detailsLegend);

        // Create the title input.
        input("edit-title", "text", true, detailsFieldset);
        document.getElementById("event-edit-title").value = data.title;

        // Create the description input.
        input("edit-description", "textarea", false, detailsFieldset);
        if (data.description) {
            document.getElementById("event-edit-description").value = data.description;
        };

        // Create the location input.
        input("edit-location", "text", false, detailsFieldset);
        if (data.location) {
            document.getElementById("event-edit-location").value = data.location;
        };

        // Create the control wrapper.
        const controls = document.createElement("fieldset");
        controls.classList.add("edit-controls");
        controls.id = `edit-controls-${id}`;
        form.appendChild(controls);

        // Create the control legend.
        const legend = document.createElement("legend");
        legend.textContent = "Actions";
        controls.appendChild(legend);

        // Create the cancel button.
        input("edit-cancel", "button", false, controls);
        const cancel = document.getElementById(`event-edit-cancel-wrapper`);
        const cancelButton = cancel.querySelector("button");
        cancelButton.textContent = "Cancel";
        const cancelLabel = cancel.querySelector("label");
        cancelLabel.classList.add("sr-only");
        cancel.addEventListener("click", () => {
            // Remove the form, and re-render the event.
            console.log(`Cancel editing event ${id}`);
            event.remove();
            const original = events.render.full(data);
            document.getElementById("planner-list").appendChild(original);
        });

        // Create the save button.
        input("edit-save", "button", false, controls);
        const save = document.getElementById(`event-edit-save-wrapper`);
        const saveButton = save.querySelector("button");
        saveButton.textContent = "Save";
        const saveLabel = save.querySelector("label");
        saveLabel.classList.add("sr-only");
        document.getElementById(`event-edit-save-wrapper`).addEventListener("click", () => {
            // TODO: Add date and time data.
            // Get the title value.
            data.title = document.getElementById("event-edit-title").value;

            // Get the description value.
            data.description = document.getElementById("event-edit-description").value;

            // Get the location value.
            data.location = document.getElementById("event-edit-location").value;

            // Save the event, and re-render it.
            user.save();
            document.querySelector(`.full-event[data-id="${id}"]`).remove();
            const updated = events.render.full(data);
            document.getElementById("planner-list").appendChild(updated);
        });*/
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
function input (name, type, required, location = null) {
    /**
     * Helper function for creating inputs with a label and wrapper.
     * 
     * @param {string} name - The name of the input group.
     * @param {string} type - The type of input to make.
     * @param {boolean} required - Whether the input is required.
     * @param {object} location - The location to append to.
     */
    // Create the wrapper.
    const wrapper = document.createElement("div");
    wrapper.id = `${name}-wrapper`;
    wrapper.classList.add("form-field");

    // Prepare the label text. // TODO: Fix.
    const rawText = name.split("-");
    const text = rawText.map((word, index) => index === 0
    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    : word.toLowerCase())
    .join(" ");

    // Create the label.
    const label = document.createElement("label");
    label.id = `${name}-label`;
    label.htmlFor = `${name}`;
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
        input.textContent = text;
        input.type = "button";

    // Otherwise, create a normal input.
    } else {
        input = document.createElement("input");
        input.type = type;
    };

    // Set the input properties, and append it to the wrapper.
    input.id = `${name}`; // TODO: Remove event from id.
    input.required = required;
    wrapper.appendChild(input);

    // Append the wrapper to the location, or return it.
    if (location != null) {
        location.appendChild(wrapper);
    } else {
        return wrapper;
    };
};
function toggleAllDay () {
    /**
     * Helper function for toggling the "all day" controls.
     */
    // Get the checkbox.
    const checkbox = document.getElementById("event-all-day");

    // If the checkbox is not checked, create the inputs.
    if (!checkbox.checked) {
        if (!document.getElementById("event-start-time-wrapper")) {
            const startTime = input("start-time", "time", false);
            dateFieldset.insertBefore(startTime, document.getElementById("event-repeat-event-wrapper"));
        };
        if (!document.getElementById("event-end-time-wrapper")) {
            const endTime = input("end-time", "time", false);
            dateFieldset.insertBefore(endTime, document.getElementById("event-repeat-event-wrapper"));
        };

    // Otherwise, remove the inputs.
    } else {
        if (document.getElementById("event-start-time-wrapper")) {
            document.getElementById("event-start-time-wrapper").remove();
        };
        if (document.getElementById("event-end-time-wrapper")) {
            document.getElementById("event-end-time-wrapper").remove();
        };
    };
};
function toggleRepeatEvent () {
    /**
     * Helper function for toggling the repeat event options.
     */
    const checkbox = document.getElementById("event-repeat-event");

    // If the checkbox is checked, render the repeat controls.
    if (checkbox.checked) {
        // Create the wrapper for the repeat options.
        const wrapper = document.createElement("div");
        wrapper.id = "event-repeat-options";
        checkbox.parentElement.appendChild(wrapper);

        // Create the label for the repeat select.
        const label = document.createElement("label");
        label.textContent = "Repeat:";
        label.htmlFor = "event-repeat-select";
        wrapper.appendChild(label);

        // Create the select for the repeat options.
        const select = document.createElement("select");
        select.id = "event-repeat-select";
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
                toggleCustomRepeat();
            };
        });
    } else {
        // Remove the repeat options.
        if (document.getElementById("event-repeat-options")) {
            document.getElementById("event-repeat-options").remove();
        };
    };
};
function toggleCustomRepeat () {
    /**
     * Helper function for selecting custom repeat frequency.
     */
    // Create the wrapper.
    const wrapper = document.createElement("div");
    wrapper.id = "custom-repeat-wrapper";
    document.getElementById("event-repeat-options").appendChild(wrapper);

    // Create the number input wrapper.
    const numberWrapper = document.createElement("div");
    numberWrapper.classList.add("form-field");
    wrapper.appendChild(numberWrapper);

    // Create the number input label.
    const numberLabel = document.createElement("label");
    numberLabel.textContent = "Repeat every:";
    numberLabel.htmlFor = "event-repeat-number";
    numberWrapper.appendChild(numberLabel);

    // Create the number input.
    const numberInput = document.createElement("input");
    numberInput.id = "event-repeat-number";
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
    timeLabel.htmlFor = "event-repeat-time";
    timeLabel.classList.add("sr-only");
    timeWrapper.appendChild(timeLabel);

    // Create the time frequency selector.
    const timeSelect = document.createElement("select");
    timeSelect.id = "event-repeat-time";
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
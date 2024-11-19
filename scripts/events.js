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
        compact(data) {
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
        expanded(data) {
            /**
             * Renders an expanded event display in a closed day view.
             * 
             * @param {Object} data - The event data object.
             */
            // TODO: Add expanded event display.
            console.log(`Clicked on event ${data.id}`);
        },
        form(date = null, parent) {
            /**
             * Renders the event picker form that lets users create new events.
             * 
             * @param {string} date - The date to render the form for.
             * @param {object} parent - The parent element to append the form to.
             * 
             */
            if (document.getElementById("event-form")) {
                document.getElementById("event-form").remove();
            }

            // Create the form, and set its properties.
            const form = document.createElement("form");
            form.id = "event-form";

            // Create the header, set its properties, and add it to the form.
            const header = document.createElement("h3");
            header.textContent = "Add a new event";
            form.appendChild(header);

            // Add the form to the calendar.
            parent.appendChild(form);

            // Time and date
            const dateFieldset = document.createElement("fieldset");
            form.appendChild(dateFieldset);

            const dateLegend = document.createElement("legend");
            dateLegend.textContent = "Date and time";
            dateFieldset.appendChild(dateLegend);

            /// Date
            const dateStartWrapper = document.createElement("div");
            dateStartWrapper.classList.add("form-field");
            dateFieldset.appendChild(dateStartWrapper);

            const dateStartLabel = document.createElement("label");
            dateStartLabel.htmlFor = "event-date-start";
            dateStartLabel.textContent = "Start date:";
            dateStartWrapper.appendChild(dateStartLabel);

            const dateStartInput = document.createElement("input");
            dateStartInput.id = "event-date-start";
            dateStartInput.type = "date";
            //dateStartInput.required = true; // BUGGED
            dateStartWrapper.appendChild(dateStartInput);
            if (date) dateStartInput.value = date;

            const dateEndWrapper = document.createElement("div");
            dateEndWrapper.classList.add("form-field");
            dateFieldset.appendChild(dateEndWrapper);

            const dateEndLabel = document.createElement("label");
            dateEndLabel.htmlFor = "event-date-end";
            dateEndLabel.textContent = "End date:";
            dateEndWrapper.appendChild(dateEndLabel);

            const dateEndInput = document.createElement("input");
            dateEndInput.id = "event-date-end";
            dateEndInput.type = "date";
            dateEndWrapper.appendChild(dateEndInput);

            const dateRepeatWrapper = document.createElement("div");
            dateRepeatWrapper.classList.add("form-field");
            dateFieldset.appendChild(dateRepeatWrapper);

            const dateRepeatLabel = document.createElement("label");
            dateRepeatLabel.htmlFor = "event-date-repeat";
            dateRepeatLabel.textContent = "Repeat:";
            dateRepeatWrapper.appendChild(dateRepeatLabel);

            const dateRepeatInput = document.createElement("input");
            dateRepeatInput.id = "event-date-repeat";
            dateRepeatInput.type = "checkbox";
            dateRepeatWrapper.appendChild(dateRepeatInput);
            // TODO: If "repeat" is checked, show the repeat options.

            /// Time
            const allDayWrapper = document.createElement("div");
            allDayWrapper.classList.add("form-field");
            dateFieldset.appendChild(allDayWrapper);

            const allDayLabel = document.createElement("label");
            allDayLabel.htmlFor = "event-all-day";
            allDayLabel.textContent = "All day:";
            allDayWrapper.appendChild(allDayLabel);

            const allDayInput = document.createElement("input");
            allDayInput.id = "event-all-day";
            allDayInput.type = "checkbox";
            allDayInput.checked = true;
            allDayWrapper.appendChild(allDayInput);

            // TODO: Show time only when "all day" is unchecked.
            const timeStartWrapper = document.createElement("div");
            timeStartWrapper.classList.add("form-field");
            dateFieldset.appendChild(timeStartWrapper);

            const timeStartLabel = document.createElement("label");
            timeStartLabel.htmlFor = "event-time-start";
            timeStartLabel.textContent = "Start time:";
            timeStartWrapper.appendChild(timeStartLabel);

            const timeStartInput = document.createElement("input");
            timeStartInput.id = "event-time-start";
            timeStartInput.type = "time";
            timeStartWrapper.appendChild(timeStartInput);

            const timeEndWrapper = document.createElement("div");
            timeEndWrapper.classList.add("form-field");
            dateFieldset.appendChild(timeEndWrapper);

            const timeEndLabel = document.createElement("label");
            timeEndLabel.htmlFor = "event-time-end";
            timeEndLabel.textContent = "End time:";
            timeEndWrapper.appendChild(timeEndLabel);

            const timeEndInput = document.createElement("input");
            timeEndInput.id = "event-time-end";
            timeEndInput.type = "time";
            timeEndWrapper.appendChild(timeEndInput);

            // Details
            const infoFieldset = document.createElement("fieldset");
            form.appendChild(infoFieldset);

            const infoLegend = document.createElement("legend");
            infoLegend.textContent = "Details";
            infoFieldset.appendChild(infoLegend);

            const titleWrapper = document.createElement("div");
            titleWrapper.classList.add("form-field");
            infoFieldset.appendChild(titleWrapper);

            const titleLabel = document.createElement("label");
            titleLabel.htmlFor = "event-title";
            titleLabel.textContent = "Title:";
            titleWrapper.appendChild(titleLabel);

            const titleInput = document.createElement("input");
            titleInput.id = "event-title";
            titleInput.type = "text";
            titleInput.required = true;
            titleWrapper.appendChild(titleInput);

            const descriptionWrapper = document.createElement("div");
            descriptionWrapper.classList.add("form-field");
            infoFieldset.appendChild(descriptionWrapper);

            const descriptionLabel = document.createElement("label");
            descriptionLabel.htmlFor = "event-description";
            descriptionLabel.textContent = "Description:";
            descriptionWrapper.appendChild(descriptionLabel);

            const descriptionInput = document.createElement("textarea");
            descriptionInput.id = "event-description";
            descriptionWrapper.appendChild(descriptionInput);

            const locationWrapper = document.createElement("div");
            locationWrapper.classList.add("form-field");
            infoFieldset.appendChild(locationWrapper);

            const locationLabel = document.createElement("label");
            locationLabel.htmlFor = "event-location";
            locationLabel.textContent = "Location:";
            locationWrapper.appendChild(locationLabel);

            const locationInput = document.createElement("input");
            locationInput.id = "event-location";
            locationInput.type = "text";
            locationWrapper.appendChild(locationInput);

            // Controls
            const buttonsFieldset = document.createElement("fieldset");
            form.appendChild(buttonsFieldset);

            const cancelLabel = document.createElement("label");
            cancelLabel.htmlFor = "event-cancel";
            cancelLabel.textContent = "Cancel:";
            cancelLabel.classList.add("sr-only");
            buttonsFieldset.appendChild(cancelLabel);

            const cancelButton = document.createElement("button");
            cancelButton.id = "event-cancel";
            cancelButton.type = "button";
            cancelButton.textContent = "Cancel";
            buttonsFieldset.appendChild(cancelButton);
            // TODO: Add event cancel handler.

            const submitLabel = document.createElement("label");
            submitLabel.htmlFor = "event-submit";
            submitLabel.textContent = "Submit:";
            submitLabel.classList.add("sr-only");
            buttonsFieldset.appendChild(submitLabel);

            const submitButton = document.createElement("button");
            submitButton.id = "event-submit";
            submitButton.type = "submit";
            submitButton.textContent = "Submit";
            buttonsFieldset.appendChild(submitButton);
            // TODO: Add event submit handler.
            submitButton.addEventListener("click", () => {events.add();});
        }
    },
    new() {
        /**
         * Creates a new event object to modify.
         * 
         * @returns {object} event - The new event object.
         */
        return {
            id: null, // Unique ID.
            title: null, // Event title.
            date: { // YYYY-MM-DD.
                start: null, // Start date.
                end: null, // End date.
            },
            time: { // HH:MM.
                start: null, // Start time.
                end: null // End time.
            },
            summary: null, // Event summary.
            description: null, // Event description.
            location: null, // Event location.
            category: null, // Event category.
            status: null, // Event status.
            recurring: null // If the event is recurring.
        };
    },
    add() {
        /**
         * Add a new event to the events array in the user object.
         * 
         * BUG: Does not work!
         * TODO: Remove default submit handler.
         */
        const event = events.new();

        // Add event id.
        event.id = user.nextEventId;

        // Add event title and date.
        event.title = document.getElementById("event-title").value;
        event.date.start = document.getElementById("event-date-start").value;

        // Add event data, if given.
        const additionalData = [
            document.getElementById("event-date-end"),
            document.getElementById("event-time-start"),
            document.getElementById("event-time-end"),
            document.getElementById("event-description"),
            document.getElementById("event-location")//,
            //document.getElementById("event-category"),
            //document.getElementById("event-status"),
            //document.getElementById("event-recurring")
        ];

        // Clear input fields.
        document.getElementById("event-title").value = "";
        document.getElementById("event-date-start").value = "";

        // Save to user and log to console.
        user.events.push(event);
        user.nextEventId++;
        user.save();
        utils.log("Calendar", `Added event: ${event.title}, on ${event.date.start}.`);

        // Rerender the calendar.
        calendar.render.fullCalendar(calendar.displayYear, calendar.displayMonth);
        // BUG: New events do not show up!
    },
    find(lookupDate, cell) {
        /**
         * Checks if the given day has an event, and adds it to the cell.
         * 
         * @param {string} lookupDate - The date to check.
         * @param {string} lookupDate - YYYY-MM-DD format.
         * @param {object} cell - The cell to add the event data to.
         * 
         * @returns {object} - The event object if it exists, otherwise null.
         */
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
    list (date, list) {
        /**
         * Renders a list of events for a given day.
         * 
         * @param {string} date - The date to check.
         * @param {object} list - The list to add the listed events to.
         * 
         * TODO: Sort events by time.
         */
        const eventsForDate = user.events.filter(event => event.date.start === date);
        if (eventsForDate) {
            eventsForDate.forEach((event, index) => {
                // Create list item.
                const li = document.createElement("li");
                li.classList.add("full-event");

                // Add event title.
                const title = document.createElement("h5");
                title.textContent = event.title;
                li.appendChild(title);

                // TODO: Check if event is all day.
                // TODO: Check if event is recurring.
                // TODO: Add event start and end times, if any.

                // Add event description, if any.
                if (event.description) {
                    const description = document.createElement("p");
                    description.classList.add("full-event-description");
                    description.textContent = event.description;
                    li.appendChild(description);
                };

                // Add event location, if any.
                if (event.location) {
                    const location = document.createElement("p");
                    location.classList.add("full-event-location");
                    location.textContent = event.location;
                    li.appendChild(location);
                };

                // Append to list.
                list.appendChild(li);
            });
        };
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
    },
    import(url) {
        /**
         * Imports an iCalendar file from a given url.
         * 
         * Link to iCalendar documentation: https://icalendar.org/iCalendar-RFC-5545/4-icalendar-object-examples.html
         * 
         * @param {string} url - The URL of the iCal file.
         */
    }
};
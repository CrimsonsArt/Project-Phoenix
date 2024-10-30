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

            // Set the properties of the event time element.
            // TODO: Check if event time has been set.
            // TODO: Add event time if so.

            // Add the elements to the wrapper.
            wrapper.appendChild(span);
            // wrapper.appendChild(time);

            // Return the wrapper.
            return wrapper;
        },
        expanded(data) {
            /**
             * Renders an expanded event display.
             * 
             * @param {Object} data - The event data object.
             */
        },
        form() {
            /**
             * Renders the event picker form that lets users create new events.
             * 
             * CONSIDER: Add helper function for creating labels.
             */
            // Create the form, and set its properties.
            const form = document.createElement("form");
            form.id = "event-form";

            // Create the header, set its properties, and add it to the form.
            const header = document.createElement("h3");
            header.textContent = "Add a new event";
            form.appendChild(header);

            // Add the form to the calendar.
            document.getElementById("calendar").appendChild(form);

            // Create fieldsets for each section.
            const sections = ["details", "time", "info"];
            sections.forEach((section) => {
                const fieldset = document.createElement("fieldset");
                const legend = document.createElement("legend");

                // Set the fieldset and legend properties.
                fieldset.id = `event-${section}`;
                legend.textContent = section.replace("-", " ").charAt(0).toUpperCase() + section.replace("-", " ").slice(1);

                // Add the legend and fieldset to the form.
                fieldset.appendChild(legend);
                form.appendChild(fieldset);
            });

            // Get the new fieldsets.
            const eventDetailsField = document.getElementById("event-details");
            const eventTimeField = document.getElementById("event-time");
            const additionalInfoField = document.getElementById("event-info");

            /*----------------------- Details fieldset -----------------------*/
            // Create event title input, and add it to the event details field.
            const eventTitle = utils.makeInput("event-title", "event title", "text", "Event title", true);
            eventDetailsField.appendChild(eventTitle);

            // Create start date input, and add it to the event details field.
            const dateStart = utils.makeInput("event-date-start", "start date", "date", null, true);
            eventDetailsField.appendChild(dateStart);

            // Create end date input, and add it to the event details field.
            const dateEnd = utils.makeInput("event-date-end", "end date", "date", null);
            eventDetailsField.appendChild(dateEnd);
            // TODO: Add a "different end date?" option that spawns this.

            /*------------------------ Time fieldset -------------------------*/
            // TODO: Find out how to set the time picker to military time.
            // TODO: Ask if event is all-day, if not ask for start and end time.
            // Create start time input, and add it to the event time field.
            const timeStart = utils.makeInput("event-time-start", "start time", "time");
            eventTimeField.appendChild(timeStart);

            // Create end time input, and add it to the event time field.
            const timeEnd = utils.makeInput("event-time-end", "end time", "time");
            eventTimeField.appendChild(timeEnd);

            /*------------------- Additional info fieldset -------------------*/
            // Create description input, and add it to the additional info field.
            const description = utils.makeInput("event-description", "description", "textarea", "Description");
            additionalInfoField.appendChild(description);

            // Create location input, and add it to the additional info field.
            // TODO: Use geolocation API.
            const location = utils.makeInput("event-location", "event location", "text", "Event location");
            additionalInfoField.appendChild(location);

            // TODO: Ask if event should be recurring.

            // TODO: Let user select event category.
            // TODO: Let user create new categories from the category dropdown.

            /*------------------------ Submit button -------------------------*/
            // Create the submit button, set properties, and add it to the form.
            const submitButton = document.createElement("button");
            submitButton.type = "submit";
            submitButton.textContent = "Add event";
            form.appendChild(submitButton).addEventListener("click", (event) => {
                // TODO: Check that all required fields are filled.
                event.preventDefault();
                events.add();
            });
        }
    },
    new() {
        /**
         * Creates a new event object to modify.
         * 
         * @returns {object} event - The new event object.
         * 
         * TODO: Add details.
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
            document.getElementById("event-location"),
            document.getElementById("event-category"),
            document.getElementById("event-status"),
            document.getElementById("event-recurring")
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
        calendar.render();
    },
    search(lookupDate) {
        /**
         * Checks if the given day has an event.
         * 
         * @param {string} lookupDate - The date to check.
         * @param {string} lookupDate - YYYY-MM-DD format.
         * 
         * @returns {object} - The event object if it exists, otherwise null.
         */
        const eventsForDay = user.events.filter(event => event.date.start === lookupDate);
        return eventsForDay.length > 0 ? eventsForDay : null;
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
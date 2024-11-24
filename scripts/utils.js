/*---------------------------- UTILITY FUNCTIONS -----------------------------*/
export const utils = {
    /**
     * Utility functions.
     * 
     * @function log - Logs messages to the console.
     * @function formatRelativeTime - Formats a timestamp as a relative time.
     * @function icon - Generates an icon HTML string.
     * @function controls - Generate control panels.
     * 
     * @returns {object} - The utility object.
     */
    log(origin, message) {
        /**
         * Logs messages to the console.
         * 
         * @param {string} origin - The origin of the message.
         * @param {string} message - The message to log.
         * */
        console.log(`[${origin}]: ${message}`);
    },
    createISODate (info) {
        /**
         * Create an ISO date string from the calendar info.
         */
        // Set the year, month, and day.
        const year = info.year;
    
        // Add 1 to month to match the Date object, and pad with 0 if needed.
        const month = String(info.month).padStart(2, "0");
    
        // Pad the day with 0 if needed.
        const day = String(info.day).padStart(2, "0");
    
        // Return the ISO date string.
        return `${year}-${month}-${day}`;
    },
    formatRelativeTime(timestamp, continuous = false) {
        /**
         * Formats a timestamp as a relative time.
         * 
         * @param {object} timestamp - The Date.now() timestamp to format.
         * @param {boolean} continuous - Whether to continue relative formatting.
         * 
         * @returns {string} - The formatted timestamp.
         */
        const now = new Date();
        const then = new Date(timestamp);
        const diffInMinutes = Math.floor((now - then) / 60000);
        let hours = then.getHours().toString().padStart(2, "0");
        let minutes = then.getMinutes().toString().padStart(2, "0");

        // If less than an hour, return minutes ago.
        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes === 1) return "1 minute ago";
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

        // If less than a day, return hours ago.
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours === 1) return "1 hour ago";
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        // If less than a week, return days ago.
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;

        if (!continuous) {
            // If older than a week, return full date.
            return `${then.getDate()}-${then.getMonth() + 1}-${then.getFullYear()}, ${hours}:${minutes}`;
        } else {
            // Calculate the number of weeks.
            const diffInWeeks = Math.floor(diffInDays / 7);
            if (diffInWeeks === 1) return "A week ago";
            if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

            // Calculate the number of months.
            const diffInMonths = Math.floor(diffInWeeks / 4);
            if (diffInMonths === 1) return "A month ago";
            if (diffInMonths < 12) return `${diffInMonths} months ago`;

            // Calculate the number of years.
            const diffInYears = Math.floor(diffInMonths / 12);
            if (diffInYears === 1) return "A year ago";
            return `${diffInYears} years ago`;
        };
    },
    icon(i) {
        /**
         * Generates a formatted icon.
         */
        const wrapper = document.createElement("span");
        wrapper.classList.add("bi", `bi-${i}`);
        wrapper.setAttribute("aria-hidden", "true");
        return wrapper;
    },
    button(type, source, id = null, context = null) {
        /**
         * Generates a button HTML string.
         * 
         * Will throw an error if the button type is invalid. This was a great
         * opportunity to let me learn how to throw errors in JS.
         * 
         * @param {string} type - The type of button, valid options in defaults.
         * @param {string} source - The source of the button, for accessibility.
         * @param {string} id - The ID of the newly created button.
         * 
         * TODO: Update icons.
         */
        const defaults = {
            add: {
                label: "add",
                icon: "plus-circle"
            },
            submit: {
                label: "submit",
                icon: "plus-circle"
            },
            delete: {
                label: "delete",
                icon: "trash"
            },
            edit: {
                label: "edit",
                icon: "pencil-square"
            },
            cancel: {
                label: "cancel",
                icon: "x-square"
            },
            close: {
                label: "close",
                icon: "x-square"
            },
            save: {
                label: "save",
                icon: "floppy"
            },
            archive: {
                label: "archive",
                icon: "archive"
            },
            next: {
                label: "next",
                icon: "chevron-right"
            },
            previous: {
                label: "previous",
                icon: "chevron-left"
            },
            down: {
                label: "open",
                icon: "chevron-down"
            },
            hierarchy: {
                label: "hierarchy",
                icon: "diagram-2"
            }
        };

        // Check if the button type is valid.
        if (!defaults[type]) { 
            // If not, throw an error.
            throw new Error(`Invalid button type: "${type}"`);
        };

        let buttonId = "";
        if (!id) {
            buttonId = `${type}-${source}`;
        } else {
            buttonId = `${type}-${source}-${id}`;
        }

        let buttonLabel = "";
        if (context) {
            buttonLabel = `${context} ${defaults[type].label} ${source}`;
        } else {
            buttonLabel = `${defaults[type].label} ${source}`;
        };

        // Create the button, and add classes and attributes.
        const button = document.createElement("button");
        button.type = "button";
        button.id = buttonId;
        button.classList.add("button", `button-${type}`);
        button.title = buttonLabel;
        button.ariaLabel = buttonLabel;

        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.classList.add("bi", `bi-${defaults[type].icon}`);
        button.appendChild(icon);

        // Return the button.
        return button;
    },
    meetsRequirements(formId) {
        /**
         * Checks if the requirements are met.
         * 
         * @param {string} formId - The ID of the form to check.
         * 
         * @returns {boolean} - True if the requirements are met, false if not.
         */
        const form = document.getElementById(formId);
        const requiredInputs = form.querySelectorAll("[required]");
        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                return false;
            };
        };
    },
    input (name, type, required = null, location = null, extra = null) {
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
            return "[utils input]: ERROR - Input name is not formatted correctly. Please report this issue on GitHub.";
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
            console.log("[utils input]: ERROR - No text found for an input label. Please report this issue on GitHub.");
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
    
        // Add extra data to the input.
        if (type === "date" && extra) {
            console.log(`[utils - input]: Adding date ${extra} to input ${name}`);
            input.value = extra;
        };
        wrapper.appendChild(input);
    
        // Append the wrapper to the location, or return it.
        if (location != null) {
            location.appendChild(wrapper);
        } else {
            return wrapper;
        };
    },
    modal(title, content) {
        /**
         * Creates a modal element.
         * 
         * @param {string} title - The title of the modal.
         * @param {string} content - The content of the modal.
         * 
         * @returns {object} - The modal element.
         */
        const modal = document.createElement("aside");

        // Set the modal properties.
        modal.classList.add("modal");

        // Add header.
        const header = document.createElement("header");
        const titleElement = document.createElement("h2");
        const closeButton = utils.button("cancel", "modal");
        titleElement.textContent = title;

        header.appendChild(titleElement);
        modal.appendChild(header);

        // Add content.
        const contentElement = document.createElement("p");
        contentElement.textContent = content;
        modal.appendChild(contentElement);

        // Add footer.
        const footer = document.createElement("footer");

        // Return the modal.
        return modal;
    }
};
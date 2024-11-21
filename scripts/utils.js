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
    input (name, type, required, location = null) {
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
        wrapper.id = `event-${name}-wrapper`;
        wrapper.classList.add("form-field");

        // Prepare the label text.
        const rawText = name.split("-");
        const text = rawText.map((word, index) => index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase())
        .join(" ");

        // Create the label.
        const label = document.createElement("label");
        label.id = `event-${name}-label`;
        label.htmlFor = `event-${name}`;
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
        input.id = `event-${name}`; // TODO: Remove event from id.
        input.required = required;
        wrapper.appendChild(input);

        // Append the wrapper to the location, or return it.
        if (location != null) {
            location.appendChild(wrapper);
        } else {
            return wrapper;
        };
    },
    // TODO: Remove this function, it is deprecated.
    //makeInput(id, labelText, type, placeholder = null, required = false) {
        /**
         * Creates an input element with a label, wrapped in a div.
         * 
         * @param {string} id - The ID of the input element.
         * @param {string} label - The label text.
         * @param {string} type - The type of the input element.
         * @param {string} placeholder - The placeholder text.
         * @param {boolean} required - Whether the input is required.
         * 
         * @returns {object} - The input element.
         */
        /*// Create the elements.
        const wrapper = document.createElement("div");
        const label = document.createElement("label");
        let input = document.createElement("input");
    
        // Set the label properties.
        label.htmlFor = id;
        label.textContent = `${labelText.charAt(0).toUpperCase()}${labelText.slice(1)}:`;
    
        // Set the input properties.
        if (type === "textarea") {
            input = document.createElement("textarea");
        } else {
            input.type = type;
        };
        input.required = required;
        input.name = labelText;
        input.id = id;
    
        // Set the placeholder if provided.
        if (placeholder) {
            input.placeholder = placeholder;
        };
    
        // Add the elements to the wrapper.
        wrapper.appendChild(label);
        wrapper.appendChild(input);
    
        // Set the wrapper properties, and return it.
        wrapper.classList.add("input-wrapper");
        return wrapper;
    },*/
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
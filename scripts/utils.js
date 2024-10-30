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
    formatRelativeTime(timestamp) {
        /**
         * Formats a timestamp as a relative time.
         * 
         * @param {object} timestamp - The Date.now() timestamp to format.
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
        if (diffInDays === 1) return `Yesterday at ${hours}:${minutes}`;
        if (diffInDays < 7) return `${diffInDays} days ago`;

        // If older than a week, return full date.
        return `${then.getDate()}-${then.getMonth() + 1}-${then.getFullYear()}, ${hours}:${minutes}`;
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
        button.classList.add(`btn-${type}`);
        button.title = buttonLabel;
        button.ariaLabel = buttonLabel;

        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.classList.add("bi", `bi-${defaults[type].icon}`);
        button.appendChild(icon);

        // Return the button.
        return button;
    }
};
import { utils } from "./utils.js";
import { user } from "./user.js";

/*------------------------- USER INTERFACE FUNCTIONS -------------------------*/
export const toast = {
    /**
     * Controls toast functionality.
     * 
     * @function add - Show a toast message.
     * @function load - Load toast messages.
     * @function render - Render toast messages.
     * @function delete - Remove a toast message.
     * @function updateTimestamps - Update the toast timestamps.
     * @function toggleLog - Toggle the toast log.
     * 
     * @returns {object} ui - The toast object. 
     * 
     * TODO: If there are 25 toasts, delete the oldest toast.
     * TODO: Add another tab for the companion log.
     * TODO: Add icons to toast.
     * CONSIDER: Open toast-log if user clicks on active toast.
     */
    toastLogOpen: false,
    add(message, title = "info") {
        /**
         * Create a new toast message.
         * 
         * @param {string} message - The message to display.
         * @param {string} title - The title of the toast.
         * @param {string} title - "info" - "success" - "warning" - "error"
         */
        const toast = {
            id: user.nextToastId,
            title: title,
            message: message,
            time: Date.now()
        };
        user.toasts.push(toast); // Add toast to user object.
        user.nextToastId++; // Increment next toast ID.
        user.save(); // Save changes to user object.

        // Render toast.
        if (!this.toastLogOpen) {
            this.render(toast, 1);
        } else {
            this.render(toast);
        };
    },
    load() {
        /**
         * Loads the toast list items, so they can be displayed instantly when
         * the toast log is opened.
         */
        // Check if user has any toasts.
        if (user.toasts && user.toasts.length > 0) {
            user.toasts.forEach(toast => {
                this.render(toast);
            });
        };
    },
    render(data, isNew = false) {
        /**
         * Renders the toast list items in the toast log.
         * 
         * TODO: Add hover over timestamp to display exact time.
         * TODO: Allow hovering over toast to pause the removal of the toast.
         * TODO: Ensure that alike toasts are grouped together, if they happen after each other.
         * CONSIDER: Add source or something in the toast title (e.g. "Import - Success")?
         */
        const wrapper = document.createElement("li");
        let title = data.title.charAt(0).toUpperCase() + data.title.slice(1);

        // Set up timestamp.
        let time = new Date(data.time);
        let datetime = time.toISOString();
        let timeLabel = `${time.toLocaleString("default", { month: "long" })} ${time.getDate()}, ${time.getFullYear()} at ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;

        // Add data to toast.
        wrapper.classList.add("toast", data.title);
        wrapper.id = `toast-${data.id}`;
        wrapper.innerHTML = `<strong class="toast-title">${title}</strong>
        <p class="toast-msg">${data.message}</p>
        <p class="timestamp">
            <span class="sr-only">Toast generated: </span>
            <time datetime="${datetime}" aria-label="${timeLabel}">${utils.formatRelativeTime(time)}</time>
        </p>`;
        wrapper.appendChild(utils.button("delete", "toast", data.id));

        // Check if toast log is open, if not, add "show-temp" class.
        if (!this.toastLogOpen && isNew) {
            wrapper.classList.add("show-temp");

            // Remove "show-temp" class after 5 seconds.
            // TODO: Turn this into a setting, changeable by user.
            setTimeout(() => wrapper.classList.remove("show-temp"), 5000);
        };

        // Add toast to list.
        document.querySelector("#log-list").prepend(wrapper);

        // Add event listener to delete button.
        document.getElementById(`delete-toast-${data.id}`).addEventListener("click", () => this.delete(data.id));
    },
    delete(id) {
        /**
         * Remove a toast message.
         * 
         * @param {number} id - The ID of the toast to remove.
         */
        // Remove toast from array.
        user.toasts = user.toasts.filter(toast => toast.id !== id);

        // Remove toast from DOM.
        const toast = document.getElementById(`toast-${id}`);
        if (toast) {
            toast.remove();
        };

        // Log to console, and save changes.
        utils.log("Toast", `Deleting toast with ID: ${id}`);
        user.save();
    },
    updateTimestamps() {
        /**
         * Updates the timestamps in the toast log, if the toast log is open.
         * 
         * If the toast log is open, it will loop through all the toasts and
         * get the timestamp found in the time-element's datetime attribute. It
         * will then call the formatRelativeTime() function using that timestamp
         * to update the relative time in the toast.
         */
        //if (toast.toastLogOpen) { // TODO: Add "or, if a toast is visible."
            const toasts = document.querySelectorAll(".toast");
            toasts.forEach(toast => {
                let timeElement = toast.querySelector("time");
                let timestamp = timeElement.getAttribute("datetime");
                timeElement.textContent = utils.formatRelativeTime(new Date(timestamp));
            });
        //};
    },
    toggleLog() {
        /**
         * Open the toast log list.
         */
        let logTitle = document.getElementById("log-title");
        let logList = document.getElementById("log-list");
        if (!toast.toastLogOpen) {
            // Open toast log.
            utils.log("UI", "Opening toast log.");
            toast.toastLogOpen = true;
            logTitle.classList.remove("sr-only");
            logList.classList.remove("log-closed");
        } else {
            // Close toast log.
            utils.log("UI", "Closing toast log.");
            toast.toastLogOpen = false;
            logTitle.classList.add("sr-only");
            logList.classList.add("log-closed");
        };
    }
};
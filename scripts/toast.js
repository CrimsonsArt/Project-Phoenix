/*---------------------------------- IMPORT ----------------------------------*/
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
     * @function toggle - Toggle the toast log visibility.
     * 
     * @returns {object} ui - The toast object.
     */
    isOpen: false,
    add (message, title = "info") {
        /**
         * Create a new toast message.
         * 
         * @param {string} message - The message to display.
         * @param {string} title - The title of the toast.
         * @param {string} title - "info" - "success" - "warning" - "error"
         */
        const data = {
            id: user.nextToastId,
            title: title,
            message: message,
            time: Date.now()
        };
        user.toasts.push(data); // Add toast to user object.
        user.nextToastId++; // Increment next toast ID.
        user.save(); // Save changes to user object.

        // Render toast.
        if (!toast.isOpen) {
            toast.render(data, 1);
            console.log("[toast.add]: Toast added to log, render popup.");
        } else {
            toast.render(data);
            console.log("[toast.add]: Toast added to log directly.");
        };
    },
    load () {
        /**
         * Loads the toast list items, so they can be displayed instantly when
         * the toast log is opened.
         */
        // Check if user has any toasts.
        if (user.toasts && user.toasts.length > 0) {
            if (user.debug === true) {
                console.log("[toast.load]: Loading toasts from user object.");
            }
            user.toasts.forEach(data => {
                toast.render(data);
            });
        };
    },
    render (data, isNew = false) {
        /**
         * Renders the toast list items in the toast log.
         * 
         * @param {object} data - The toast data to render.
         * @param {boolean} isNew - If the toast is new or not.
         * 
         * TODO: Allow hovering over toast to pause the removal of the toast.
         * TODO: Ensure that alike toasts are grouped together, if they happen after each other.
         */
        const wrapper = document.createElement("li");
        const title = data.title.charAt(0).toUpperCase() + data.title.slice(1);

        // Set up timestamp.
        const time = new Date(data.time);
        const datetime = time.toISOString();
        const timeLabel = `${time.toLocaleString("default", { month: "long" })} ${time.getDate()}, ${time.getFullYear()} at ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;

        // Add data to toast.
        wrapper.classList.add("toast", data.title);
        wrapper.id = `toast-${data.id}`;
        wrapper.innerHTML = `<strong class="toast-title">${title}</strong>
        <p class="toast-msg">${data.message}</p>
        <p class="timestamp">
            <span class="sr-only">Toast generated: </span>
            <time datetime="${datetime}" aria-label="${timeLabel}">${utils.formatRelativeTime(time)}</time>
        </p>`;

        // Create the delete button.
        const delBtn = utils.button("delete", "Delete toast", "trash");
        delBtn.id = `toast-delete-${data.id}`;
        wrapper.appendChild(delBtn);

        // Check if toast log is open, if not, add "show-temp" class.
        if (!toast.isOpen && isNew) {
            wrapper.classList.add("show-temp");

            // Remove "show-temp" class after 5 seconds.
            setTimeout(() => wrapper.classList.remove("show-temp"), 5000);
        };

        // Add toast to list.
        document.querySelector("#toast-list").prepend(wrapper);

        // Add event listener to delete button.
        document.getElementById(`toast-delete-${data.id}`).addEventListener("click", () => toast.delete(data.id));

        if (user.debug === true) {
            console.log(`[toast.render]: Toast rendered with ID: ${data.id}`);
        };
    },
    delete (id) {
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
        if (user.debug === true) {
            console.log(`[toast.delete]: Deleting toast with ID: ${id}`);
        };
        user.save();
    },
    updateTimestamps () {
        /**
         * Updates the timestamps in the toast log, if the toast log is open.
         * 
         * If the toast log is open, it will loop through all the toasts and
         * get the timestamp found in the time-element's datetime attribute. It
         * will then call the formatRelativeTime() function using that timestamp
         * to update the relative time in the toast.
         */
        const toasts = document.querySelectorAll(".toast");
        toasts.forEach(toast => {
            let timeElement = toast.querySelector("time");
            let timestamp = timeElement.getAttribute("datetime");
            timeElement.textContent = utils.formatRelativeTime(new Date(timestamp));
        });
    },
    toggle () {
        /**
         * Open the toast log menu.
         */
        const logTitle = document.getElementById("log-title");
        const list = document.getElementById("toast-list");
        if (!toast.isOpen) {
            // Open toast log.
            console.log("[toast.toggle]: Opening toast log.");
            toast.isOpen = true;
            logTitle.classList.remove("sr-only");
            list.classList.remove("closed-menu");
        } else {
            // Close toast log.
            console.log("[toast.toggle]: Closing toast log.");
            toast.isOpen = false;
            logTitle.classList.add("sr-only");
            list.classList.add("closed-menu");
        };
    }
};
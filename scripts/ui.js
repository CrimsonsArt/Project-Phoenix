/*------------------------- USER INTERFACE FUNCTIONS -------------------------*/
export const ui = {
    /**
     * Controls the user interface.
     * 
     * @function log - Logs messages to the console.
     * @function icon - Generates an icon HTML string.
     * @function controls - Generate control panels.
     * @function toast - Show a toast message.
     * 
     * @returns {object} ui - The user interface object. 
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
    icon(iconName) {
        /**
         * Generates an icon HTML string.
         */
        return `<span class="bi bi-${iconName}" aria-hidden="true"></span>`;
    },
    controls(buttons = [], labelContext = "", events = {}) {
        /**
         * Generate control buttons.
         * 
         * TODO: Update icons.
         */
        // Define button types.
        const buttonTypes = {
            edit: {
                text: "edit",
                icon: "pencil-square",
                ariaLabel: `Edit ${labelContext}`
            },
            delete: {
                text: "delete",
                icon: "trash",
                ariaLabel: `Delete ${labelContext}`
            },
            add: {
                text: "add",
                icon: "plus-circle",
                ariaLabel: `Add new ${labelContext}`
            },
            submit: {
                text: "submit",
                icon: "plus-circle",
                ariaLabel: `Submit ${labelContext}`
            },
            update: {
                text: "update",
                icon: "arrow-repeat",
                ariaLabel: `Update ${labelContext}`
            }
        };

        // Create the control panel.
        let panel = document.createElement("div");
        panel.classList.add("control-panel");

        // Add buttons to the control panel.
        buttons.forEach((buttonType) => {
            if (buttonTypes[buttonType]) {
                // Create the button.
                const button = document.createElement("button");

                // Add attributes to the button.
                button.title = buttonTypes[buttonType].ariaLabel;
                button.ariaLabel = buttonTypes[buttonType].ariaLabel;
                button.classList.add(`btn-${labelContext}-${buttonTypes[buttonType].text}`);
                button.type = "button";

                // Add event listeners to the button.
                if (events[buttonType]) {
                    button.addEventListener("click", events[buttonType]);
                } else if (!events) {
                    // Log error.
                    ui.log("Control Panel - error", `No event listener defined for button type: ${buttonType}`);
                } else {
                    // Log error.
                    ui.log("Control Panel - error", `Invalid event type: ${buttonType}`);
                };

                // Generate the button icon.
                button.innerHTML = this.icon(buttonTypes[buttonType].icon);

                // Add the button to the panel.
                panel.appendChild(button);
            } else {
                // Log error.
                ui.log("Control Panel - error", `Invalid button type: ${buttonType}`);
            };
        });

        return panel;
    },
    toast(message, title = "info") {
        /**
         * Show toast messages.
         * 
         * TODO: Redo.
         * TODO: Add icons to toast.
         * TODO: Ensure that toast messages don't overlap.
         * CONSIDER: Toast-log for the user.
         */
        // Create toast container.
        let toastContainer = document.getElementsByTagName("header")[0];
        let toast = document.createElement("div");

        // Add info to toast.
        toast.classList.add("toast", title, "show");
        toast.innerHTML = `<h2>${title.charAt(0).toUpperCase() + title.slice(1)}:</h2>
        <p>${message}</p>
        <button id="toast-close" aria-label="Close toast">
            <span class="bi bi-x-square" aria-hidden="true"></span>
        </button>`;

        // Add toast to container and log to console.
        toastContainer.appendChild(toast);
        ui.log(`Toast - ${title}`, message);

        // Initial removal timer (e.g., 5 seconds = 5000 milliseconds).
        const totalTimeout = 5000;
        let startTime = Date.now();
        let remainingTime = totalTimeout;
        let toastClose = document.getElementById("toast-close");

        // Function to remove the toast.
        const removeToast = (fadeout = 100) => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), fadeout);
            ui.log(`Toast - ${title}`, `Removed ${title} toast.`);
        };

        // Start the removal timer.
        let removalTimer = setTimeout(removeToast, remainingTime);
        ui.log(`Toast - timer`, `Removing in ${totalTimeout}ms.`);

        // Pause and resume the removal timer.
        const toggleTimer = (pause) => {
            if (pause) {
                clearTimeout(removalTimer);
                remainingTime -= (Date.now() - startTime);
                ui.log(`Toast - timer`, `Pausing removal timer.`);
            } else if (!document.activeElement.closest(".toast")) {
                startTime = Date.now();
                removalTimer = setTimeout(removeToast, remainingTime);
                ui.log(`Toast - timer`, `Resuming removal timer.`);
            };
        };

        // Event listeners for pause and resume.
        toast.addEventListener("mouseenter", () => toggleTimer(true));
        toast.addEventListener("mouseleave", () => toggleTimer(false));
        toastClose.addEventListener("focus", () => toggleTimer(true));
        toastClose.addEventListener("focusout", () => toggleTimer(false));

        // Close the toast on click.
        toastClose.addEventListener("click", () => {
            clearTimeout(removalTimer);
            removeToast(0);
        });
    }
};
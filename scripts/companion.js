/*---------------------------------- IMPORT ----------------------------------*/

import { user } from "./user.js";

/*----------------------------- HELPER FUNCTIONS -----------------------------*/
export const companion = {
    /**
     * Adds functions for the emotional support creature.
     * 
     * @object dialog - Functions for the companion dialog box.
     * 
     * TODO: Have helper give reminders.
     * TODO: Have helper give advice.
     * TODO: Have helper remind the user to take breaks.
     * TODO: Add a button to minimize the companion.
     * TODO: Have the companion give the user a tutorial.
     */
    dialog: {
        /**
         * Controls the companion dialog box.
         * 
         * @function open - Open the dialog box.
         * @function say - Set the dialog content.
         * @function ask - Ask the user a yes/no question.
         * @function close - Close the dialog box. 
         */
        open (text) {
            /**
             * Open the companion dialog box when clicking the companion.
             * 
             * @param {string} text - The text to display in the dialog.
             */
            // Get the companion wrapper.
            const wrapper = document.getElementById("companion");

            // If the dialog is already open, close it.
            if (wrapper.querySelector(".dialog") || document.getElementById("dialog-open")) {
                companion.dialog.close();
                return;
            };

            // If debug mode is enabled, log the action.
            if (user.debug === true) {
                console.log("Opening dialog.");
            };

            // Add text content.
            const dialog = document.createElement("div");
            dialog.classList.add("dialog");
            dialog.id = "dialog-open";
            const dialogContent = document.createElement("p");
            if (text) {
                dialogContent.textContent = text;
            } else {
                dialogContent.textContent = "Hello! How can I help you today?";
                // TODO: Add options for the user to select.
            };
            dialog.appendChild(dialogContent);

            // Add a close button.
            const dialogClose = document.createElement("button");
            dialogClose.textContent = "Close";
            dialogClose.id = "dialog-close";
            dialogClose.ariaLabel = "Close the dialog.";
            dialogClose.title = "Close the dialog.";
            dialogClose.type = "button";
            dialog.appendChild(dialogClose).addEventListener("click", () => {
                companion.dialog.close("dialog-open");
            });

            // Add the dialog to the companion wrapper.
            wrapper.insertBefore(dialog, wrapper.firstChild);
        },
        greet () {
            /**
             * Greet the user based on the time of day.
             */
            // Get the companion wrapper.
            const wrapper = document.getElementById("companion");

            // Add text content.
            const dialog = document.createElement("div");
            dialog.classList.add("dialog");
            dialog.id = "dialog-greet";
            const dialogContent = document.createElement("p");

            // Check if the user has a name.
            let name = "";
            if (user.name !== "") {
                name = ` ${user.name}`;
            };

            // Get the current time.
            const time = new Date().getHours();
            if (time >= 3 && time < 5) {
                dialogContent.textContent = `Good morning${name}! You're up really early!`;
            } else if (time >= 5 && time < 8) {
                dialogContent.textContent = `Good morning${name}! Ready to start the day?`;
            } else if (time >= 8 && time < 10) {
                dialogContent.textContent = `Good morning${name}! Let's tackle your goals for today.`;
            } else if (time >= 10 && time < 12) {
                dialogContent.textContent = `Good morning${name}! How's your morning going so far?`;
            } else if (time >= 12 && time < 14) {
                dialogContent.textContent = `Good afternoon${name}! Have you had lunch yet?`;
            } else if (time >= 14 && time < 17) {
                dialogContent.textContent = `Good afternoon${name}! Let's keep the momentum going.`;
            } else if (time >= 17 && time < 19) {
                dialogContent.textContent = `Good evening${name}! Time to wind down?`;
            } else if (time >= 19 && time < 21) {
                dialogContent.textContent = `Good evening${name}! How was your day?`;
            } else if (time >= 21 && time < 23) {
                dialogContent.textContent = "It's getting late! Don't forget to relax.";
            } else {
                dialogContent.textContent = "You're up late! Is there anything I can help with?";
            };
            dialog.appendChild(dialogContent);

            // Add a close button.
            const dialogClose = document.createElement("button");
            dialogClose.textContent = "Close";
            dialogClose.id = "dialog-close";
            dialogClose.ariaLabel = "Close the dialog.";
            dialogClose.title = "Close the dialog.";
            dialogClose.type = "button";
            dialog.appendChild(dialogClose).addEventListener("click", () => {
                companion.dialog.close("dialog-greet");
            });

            // Add the dialog to the companion wrapper.
            wrapper.insertBefore(dialog, wrapper.firstChild);

            // Close the dialog after 5 seconds.
            setTimeout (() => {
                if (document.getElementById("dialog-greet")) {
                    companion.dialog.close("dialog-greet");
                };
            }, 5000); // 5 seconds = 5000 milliseconds.
        },
        say (text) {
            /**
             * Set companion dialog content.
             * 
             * @param {string} text - The text to display in the dialog.
             */
            // Get the companion wrapper.
            const wrapper = document.getElementById("companion");

            // Add text content.
            const dialog = document.createElement("div");
            dialog.classList.add("dialog");
            dialog.id = "dialog-say";
            const dialogContent = document.createElement("p");
            if (text) {
                dialogContent.textContent = text;
            } else {
                dialogContent.textContent = "Hello!";
            };
            dialog.appendChild(dialogContent);

            // Add a close button.
            const dialogClose = document.createElement("button");
            dialogClose.textContent = "Close";
            dialogClose.id = "dialog-close";
            dialogClose.ariaLabel = "Close the dialog.";
            dialogClose.title = "Close the dialog.";
            dialogClose.type = "button";
            dialog.appendChild(dialogClose).addEventListener("click", () => {
                companion.dialog.close("dialog-say");
            });

            // Add the dialog to the companion wrapper.
            wrapper.insertBefore(dialog, wrapper.firstChild);

            // Close the dialog after 10 seconds.
            setTimeout (() => {
                companion.dialog.close("dialog-say");
            }, 10000); // 10 seconds = 10000 milliseconds.
        },
        ask (question) {
            /**
             * Ask the user a yes/no question.
             * 
             * @param {string} question - The question to ask the user.
             */
            return new Promise((resolve) => {
                // Get the companion wrapper.
            const wrapper = document.getElementById("companion");

            // Add text content.
            const dialog = document.createElement("div");
            dialog.classList.add("dialog");
            dialog.id = "dialog-ask";
            const dialogContent = document.createElement("p");
            if (question) {
                dialogContent.textContent = question;
            } else {
                dialogContent.textContent = "Hmm... I had a question, but I forgot it.";
            };
            dialog.appendChild(dialogContent);

            // Add the response wrapper.
            const responseWrapper = document.createElement("div");
            responseWrapper.id = "response-wrapper";
            dialog.appendChild(responseWrapper);

            // Add a yes button.
            const dialogYes = document.createElement("button");
            dialogYes.textContent = "Yes";
            dialogYes.id = "dialog-yes";
            dialogYes.ariaLabel = "Yes";
            dialogYes.title = "Yes";
            dialogYes.type = "button";
            responseWrapper.appendChild(dialogYes).onclick = () => {
                resolve(true)
                document.getElementById("dialog-ask").remove();
            };

            // Add a no button.
            const dialogNo = document.createElement("button");
            dialogNo.textContent = "No";
            dialogNo.id = "dialog-no";
            dialogNo.ariaLabel = "No";
            dialogNo.title = "No";
            dialogNo.type = "button";
            responseWrapper.appendChild(dialogNo).onclick = () => {
                resolve(false)
                document.getElementById("dialog-ask").remove();
            };

            // Add the dialog to the companion wrapper.
            wrapper.insertBefore(dialog, wrapper.firstChild);
            });
        },
        close (id = null) {
            /**
             * Close the dialog box.
             * 
             * @param {string} id - The ID of the dialog to close.
             */
            const wrapper = document.getElementById("companion");
            if (document.getElementById(id) || wrapper.querySelector(".dialog")) {
                if (user.debug === true) {
                    console.log("[companion.dialog.close]: Closing dialog.");
                };

                // Remove the dialog, or the dialog with the specified ID.
                if (id) {
                    document.getElementById(id).remove();
                } else {
                    wrapper.querySelector(".dialog").remove();
                };
            };
        }
    }
};
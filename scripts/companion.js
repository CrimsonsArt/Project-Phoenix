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

            if (document.getElementById("dialog")) {
                // If the dialog is already open, close it.
                companion.dialog.close();
                return;
            };

            if (user.debug === true) {
                console.log("Opening dialog.");
            };

            // Add text content.
            const dialog = document.createElement("div");
            dialog.classList.add("dialog");
            dialog.id = "dialog";
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
            dialog.appendChild(dialogClose).addEventListener("click", companion.dialog.close);

            // Add the dialog to the companion wrapper.
            wrapper.insertBefore(dialog, wrapper.firstChild);
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
            dialog.id = "dialog";
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
            dialog.appendChild(dialogClose).addEventListener("click", companion.dialog.close);

            // Add the dialog to the companion wrapper.
            wrapper.insertBefore(dialog, wrapper.firstChild);

            // TODO: Add a timeout to close the dialog after a few seconds.

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
        close () {
            /**
             * Close the dialog box.
             */
            if (document.getElementById("dialog")) {
                if (user.debug === true) {
                    console.log("Closing dialog.");
                };
                document.getElementById("dialog").remove();
            };
        }
    }
};
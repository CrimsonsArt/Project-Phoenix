/*---------------------------------- IMPORT ----------------------------------*/

/*----------------------------- HELPER FUNCTIONS -----------------------------*/
export const companion = {
    /**
     * Adds functions for the emotional support creature.
     * 
     * @function summon - Summon the creature.
     * 
     * TODO: Have helper give reminders.
     * TODO: Have helper give advice.
     * TODO: Have helper tell the user to take breaks.
     * TODO: Praise the user for completing tasks.
     * TODO: Greet the user at the start of the day.
     * TODO: Remind the user to go to bed.
     */
    dialog: {
        open (text) {
            /**
             * Open the companion dialog box.
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

            // Add text content.
            console.log("Opening dialog.");
            const dialog = document.createElement("div");
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
             */
            // Get the companion wrapper.
            const wrapper = document.getElementById("companion");

            // Add text content.
            const dialog = document.createElement("div");
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

        },
        close () {
            /**
             * Close the dialog box.
             */
            if (document.getElementById("dialog")) {
                document.getElementById("dialog").remove();
            };
            console.log("Dialog closed.");
        }
    }
};
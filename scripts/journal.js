/*---------------------------------- IMPORT ----------------------------------*/
import { utils } from "./utils.js";

/*---------------------------- JOURNAL FUNCTIONS -----------------------------*/
export const journal = {
    /**
     * Journal data and functions.
     * 
     * @object render - Functions for rendering journal elements.
     * 
     * @returns {object} journal - The journal object.
     * 
     * TODO: Add a way to edit journal entries.
     * TODO: Let user customize journal entries through BBCode.
     */
    add() {
        /**
         * Add a new journal entry.
         */
        const journalEntry = {
            date: Date.now(),
            title: document.getElementById("journal-title").value,
            text: document.getElementById("journal-text").value,
            mood: document.getElementById("journal-mood").value
        };
    },
    render: {
        /**
         * Functions for rendering journal elements.
         * 
         * @object journalEntry - Functions for rendering journal entries.
         * @object cookbook - Functions for rendering the cookbook.
         * 
         * @returns {object} - The journal render object.
         */
        journalEntry: {
            /**
             * Functions for rendering journal entries.
             * 
             * @function form - Render the new journal entry form.
             * 
             * @returns {object} journalEntry - the journal entry render object.
             */
            form() {
                /**
                 * Renders the journal entry form.
                 */
                const wrapper = document.createElement("form");
                wrapper.id = "journal-entry-form";

                // Append the form to the journal section.
                document.getElementById("journal").appendChild(wrapper);
            }
        }
    }
};
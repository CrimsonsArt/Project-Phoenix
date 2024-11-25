/*---------------------------------- IMPORT ----------------------------------*/
import { utils } from "./utils.js";
import { user } from "./user.js";

/*--------------------------------- JOURNAL ----------------------------------*/
export const journal = {
    new () {
        /**
         * Creates a new journal entry.
         * 
         * @returns {object} journal - The new journal entry.
         */
        return {
            id: null,
            date: null,
            text: "",
            mood: ""
        }
    },
    add (edit) {
        /**
         * Create a new journal entry.
         */
        let entry = journal.new();
        const form = document.getElementById("journal-form");
        const text = document.getElementById("journal-text");
        const mood = document.getElementById("journal-mood");
        const date = document.getElementById("day-view").parentElement.dataset.date;

        entry.date = date;
        entry.text = text.value;
        entry.mood = mood.value;

        if (edit) {
            // Update the existing entry.
            const index = user.journals.findIndex(entry => entry.id === edit.id);
            if (index !== -1) {
                entry.id = user.journals[index].id;
                user.journals[index] = entry;
            }
        } else {
            // Create a new entry.
            entry.id = user.nextJournalId++;
            user.journals.push(entry);
        };
        user.save();

        // Re-render the journal.
        document.getElementById("journal").remove();
        journal.render(entry.date);
    },
    render (date) {
        /**
         * Renders a daily journal.
         * 
         * TODO: Improve the layout of the journal.
         * TODO: Click on an entry to edit it.
         */
        // Create the wrapper, and append it to the day view.
        const wrapper = document.createElement("div");
        wrapper.id = "journal";
        document.getElementById("day-view").appendChild(wrapper);

        // Create the title.
        const title = document.createElement("h4");
        title.textContent = "Journal";
        wrapper.appendChild(title);

        // Check for existing journal entries.
        //console.log(date);
        const entry = user.journals.find(entry => entry.date === date);
        if (entry) {
            // Create the journal entries.
            console.log("Journal entries found.");

            // Create the article container.
            const article = document.createElement("article");
            article.id = `journal-entry`;
            wrapper.appendChild(article);

            // Create the journal text.
            const text = document.createElement("p");
            text.textContent = entry.text;
            article.appendChild(text);

            // Create the journal mood.
            const mood = document.createElement("p");
            mood.textContent = entry.mood;
            article.appendChild(mood);

            // Create the edit button.
            const edit = document.createElement("button");
            edit.ariaLabel = "Edit the journal entry.";
            edit.title = "Edit the journal entry.";
            edit.textContent = "Edit";
            edit.id = "journal-edit";
            article.appendChild(edit).addEventListener("click", () => {
                document.getElementById("journal-entry").remove();
                journal.edit(entry);
            });

        } else {
            // No journal entries found.
            //console.log("No journal entries found, rendering the form.");
            journal.edit();
        }
    },
    edit (entry) {
        /**
         * Edit a journal entry.
         */
        const wrapper = document.getElementById("journal");

        // Create the form.
        const form = document.createElement("form");
        form.id = "journal-form";
        wrapper.appendChild(form);

        // Create the journal textarea label.
        const textareaLabel = document.createElement("label");
        textareaLabel.setAttribute("for", "journal-text");
        textareaLabel.textContent = "Journal entry:";
        //textareaLabel.classList.add("sr-only");
        form.appendChild(textareaLabel);

        // Create the journal textarea.
        const textarea = document.createElement("textarea");
        textarea.id = "journal-text";
        textarea.placeholder = "Today I...";
        textarea.rows = "5";
        textarea.autocomplete = "off";
        textarea.spellcheck = "true";
        textarea.required = "true";
        form.appendChild(textarea);

        // Create the mood select label.
        const selectLabel = document.createElement("label");
        selectLabel.setAttribute("for", "journal-mood");
        selectLabel.textContent = "Current mood:";
        //selectLabel.classList.add("sr-only");
        form.appendChild(selectLabel);

        // Create the mood select.
        const select = document.createElement("select");
        select.id = "journal-mood";
        //select.required = "true";
        const options = ["--- Select ---", "good", "neutral", "bad"];
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
            if (option === "--- Select ---") {
                opt.value = "";
                opt.selected = "true";
            };
        });
        form.appendChild(select);

        // If an ID is provided, populate the form.
        if (entry) {
            textarea.value = entry.text;
            select.value = entry.mood;
        };

        // Create the cancel button.
        const cancel = document.createElement("button");
        cancel.ariaLabel = "Cancel editing the journal entry.";
        cancel.title = "Cancel editing the journal entry.";
        cancel.textContent = "Cancel";
        cancel.id = "journal-cancel";
        form.appendChild(cancel).addEventListener("click", function() {
            document.getElementById("journal").remove();
            if (entry) {
                journal.render(entry.date);
            } else {
                journal.render();
            };
        });

        // Create the save button.
        const save = document.createElement("button");
        save.ariaLabel = "Save the journal entry.";
        save.title = "Save the journal entry.";
        save.textContent = "Save";
        save.id = "journal-save";
        save.type = "submit";
        form.appendChild(save);

        form.addEventListener("submit", function(event) {
            event.preventDefault();
            if (entry) {
                journal.add(entry);
            } else {
                journal.add();
            };
        });
    }
};
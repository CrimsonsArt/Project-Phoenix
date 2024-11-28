/*---------------------------------- IMPORT ----------------------------------*/
import { utils } from "./utils.js";
import { toast } from "./toast.js";
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
            mood: "",
            thoughts: "",
            physical: "",
            next: ""
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
        const thoughts = document.getElementById("journal-thoughts");
        const physical = document.getElementById("journal-physical");
        const next = document.getElementById("journal-next");
        const date = document.getElementById("day-view").parentElement.dataset.date;

        entry.date = date;
        entry.text = text.value;
        entry.mood = mood.value;
        entry.thoughts = thoughts.value;
        entry.physical = physical.value;
        entry.next = next.value;

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
        toast.add("Journal entry saved.", "success");

        // Re-render the journal.
        document.getElementById("journal").remove();
        journal.render(entry.date);
    },
    find (date) {
        /**
         * Find a journal entry by date.
         */
        if (date && user.journals.length > 0) {
            return user.journals.find(entry => entry.date === date);
        }
    },
    render (date) {
        /**
         * Renders a daily journal.
         * 
         * TODO: Improve the layout of the journal.
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
            if (user.debug === true) console.log("Journal entries found.");

            // Create the article container.
            const article = document.createElement("article");
            article.id = `journal-entry`;
            wrapper.appendChild(article);

            // Create the journal text.
            const text = document.createElement("p");
            text.textContent = entry.text;
            article.appendChild(text);

            if (entry.mood != "") {
                // Create the journal mood.
                const mood = document.createElement("p");
                mood.textContent = "Mood for the day: " + entry.mood;
                article.appendChild(mood);
            };

            if (entry.thoughts) {
                // Create the journal thoughts.
                const thoughts = document.createElement("p");
                thoughts.textContent = "Thoughts: " + entry.thoughts;
                article.appendChild(thoughts);
            };

            if (entry.physical) {
                // Create the journal physical feelings.
                const physical = document.createElement("p");
                physical.textContent = "Physical feelings: " + entry.physical;
                article.appendChild(physical);
            };

            if (entry.next) {
                // Create the journal next steps.
                const next = document.createElement("p");
                next.textContent = "Next steps: " + entry.next;
                article.appendChild
            };

            // Create the edit button.
            const edit = utils.button("edit", "Edit the journal entry", "pencil-square");
            edit.id = "journal-edit";
            article.appendChild(edit).addEventListener("click", () => {
                document.getElementById("journal-entry").remove();
                journal.edit(entry);
            });

        } else {
            // No journal entries found.
            if (user.debug === true) console.log("No journal entries found, rendering the form.");
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

        // Create the textarea fieldset.
        const textareaFieldset = document.createElement("fieldset");
        textareaFieldset.id = "journal-textarea";
        form.appendChild(textareaFieldset);

        // Create the textarea fieldset legend.
        const textareaLegend = document.createElement("legend");
        textareaLegend.textContent = "Journal entry";
        textareaFieldset.appendChild(textareaLegend);

        // Create the journal textarea label.
        const textareaLabel = document.createElement("label");
        textareaLabel.setAttribute("for", "journal-text");
        textareaLabel.textContent = "Journal entry:";
        //textareaLabel.classList.add("sr-only");

        // Create the journal textarea.
        const textarea = document.createElement("textarea");
        textarea.id = "journal-text";
        textarea.placeholder = "Today I...";
        textarea.rows = "5";
        textarea.autocomplete = "off";
        textarea.spellcheck = "true";
        textarea.required = "true";

        // Wrap the textarea label and input, and append it to the form.
        const textareaWrapper = utils.wrapInput(textareaLabel, textarea);
        textareaFieldset.appendChild(textareaWrapper);

        // Create the checkup fieldset.
        const checkInFieldset = document.createElement("fieldset");
        checkInFieldset.id = "journal-checkup";
        form.appendChild(checkInFieldset);

        // Create the checkup legend.
        const checkInLegend = document.createElement("legend");
        checkInLegend.textContent = "Feelings check in";
        checkInFieldset.appendChild(checkInLegend); 

        // Create the mood select label.
        const selectLabel = document.createElement("label");
        selectLabel.setAttribute("for", "journal-mood");
        selectLabel.textContent = "Current mood:";
        //selectLabel.classList.add("sr-only");

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

        // Wrap the mood select label and input, and append it to the form.
        const selectWrapper = utils.wrapInput(selectLabel, select);
        checkInFieldset.appendChild(selectWrapper);

        // Create the thoughts label.
        const thoughtsLabel = document.createElement("label");
        thoughtsLabel.setAttribute("for", "journal-thoughts");
        thoughtsLabel.textContent = "What's on your mind?";
        //thoughtsLabel.classList.add("sr-only");

        // Create the thoughts input.
        const thoughts = document.createElement("input");
        thoughts.id = "journal-thoughts";
        thoughts.type = "text";
        thoughts.placeholder = "What's on your mind?";
        thoughts.autocomplete = "off";
        thoughts.spellcheck = "true";

        // Wrap the thoughts label and input, and append it to the form.
        const thoughtsWrapper = utils.wrapInput(thoughtsLabel, thoughts);
        checkInFieldset.appendChild(thoughtsWrapper);

        // Create the physical feelings label.
        const physicalLabel = document.createElement("label");
        physicalLabel.setAttribute("for", "journal-physical");
        physicalLabel.textContent = "How do you feel physically?";
        //physicalLabel.classList.add("sr-only");

        // Create the physical feelings input.
        const physical = document.createElement("input");
        physical.id = "journal-physical";
        physical.type = "text";
        physical.placeholder = "How do you feel physically?";
        physical.autocomplete = "off";
        physical.spellcheck = "true";

        // Wrap the physical feelings label and input, and append it to the form.
        const physicalWrapper = utils.wrapInput(physicalLabel, physical);
        checkInFieldset.appendChild(physicalWrapper);

        // Create the next steps label.
        const nextLabel = document.createElement("label");
        nextLabel.setAttribute("for", "journal-next");
        nextLabel.textContent = "What do you want to do next?";
        //nextLabel.classList.add("sr-only");

        // Create the next steps input.
        const next = document.createElement("input");
        next.id = "journal-next";
        next.type = "text";
        next.placeholder = "What do you want to do next?";
        next.autocomplete = "off";
        next.spellcheck = "true";

        // Wrap the next steps label and input, and append it to the form.
        const nextWrapper = utils.wrapInput(nextLabel, next);
        checkInFieldset.appendChild(nextWrapper);



        // If an ID is provided, populate the form.
        if (entry) {
            textarea.value = entry.text;
            if (entry.mood === "") {
                select.value = "--- Select ---";
            } else {
                select.value = entry.mood;
            };

            if (entry.thoughts) {
                thoughts.value = entry.thoughts;
            };

            if (entry.physical) {
                physical.value = entry.physical;
            };

            if (entry.next) {
                next.value = entry.next;
            };
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
        //const save = document.createElement("button");
        const save = utils.button("save", "Save the journal entry", "floppy");
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
/*---------------------------------- IMPORT ----------------------------------*/

/*--------------------------------- JOURNAL ----------------------------------*/
export const journal = {
    render () {
        /**
         * Renders a daily journal.
         * 
         * TODO: Check for existing journal entries.
         * TODO: Render entries as articles.
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

        // Create the save button.
        const save = document.createElement("button");
        save.ariaLabel = "Save the journal entry.";
        save.title = "Save the journal entry.";
        save.textContent = "Save";
        save.id = "journal-save";
        save.type = "submit";
        form.appendChild(save);

        // TODO: Stop default form submit handler.

        console.log("Rendering the journal.");
    }
};
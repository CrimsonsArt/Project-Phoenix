/*---------------------------------- IMPORT ----------------------------------*/
import { companion } from "./companion.js";
import { toast } from "./toast.js";

/*-------------------------- USER DATA & FUNCTIONS ---------------------------*/
export const user = {
    /**
     * User data.
     * 
     * @param {string} name - The user's name.
     * @param {boolean} debug - Debug mode.
     * @param {array} events - The user's events.
     * @param {number} nextEventId - The next event ID.
     * @param {array} journals - The user's journal entries.
     * @param {number} nextJournalId - The next journal ID.
     * @param {array} tasks - The user's to-do list.
     * @param {object} focusTask - The user's current focus task.
     * @param {number} nextTaskId - The next task ID.
     * @param {array} pomodoros - The user's pomodoro log.
     * @param {number} nextPomId - The next pomodoro ID.
     * @param {array} toasts - The user's toast log.
     * @param {number} nextToastId - The next toast ID.
     * 
     * @function save - Save user object to local storage.
     * @function load - Load user object from local storage.
     * @function export - Export user data to a JSON file.
     * @function import - Import user data from a JSON file.
     * @function format - Format user data.
     * 
     * @returns {object} user - The user's data.
     */
    name: "",
    debug: false,
    events: [],
    nextEventId: 1,
    journals: [],
    nextJournalId: 1,
    tasks: [],
    focusTask: null,
    nextTaskId: 1,
    pomodoros: [],
    nextPomId: 1,
    toasts: [],
    nextToastId: 1,
    save () {
        /**
         * Save user data to local storage.
         */
        const userData = JSON.stringify(this);
        localStorage.setItem("user", userData);
        if (user.debug === true) {
            console.log("[user.save]: User data successfully saved to local storage.");
        };
    },
    load () {
        /**
         * Load user data from local storage.
         */
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            // Update user object with saved data.
            Object.assign(this, parsedUser);

            // Load the toasts.
            toast.load();

            // Log the message.
            if (user.debug === true) {
                console.log("[user.load]: User data successfully loaded from local storage.");
            };
        } else {
            if (user.debug === true) {
                console.log("[user.load]: No user data found in local storage.");
            };
        };
    },
    export () {
        /**
         * Export user data to a JSON file.
         */
        // Convert user object to a JSON string.
        const jsonString = JSON.stringify(user, null, 2)
        
        // Create a blob with the JSON data.
        const blob = new Blob([jsonString], {type: "application/json"});

        // Generate a URL for the blob.
        const url = URL.createObjectURL(blob);

        // Create a temporary link element.
        const tempLink = document.createElement("a");
        tempLink.href = url;
        tempLink.download = `Project-Phoenix-.json`;
        if (user.debug === true) {
            console.log("[user.export]: Exporting user data...");
        };

        // Toast success message.
        toast.add("Exported user-data successfully.", "success");

        // Click the link to download the file, and remove it from the DOM.
        tempLink.click();
        URL.revokeObjectURL(url);
    },
    import () {
        /**
         * Import user data from a JSON file.
         */
        const file = document.getElementById("import-file").files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // Update user object with imported data.
                    Object.assign(user, importedData);
                    if (user.debug === true) {
                        console.log("[user.import]: Imported user data successfully from file.");
                    };

                    // Save the imported data to local storage.
                    user.save();

                    // Clear the settings form.
                    document.getElementById("settings-form").reset();

                    // Pass reload information to session storage.
                    sessionStorage.setItem("reloading-import", "true");

                    // Re-render the page.
                    location.reload();

                } catch (error) {
                    // Show error toast.
                    toast.add("Failed to import user data. Please ensure it is a valid JSON file and try again. Please report this on GitHub if the issue persists.", "error");
                    return console.error("[user.import]: Failed to import user data. Please report this on GitHub if the issue persists.", error);
                };
            };
            // Read the file as text.
            reader.readAsText(file);
        };
    },
    async format () {
        /**
         * Delete user data from local storage.
         */
        console.warn("[tasks.delete]: User requested data formatting, asking for confirmation.");
        const confirmFormat = await companion.dialog.ask("Formatting the data will permanently remove your existing content. Are you sure you want to proceed?");
            if (!confirmFormat) {
                console.log("[tasks.delete]: User cancelled data formatting.");
                return; // If the user cancels, return.
            } else {
                console.warn("[tasks.delete]: User confirmed data formatting.");
            };

        // Clear the user arrays.
        user.name = "";
        user.events = [];
        user.tasks = [];
        user.pomodoros = [];
        user.toasts = [];

        // Reset ID's.
        user.nextEventId = 1;
        user.nextTaskId = 1;
        user.nextPomId = 1;
        user.nextToastId = 1;

        // Clear the local storage.
        localStorage.removeItem("user");

        // Pass reload information to session storage.
        sessionStorage.setItem("reloading-format", "true");

        // Reload the page.
        location.reload();
    },
    openSettings (state = null) {
        /**
         * Open the settings modal.
         */
        const settings = document.getElementById("settings");
        if (!settings) {
            toast.add("Settings element not found. Please report this on GitHub if the issue persists.", "error");
            return console.error("[user.openSettings]: Settings element not found. Please report this on GitHub if the issue persists.");
        };

        if (settings.style.display === "block" || state === "close") {
            if (user.debug === true) console.log("[user.openSettings]: Closing settings modal.");
            settings.style.display = "none";
            settings.classList.add("closed");
        } else {
            if (document.querySelector("#toast-list") && !document.querySelector("#toast-list").classList.contains("closed-menu")) {
                toast.toggle();
            };
            if (user.debug === true) console.log("[user.openSettings]: Opening settings modal.");
            settings.style.display = "block";
            settings.classList.remove("closed");
        };
    },
    debugMode () {
        /**
         * Toggle debug mode.
         */
        user.debug = !user.debug;
        if (user.debug === true) {
            console.log("[user.debug]: Debug mode enabled.");
        } else {
            console.log("[user.debug]: Debug mode disabled.");
        };
    }
};
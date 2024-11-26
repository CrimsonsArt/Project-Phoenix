/*---------------------------------- IMPORT ----------------------------------*/
import { utils } from "./utils.js";
import { toast } from "./toast.js";
import { calendar } from "./calendar.js";
import { pomodoro } from "./pomodoro.js";

/*-------------------------- USER DATA & FUNCTIONS ---------------------------*/
export const user = {
    /**
     * User data.
     * 
     * @param {string} name - The user's name.
     * @param {array} events - The user's events.
     * @param {array} tasks - The user's to-do list.
     * @param {array} pomodoros - The user's pomodoro log.
     * 
     * @function save - Save user object to local storage.
     * @function load - Load user object from local storage.
     * @function export - Export user data to a JSON file.
     * @function import - Import user data from a JSON file.
     * @function showEvents - See all of the user's events in the console.
     * @function showTasks - See all of the user's tasks in the console.
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
            // TODO: Start intro sequence.
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
        toast.add("Exported user data successfully.", "success");

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
                    toast.add("Failed to import user data. Please ensure it is a valid JSON file and try again. If the issue persists, please report this on GitHub.", "error");
                    return;
                };
            };
            // Read the file as text.
            reader.readAsText(file);
        };
    },
    format () {
        /**
         * Delete user data from local storage.
         * 
         * TODO: Add a confirmation prompt.
         */
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
    }
};
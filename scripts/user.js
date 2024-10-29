import { utils } from "./utils.js";
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
    events: [],
    nextEventId: 1,
    tasks: [],
    nextTaskId: 1,
    pomodoros: [],
    nextPomId: 1,
    toasts: [],
    nextToastId: 1,

    save: function() {
        /**
         * Save user data to local storage.
         */
        const userData = JSON.stringify(this);
        localStorage.setItem("user", userData);
        utils.log("User - save", "User data successfully saved to local storage.");
    },
    load: function() {
        /**
         * Load user data from local storage.
         */
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            // Update user object with saved data.
            Object.assign(this, parsedUser);
            utils.log("User - load", "User data successfully loaded from local storage.");
        } else {
            utils.log("User - load", "No user data found in local storage.");
        };
    },
    export: function() {
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
        tempLink.download = `Project-Phoenix-${calendar.timestamp()}.json`;

        // Click the link to download the file, and remove it from the DOM.
        tempLink.click();
        URL.revokeObjectURL(url);

        // Toast success message.
        // TODO: Make it so that the last toast is included.
        toast.add("Exported user data successfully.", "success");
    },
    import: function() {
        /**
         * Import user data from a JSON file.
         * 
         * BUG: Import is not working.
         */
        const file = document.getElementById("data-import").files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // Update user object with imported data.
                    Object.assign(user, importedData);
                    utils.log("User - import", "Imported user data successfully from file.");

                    // Save the imported data to local storage.
                    user.save();

                    // Show a success toast.
                    toast.add("Imported and saved user data successfully.", "success");

                    // Re-render the calendar and tasks.
                    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
                    tasks.renderTasks();
                } catch (error) {
                    // Show error toast.
                    toast.add("Failed to import user data. Please ensure it is a valid JSON file and try again.", "error");
                };
            };
            // Read the file as text.
            reader.readAsText(file);
        };
    },
    format: function() {
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

        // Reload the page.
        window.location.reload();

        // Toast success message and log the message.
        toast.add("Deleted user data successfully.", "success");
        utils.log("User - format", "Deleted user data successfully.");
    },
    showEvents: function() {
        /**
         * Show all of the user's events in the console.
         */
        utils.log("Console - showEvents", "Showing all of the user's events in the console...");
        this.events.forEach((event, index) => {
            utils.log(`Console - event ${index + 1}`, `${event.title}, Date: ${event.date}, Time: ${event.time}, Description: ${event.description}`);
        });
    },
    showTasks: function() {
        /**
         * Show all of the user's tasks in the console.
         */
        utils.log("Console - showTasks", "Showing all of the user's tasks in the console...");
        this.tasks.forEach((task) => {
            utils.log(`Console - task ${task.id}`, `${task.title} - ${task.completed ? "Complete" : "Incomplete"}`);
        });
    }
};
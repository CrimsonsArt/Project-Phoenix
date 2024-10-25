import { ui } from "./ui.js";
import { calendar } from "./calendar.js";

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
    pomLog: [],
    nextPomId: 1,

    save: function() {
        /**
         * Save user data to local storage.
         */
        const userData = JSON.stringify(this);
        localStorage.setItem("user", userData);
        ui.log("User - save", "User data successfully saved to local storage.");
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
            ui.log("User - load", "User data successfully loaded from local storage.");
        } else {
            ui.log("User - load", "No user data found in local storage.");
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
        ui.toast("User data exported successfully.", "success");
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
                    ui.log("User - import", "User data successfully imported from file.");

                    // Save the imported data to local storage.
                    user.save();

                    // Show a success toast.
                    ui.toast("User data imported and saved successfully.", "success");

                    // Re-render the calendar and tasks.
                    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
                    tasks.renderTasks();
                } catch (error) {
                    // Show error toast.
                    ui.toast("Failed to import user data. Please ensure it is a valid JSON file and try again.", "error");
                };
            };
            // Read the file as text.
            reader.readAsText(file);
        };
    },
    format: function() {
        /**
         * Delete user data from local storage.
         */
        // Clear the user arrays.
        this.name = "";
        this.events = [];
        this.tasks = [];
        this.pomodoros = [];

        // Reset ID's.
        this.nextEventId = 1;
        this.nextTaskId = 1;

        // Clear the local storage.
        localStorage.removeItem("user");

        // Reload the page.
        window.location.reload();

        // Toast success message and log the message.
        ui.toast("User data deleted successfully.", "success");
        ui.log("User - format", "User data successfully deleted.");
    },
    showEvents: function() {
        /**
         * Show all of the user's events in the console.
         */
        ui.log("Console - showEvents", "Showing all of the user's events in the console...");
        this.events.forEach((event, index) => {
            ui.log(`Console - event ${index + 1}`, `${event.title}, Date: ${event.date}, Time: ${event.time}, Description: ${event.description}`);
        });
    },
    showTasks: function() {
        /**
         * Show all of the user's tasks in the console.
         */
        ui.log("Console - showTasks", "Showing all of the user's tasks in the console...");
        this.tasks.forEach((task) => {
            ui.log(`Console - task ${task.id}`, `${task.title} - ${task.completed ? "Complete" : "Incomplete"}`);
        });
    }
};
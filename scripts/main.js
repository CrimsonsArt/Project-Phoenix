/*---------------------------------- IMPORT ----------------------------------*/
import { user } from "./user.js";
import { utils } from "./utils.js";
import { toast } from "./toast.js";
import { tasks } from "./tasks.js";
import { journal } from "./journal.js";
import { calendar } from "./calendar.js";
import { pomodoro } from "./pomodoro.js";

// TODO: Add a cheat for setting the current date.
// TODO: Add settings for the user.
// TODO: Add github-like activity display for statistics.

/*---------------------------------- ONLOAD ----------------------------------*/
window.onload = function() {
    /**
     * Onload function that runs when the page is loaded.
     */
    /*---------------------------- INITIALIZATION ----------------------------*/
    /*// Load testing cheats.
    window.pomodoro = pomodoro;
    window.user = user;
    window.toast = toast;*/

    // Load user data from local storage.
    user.load();
    //user.debug = true; // Enable debug mode.
    user.debug = false; // Disable debug mode.


    /* --------------------------- USER INTERFACE ----------------------------*/
    // Add event listener for the sidebar menu toggle button.
    const menuToggle = document.getElementById("menu-toggle");
    menuToggle.addEventListener("click", toast.toggle);

    // Load toast messages from local storage.
    toast.load();

    // Update the toast timestamps once every minute.
    setInterval(toast.updateTimestamps, 60000);


    /*------------------------------- CALENDAR -------------------------------*/
    // Render the calendar, and initialize its events.
    const today = new Date();
    calendar.render.table();
    // CONSIDER: [ALT + SHIFT] to go to the next day with an event.
    // CONSIDER: [LEFT ARROW | A] to go to the previous month.
    // CONSIDER: [RIGHT ARROW | D] to go to the next month.


    /*-------------------------------- TASKS ---------------------------------*/
    // Load the tasks from local storage.
    tasks.load();
    tasks.render.list();

    // Add event listener for the add task button.
    const taskButton = document.getElementById("add-task");
    if (taskButton) {
        taskButton.addEventListener("click", tasks.add);
    };

    // Add event listener for pressing enter in the task input, to add the task.
    const taskInput = document.getElementById("todo-task");
    taskInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form from submitting.
            tasks.add(); // Add the task.
        };
    });


    /*------------------------------- POMODORO -------------------------------*/
    // Add event listeners for the start and stop pomodoro buttons.
    const pomActions = {
        "pom-start": pomodoro.start,
        "pom-stop": pomodoro.reset
    };
    Object.keys(pomActions).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", pomActions[buttonId]);
        };
    });


    /*------------------------------- SETTINGS -------------------------------*/
    // Add event listeners for the settings buttons.
    const settingsActions = {
        "data-import": user.import,
        "data-export": user.export,
        "data-delete": user.format
    };
    Object.keys(settingsActions).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", settingsActions[buttonId]);
        };
    });

    // Finished loading.
};
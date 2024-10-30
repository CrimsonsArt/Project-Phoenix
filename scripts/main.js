/*---------------------------------- IMPORT ----------------------------------*/
import { utils } from "./utils.js";
import { user } from "./user.js";
import { toast } from "./toast.js";
import { calendar } from "./calendar.js";
import { journal } from "./journal.js";
import { tasks } from "./tasks.js";
import { pomodoro } from "./pomodoro.js";


/*---------------------------------- ONLOAD ----------------------------------*/
window.onload = function() {
    /**
     * Onload function that runs when the page is loaded.
     */
    /*---------------------------- INITIALIZATION ----------------------------*/
    // Load testing cheats.
    window.pomodoro = pomodoro;
    window.user = user;
    window.toast = toast;

    // Load user data from local storage.
    user.load();


    /* --------------------------- USER INTERFACE ----------------------------*/
    // Load toast messages from local storage.
    toast.load();

    // Add event listener for the toast menu toggle button.
    const logToggle = document.getElementById("log-toggle");
    logToggle.addEventListener("click", toast.toggleLog);

    // Update the toast timestamps once every minute.
    setInterval(toast.updateTimestamps, 60000);

    // Testing area.
    /*utils.toast("This is a test warning message.", "warning");
    utils.toast("This is a test error message.", "error");
    utils.toast("This is a test success message.", "success");
    utils.toast("Welcome back!"); */


    /*------------------------------- CALENDAR -------------------------------*/
    /*
    // Render the calendar, and initialize its events.
    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
    let calPrev = document.getElementById("cal-prev");
    let calNext = document.getElementById("cal-next");
    calPrev.addEventListener("click", calendar.previous);
    calNext.addEventListener("click", calendar.next);
    */
    const today = new Date();
    calendar.render.fullCalendar(today.getFullYear(), today.getMonth());


    /*-------------------------------- TASKS ---------------------------------*/
    // Load the tasks from local storage.
    tasks.load();

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
        }
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
        }
    });
};
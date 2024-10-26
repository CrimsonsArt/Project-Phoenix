/*---------------------------------- IMPORT ----------------------------------*/
import { user } from "./user.js";
import { ui } from "./ui.js";
// import { calendar } from "./calendar.js";
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

    // Load user data from local storage.
    user.load();


    /* --------------------------------- UI ----------------------------------*/
    // Add event listener for the toast menu toggle button.
    const toastToggle = document.getElementById("log-toggle");
    toastToggle.addEventListener("click", ui.toggleToastLog);

    // Testing area.
    ui.toast("Welcome back!");
    ui.toast("This is a test warning message.", "warning");
    ui.toast("This is a test error message.", "error");
    ui.toast("This is a test success message.", "success");


    /*------------------------------- CALENDAR -------------------------------*/
    /*
    // Render the calendar, and initialize its events.
    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
    let calPrev = document.getElementById("cal-prev");
    let calNext = document.getElementById("cal-next");
    calPrev.addEventListener("click", calendar.previous);
    calNext.addEventListener("click", calendar.next);
    */


    /*-------------------------------- TASKS ---------------------------------*/
    /*// Add event listeners for the add task button.
    const addTaskButton = document.getElementById("add-task");
    addTaskButton.addEventListener("click", tasks.addTask);

    // Render the tasks.
    tasks.renderTasks();*/


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
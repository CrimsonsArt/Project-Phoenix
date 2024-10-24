import { user } from "./user.js";
import { ui } from "./ui.js";
// import { calendar } from "./calendar.js";
// import { tasks } from "./tasks.js";
import { pomodoro } from "./pomodoro.js";

/*---------------------------------- ONLOAD ----------------------------------*/
window.onload = function() {
    /**
     * Onload function that runs when the page is loaded.
     */
    // Load user data from local storage.
    user.load();

    /*// Add event listeners for the start and stop pomodoro buttons.
    document.getElementById('pom-start').addEventListener('click', () => {
        pomodoro.start();
    });
    document.getElementById('pom-stop').addEventListener('click', () => {
        pomodoro.reset();
    });*/
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

    /*
    // Render the calendar, and initialize its events.
    calendar.renderCalendar(calendar.thisMonth, calendar.thisYear);
    let calPrev = document.getElementById("cal-prev");
    let calNext = document.getElementById("cal-next");
    calPrev.addEventListener("click", calendar.previous);
    calNext.addEventListener("click", calendar.next);

    // Render the tasks.
    tasks.renderTasks();

    */

    // Testing area
    ui.toast("Welcome back!");
};
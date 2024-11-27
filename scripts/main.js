/*---------------------------------- IMPORT ----------------------------------*/
import { user } from "./user.js";
import { utils } from "./utils.js";
import { toast } from "./toast.js";
import { tasks } from "./tasks.js";
import { journal } from "./journal.js";
import { calendar } from "./calendar.js";
import { pomodoro } from "./pomodoro.js";
import { companion } from "./companion.js";

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
    user.debug = true;

    if (user.debug === true) {
        console.log("[onload]: Loading...");
    }

    const reloading = sessionStorage.getItem("reloading-import");
    if (reloading) {
        sessionStorage.removeItem("reloading-import");

        // Show a success toast.
        toast.add("Imported and saved user data successfully.", "success");
        if (user.debug === true) {
            console.log("[onload]: User data imported and saved successfully.");
        };
    } else {
        if (user.debug === true) {
            console.log("[onLoad]: No user data imported.");
        };
    };

    const resetting = sessionStorage.getItem("reloading-format");
    if (resetting) {
        sessionStorage.removeItem("reloading-format");

        // Show a success toast.
        toast.add("Deleted user data successfully.", "success");
        if (user.debug === true) {
            console.log("[onload]: User data deleted successfully.");
        };
    };


    /* --------------------------- USER INTERFACE ----------------------------*/
    // Add event listener for the sidebar menu toggle button.
    const menuToggle = document.getElementById("menu-toggle");
    menuToggle.addEventListener("click", toast.toggle);

    // Update the toast timestamps once every minute.
    setInterval(toast.updateTimestamps, 60000);


    /*------------------------------ COMPANION -------------------------------*/
    // Add event listener for the companion.
    const companionSVG = document.getElementById("companion-svg");
    companionSVG.addEventListener("click", () => {
        companion.dialog.open();
    });

    // Add event listener to stop the companion from covering the footer.
    document.addEventListener("scroll", () => {
        const footer = document.querySelector("footer");
        const companion = document.getElementById("companion");

        // Get the bounding rectangle for the footer.
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the footer is visible in the viewport.
        if (footerRect.top < windowHeight) {
            // Footer is visible, so position the companion above the footer.
            companion.style.position = "fixed";
            companion.style.bottom = `${windowHeight - footerRect.top}px`;
        } else {
            // Footer is not visible; reset the companion to fixed position.
            companion.style.position = "fixed";
            companion.style.bottom = "0";
        }
    });

    // TODO: Check if the user is new or not, and add a welcome message for new users.
    // TODO: Add same hover effect for the companion as the toasts.

    // Check the time of day and greet the user accordingly.
    const time = new Date().getHours();
    if (time >= 5 && time < 12) {
        companion.dialog.open("Good morning!");
    } else if (time >= 12 && time < 17) {
        companion.dialog.open("Good afternoon!");
    } else if (time >= 17 && time < 21) {
        companion.dialog.open("Good evening!");
    } else {
        companion.dialog.open("You're up late! Is there anything I can help with?");
    };

    // Close the dialog after 5 seconds.
    setTimeout (() => {
        companion.dialog.close();
    }, 5000); // 5 seconds = 5000 milliseconds.


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
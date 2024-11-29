/*---------------------------------- IMPORT ----------------------------------*/
import { user } from "./user.js"; // File is clean and ready for use.
import { utils } from "./utils.js"; // File is clean and ready for use.
import { toast } from "./toast.js";
import { tasks } from "./tasks.js";
import { events } from "./events.js"; // File is clean and ready for use.
import { journal } from "./journal.js";
import { calendar } from "./calendar.js"; // File is clean and ready for use.
import { pomodoro } from "./pomodoro.js"; // File is clean and ready for use.
import { companion } from "./companion.js";

// TODO: Add a cheat for setting the current date.
// TODO: Add settings for the user.

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

    // TODO: If the toast log is open, move the companion to the left of it.

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
    companion.dialog.greet();

    /*------------------------------- CALENDAR -------------------------------*/
    // Render the calendar, and initialize its events.
    const today = new Date();
    calendar.render.table();

    /*-------------------------------- TASKS ---------------------------------*/
    // Load the tasks from local storage.
    tasks.render.list();

    // Add event listener for the add task button.
    const taskButton = document.getElementById("add-task");
    if (taskButton) {
        taskButton.addEventListener("click", tasks.add);
    };

    // Add event listener for the add dependency button.
    const dependencyButton = document.getElementById("add-hierarchy");
    if (dependencyButton) {
        dependencyButton.addEventListener("click", () => tasks.hierarchy.add());
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
};
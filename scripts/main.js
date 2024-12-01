/*---------------------------------- IMPORT ----------------------------------*/
import { user } from "./user.js";
import { utils } from "./utils.js";
import { toast } from "./toast.js";
import { tasks } from "./tasks.js";
import { events } from "./events.js";
import { journal } from "./journal.js";
import { calendar } from "./calendar.js";
import { pomodoro } from "./pomodoro.js";
import { companion } from "./companion.js";

// TODO: Add a cheat for setting the current date.

/*---------------------------------- ONLOAD ----------------------------------*/
window.onload = function() {
    /**
     * Onload function that runs when the page is loaded.
     */
    /*---------------------------- INITIALIZATION ----------------------------*/
    // Load testing cheats.
    window.pomodoro = pomodoro;
    window.toast = toast;
    window.user = user;

    // Ensure that debug mode is disabled by default.
    if (user.debug) {
        user.debug = false;
    };

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

    // Add event listener for the settings button.
    const settingsButton = document.getElementById("settings-toggle");
    settingsButton.addEventListener("click", user.openSettings);

    // Update the toast timestamps once every minute.
    setInterval(toast.updateTimestamps, 60000);

    /*------------------------------ COMPANION -------------------------------*/
    // Add event listener for the companion.
    const companionWrapper = document.getElementById("companion");
    const companionSVG = document.getElementById("companion-svg");
    companionSVG.addEventListener("click", () => {
        companion.dialog.open();
    });

    // Add event listener to stop the companion from covering the footer.
    document.addEventListener("scroll", () => {
        const footer = document.querySelector("footer");

        // Get the bounding rectangle for the footer.
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Footer is visible, so position the companion above the footer.
        if (footerRect.top < windowHeight) {
            companionWrapper.style.bottom = `${windowHeight - footerRect.top}px`;

        // Footer is not visible; reset the companion to fixed position.
        } else {
            companionWrapper.style.bottom = "0";
        };
    });

    // TODO: Check if the user is new or not, and have the companion give a brief tutorial.

    // Check the time of day and greet the user accordingly.
    companion.dialog.greet();

    /*------------------------------- CALENDAR -------------------------------*/
    // Render the calendar, and initialize its events.
    const today = new Date();
    calendar.render.table();

    // Helper function to update the day headings.
    function updateDayHeadings() {
        const headings = document.querySelectorAll(".day-header"); // Replace with your actual class or selector for day headings
        const isSmallScreen = window.matchMedia("(max-width: 800px)").matches;
        
        const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
        headings.forEach((heading, index) => {
            if (isSmallScreen) {
                if (heading.classList.contains("expanded-column")) {
                    heading.textContent = fullDays[index];
                } else {
                    heading.textContent = shortDays[index];
                }
            } else {
                heading.textContent = fullDays[index];
            };
        });
    };

    // Initial check on page load
    updateDayHeadings();

    // Listen for changes in screen size
    window.addEventListener("resize", updateDayHeadings);

    /*-------------------------------- TASKS ---------------------------------*/
    // Load the tasks from local storage.
    tasks.render.list();

    // Add event listener for the add task button.
    const taskButton = document.getElementById("add-task");
    if (taskButton) {
        taskButton.addEventListener("click", () => {
            tasks.add();
        });
    };

    // Add event listener for the add dependency button.
    const dependencyButton = document.getElementById("add-hierarchy");
    if (dependencyButton) {
        dependencyButton.addEventListener("click", () => tasks.hierarchy.add());
    };

    // Stop the default form submission and add the task.
    const form = document.getElementById("task-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from submitting.
        tasks.add(); // Add the task.
        document.getElementById("todo-task").value = "";
    });

    // Add event listener for pressing enter in the task input, to add the task.
    const taskInput = document.getElementById("todo-task");
    taskInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form from submitting.
            tasks.add(); // Add the task.
            document.getElementById("todo-task").value = "";
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
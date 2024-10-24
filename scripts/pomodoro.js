import { ui } from "./ui.js";
import { user } from "./user.js";

/*---------------------------- POMODORO FUNCTIONS ----------------------------*/
export const pomodoro = {
    /**
     * Controls the pomodoro timer.
     * 
     * @function updateButton - Toggles the text and icon for the pomodoro timer button.
     * @function start - Starts the pomodoro timer.
     * @function update - Updates the pomodoro timer display.
     * @function reset - Resets the pomodoro timer.
     * 
     * TODO: Let user select pomodoro length (15 or 25).
     * CONSIDER: Darken the rest of the screen when timer is active.
     */
    timer: null,
    minutes: 15,
    seconds: 0,
    defaultMinutes: 15,
    isActive: false,
    isPaused: false,
    isBreak: false,
    rounds: 0,

    start() {
        /**
         * Starts the pomodoro timer.
         */
        // If not active, start.
        if (!pomodoro.isActive) {
            pomodoro.isActive = true;
            pomodoro.isBreak = false;
            pomodoro.timer = setInterval(() => pomodoro.update(), 1000);
            updateButton("pause");
            ui.log("Pomodoro", "Starting timer...");

        // Else, act as resume.
        } else if (pomodoro.isPaused) {
            pomodoro.isPaused = false;
            updateButton("pause");
            ui.log("Pomodoro", "Resuming timer.");

        // Else, act as pause.
        } else {
            pomodoro.isPaused = true;
            updateButton("resume");
            ui.log("Pomodoro", "Pausing timer.");
        };
    },
    startBreak() {
        /**
         * Starts a 5 minute break.
         */
        if (!pomodoro.isBreak) {
            let pomMessage = document.getElementById("pom-message");

            pomodoro.isBreak = true;
            pomodoro.minutes = 5; // TODO: Make this a variable.
            pomodoro.seconds = 0;
            pomodoro.defaultMinutes = 5;
            pomodoro.timer = setInterval(() => pomodoro.update(), 1000);
            updateButton("pause");
            if (pomMessage) {
                pomMessage.textContent = "5 minute break";
            };
            ui.log("Pomodoro", "Starting break...");
        };
    },
    advance() {
        /**
         * Lets the user choose to continue or end the pomodoro. By choosing to
         * continue, it tracks how many pomodoros have been completed, and makes
         * the user take a longer break after 4 pomodoros. By choosing to end
         * the pomodoro, it saves the pomodoro stats to the user.
         */
        // TODO: Allow user to mark pomodoro as complete, or continue.
        // TODO: After 4 pomodoros, let the user choose break length (5-30).

        // Prompt user to continue or end the pomodoro.
        // TODO: Use HTML for this.
        const continuePomodoro = confirm("Do you want to continue with another pomodoro round?");

        if (continuePomodoro) {
            // TODO: Track loops.
            pomodoro.isPaused = false;
            pomodoro.minutes = 15;
            pomodoro.seconds = 0;
            pomodoro.defaultMinutes = 15;
            pomodoro.start();
            ui.log("Pomodoro", "Continuing...");
        } else {
            pomodoro.finishSession();
            ui.log("Pomodoro", "Finishing up...");
        };
    },
    finishSession() {
        /**
         * Finishes the pomodoro session.
         * TODO: Save pomodoro stats to user.
         */
        // TODO: Track break time.
        let totalTime = pomodoro.minutes * pomodoro.rounds;

        const pomLog = {
            id: user.nextPomId,
            date: new Date().toISOString(),
            minutes: totalTime,
            rounds: pomodoro.rounds
        };

        user.pomLog.push(pomLog);
        user.nextPomId++;
        user.save();
        pomodoro.reset();
    },
    reset() {
        /**
         * Resets the pomodoro timer.
         */
        if (!pomodoro.isActive) {
            ui.log("Pomodoro", "No timer is currently active.");
        } else {
            clearInterval(pomodoro.timer);
            pomodoro.timer = null;
            pomodoro.minutes = 15;
            pomodoro.seconds = 0;
            pomodoro.defaultMinutes = 15;
            pomodoro.isActive = false;
            pomodoro.isPaused = false;
            pomodoro.isBreak = false;
            pomodoro.rounds = 0;
            pomodoro.updateUI();
            updateButton("play");

            ui.log("Pomodoro", "Resetting timer.");
        };
    },
    update: () => {
        /**
         * Updates the pomodoro timer display.
         */
        if (!pomodoro.isPaused) {
            if (pomodoro.seconds === 0 && pomodoro.minutes === 0) {
                clearInterval(pomodoro.timer);
                pomodoro.isActive = false;
                ui.log("Pomodoro", "Timer has ended.");
                if (!pomodoro.isBreak) {
                    // Start a 5 minute break.
                    pomodoro.startBreak();
                } else {
                    // End the break.
                    ui.log("Pomodoro", "Break over.");
                    pomodoro.advance();
                };
            } else if (pomodoro.seconds > 0) {
                pomodoro.seconds--;
            } else /*if (pomodoro.minutes === 0)*/ {
                pomodoro.seconds = 59;
                pomodoro.minutes--;
            };
            // Update the UI after each second.
            pomodoro.updateUI();
        };
    },
    updateUI() {
        const timerDisplay = document.getElementById("pom-time");
        const timerCircle = document.getElementById("pom-circle");

        // Update the pomodoro timer display.
        if (timerDisplay) {
            timerDisplay.textContent = `${String(pomodoro.minutes).padStart(2, "0")}:${String(pomodoro.seconds).padStart(2, "0")}`;
        };

        // Calculate the percentage of time left and update the stroke.
        const totalSeconds = pomodoro.minutes * 60 + pomodoro.seconds;
        const totalPomodoroSeconds = pomodoro.defaultMinutes * 60;
        const percentLeft = totalSeconds / totalPomodoroSeconds;

        // Calculate the new stroke-dashoffset value.
        const circleLength = 2 * Math.PI * 90;
        const circleOffset = circleLength * (1 - percentLeft);

        // Update the stroke-dashoffset value to animate the circle.
        if (timerCircle) {
            timerCircle.style.strokeDashoffset = circleOffset;
        };
    }
};


/*---------------------------- POMODORO UTILITIES ----------------------------*/
function updateButton(state = "play") {
    /**
     * Toggles the text and icon for the pomodoro timer button.
     * 
     * @param {string} state - The state of the pomodoro timer.
     * @param {string} state - "play" | "pause" | "resume"
     */
    let button = document.getElementById("pom-start");
    let buttonIcon = document.getElementById("pomodoro-activity-icon");
    let pomMessage = document.getElementById("pom-message");

    // Toggle the button text and icon.
    button.title = `${state === "play" ? "Start" : `${state}`} timer`;
    button.ariaLabel = `${state === "play" ? "Start" : `${state}`} timer`;
    buttonIcon.className = "bi";
    buttonIcon.classList.add(`bi-${state === "resume" ? "play" : state}-fill`);

    // Toggle the pomodoro message.
    if (state === "play") {
        pomMessage.textContent = "Timer stopped.";

        // Hide the message after 10 seconds.
        setTimeout(() => {
            pomMessage.textContent = "";
        }, 10000);
    } else if (state === "pause") {
        pomMessage.textContent = "Time to focus.";
    } else if (state === "resume") {
        pomMessage.textContent = "Paused";
    } else {
        pomMessage.textContent = "";
    };
};
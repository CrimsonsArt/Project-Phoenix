import { companion } from "./companion.js";
import { user } from "./user.js";

/*---------------------------- POMODORO FUNCTIONS ----------------------------*/
export const pomodoro = {
    /**
     * Controls the pomodoro timer.
     * 
     * @function start      - Starts the pomodoro timer.
     * @function startBreak - Starts a 5 minute break.
     * @function advance    - Advances the pomodoro timer.
     * @function endSession - Ends the pomodoro session and saves to the user.
     * @function reset      - Resets the pomodoro timer.
     * @function update     - Updates the pomodoro timer display.
     * @function updateUI   - Updates the pomodoro timer UI.
     * @function cheat      - Skips to the end of the pomodoro timer.
     */
    timer: null,
    minutes: 25,
    seconds: 0,
    timerLength: 25,
    defaultPomLength: 25,
    isActive: false,
    isPaused: false,
    isBreak: false,
    breakLength: 5,
    rounds: 0,
    timeSpent: {
        focusTime: 0,
        breakTime: 0
    },
    start () {
        /**
         * Starts the pomodoro timer.
         */
        // If not active, start.
        if (!pomodoro.isActive) {
            pomodoro.isActive = true;
            pomodoro.isBreak = false;
            pomodoro.timer = setInterval(() => pomodoro.update(), 1000);
            updateButton("pause");
            if (user.debug === true) {
                console.log("[pomodoro.start]: Starting timer.");
            };
            companion.dialog.open("Time to focus! Good luck!");

        // Else, act as resume.
        } else if (pomodoro.isPaused) {
            pomodoro.isPaused = false;
            updateButton("pause");
            if (user.debug === true) {
                console.log("[pomodoro.start]: Resuming timer.");
            };
            companion.dialog.open("Resuming the pomodoro timer, let's get back to work!");

        // Else, act as pause.
        } else {
            pomodoro.isPaused = true;
            updateButton("resume");
            if (user.debug === true) {
                console.log("[pomodoro.start]: Pausing timer.");
            };
            companion.dialog.open("Pausing the pomodoro timer, I'll be here when you're ready!");
        };
    },
    startBreak (duration = 5) {
        /**
         * Starts a 5 minute break.
         */
        if (!pomodoro.isBreak) {
            let pomMessage = document.getElementById("pom-message");

            pomodoro.isBreak = true;
            pomodoro.minutes = duration;
            pomodoro.seconds = 0;
            pomodoro.timerLength = duration;
            pomodoro.breakLength = duration;
            pomodoro.timer = setInterval(() => pomodoro.update(), 1000);
            updateButton("pause");
            if (pomMessage) {
                pomMessage.textContent = `${duration} minute break`;
            };
            if (user.debug === true) {
                console.log("[pomodoro.startBreak]: Starting break.");
            };
            companion.dialog.open("Time for a break! Stretch your legs and relax.");
        };
    },
    async advance () {
        /**
         * Lets the user choose to continue or end the pomodoro. By choosing to
         * continue, it tracks how many pomodoros have been completed, and makes
         * the user take a longer break after 4 pomodoros. By choosing to end
         * the pomodoro, it saves the pomodoro stats to the user.
         */
        // Track how many loops the user has done.
        pomodoro.rounds++;

        // Prompt user to continue or end the pomodoro.
        const continuePomodoro = await companion.dialog.ask("Do you want to continue with another pomodoro round?");

        // User decides if they want to continue or stop.
        if (continuePomodoro) {
            pomodoro.isActive = false;
            pomodoro.isPaused = false;
            pomodoro.minutes = pomodoro.defaultPomLength;
            pomodoro.seconds = 0;
            pomodoro.timerLength = pomodoro.defaultPomLength;
            if (user.debug === true) {
                console.log("[pomodoro.advance]: " + `Starting round ${pomodoro.rounds + 1}`);
            };
            pomodoro.start();
            companion.dialog.open("Starting another pomodoro round! Good luck!");
        } else {
            if (user.debug === true) {
                console.log("[pomodoro.advance]: Ending pomodoro session.");
            };
            pomodoro.endSession();
        };
    },
    endSession (caller = "system") {
        /**
         * Finishes the pomodoro session.
         * 
         * @param {string} caller - The caller of the function.
         */
        const pomLog = {
            id: user.nextPomId,
            date: new Date().toISOString(),
            focusMinutes: pomodoro.timeSpent.focusTime,
            focusSeconds: 0,
            breakMinutes: pomodoro.timeSpent.breakTime,
            breakSeconds: 0,
            totalTime: pomodoro.timeSpent.focusTime + pomodoro.timeSpent.breakTime,
            rounds: pomodoro.rounds,
            complete: true
        };

        // Log seconds spent.
        if (pomodoro.isBreak) {
            pomLog.breakSeconds = pomodoro.seconds;
        } else {
            pomLog.focusSeconds = pomodoro.seconds;
        };

        // Save the pomodoro stats to the user.
        user.pomodoros.push(pomLog);
        user.nextPomId++;
        user.save();

        if (caller === "system") {
            // End session normally.
            if (user.debug === true) {
                console.log("[pomodoro.endSession]: " + `${caller} is ending the pomodoro session.`);
            };
            pomodoro.reset("system");
            companion.dialog.open("Good job on completing the pomodoro session!");
        };

        // Reset the pomodoro timer.
        if (user.debug === true) {
            console.log("[pomodoro.endSession]: " + `Ending ${pomLog.totalTime} minute pomodoro session.`);
        };
    },
    async reset (caller = "user") {
        /**
         * Resets the pomodoro timer.
         * 
         * @param {string} caller - The caller of the function.
         */
        // If the caller is an event, set the caller to the user.
        if (caller instanceof Event) {
            caller = "user";
        };
        if (!pomodoro.isActive) {
            if (user.debug === true) {
                console.log("[pomodoro.reset]: No timer is currently active");
            };
        } else {
            // If the requester is the user, confirm that they want to reset.
            if (caller === "user") {
                const confirmReset = await companion.dialog.ask("Are you sure you want to reset the pomodoro timer?");
                if (confirmReset) {
                    // If so, end the session early.
                    if (user.debug === true) {
                        console.log("[pomodoro.reset]: " + `${caller} confirmed reset.`);
                    };
                    pomodoro.endSession("user");
                } else {
                    // If not, cancel the reset.
                    if (user.debug === true) {
                        console.log("[pomodoro.reset]: " + `${caller} canceled reset.`);
                    };
                    return;
                };
            };
            // Reset the pomodoro timer.
            if (user.debug === true) {
                console.log("[pomodoro.reset]: Resetting timer.");
            };
            clearInterval(pomodoro.timer);
            pomodoro.timer = null;
            pomodoro.minutes = pomodoro.defaultPomLength;
            pomodoro.seconds = 0;
            pomodoro.timerLength = pomodoro.defaultPomLength;
            pomodoro.breakLength = 5;
            pomodoro.isActive = false;
            pomodoro.isPaused = false;
            pomodoro.isBreak = false;
            pomodoro.rounds = 0;
            pomodoro.updateUI();
            updateButton("play");
        };
    },
    update: () => {
        /**
         * Updates the pomodoro timer display.
         */
        if (!pomodoro.isPaused) {
            if (pomodoro.seconds === 0 && pomodoro.minutes === 0) {
                clearInterval(pomodoro.timer);
                if (user.debug === true) {
                    console.log("[pomodoro.update]: Timer has ended.");
                };
                if (!pomodoro.isBreak) {
                    // Log the time spent on the pomodoro.
                    pomodoro.timeSpent.focusTime += pomodoro.timerLength;

                    if ((pomodoro.rounds + 1) % 4 === 0 && pomodoro.rounds != 0) {
                        // Have the user take a longer break after 4 rounds.
                        pomodoro.startBreak(15);
                    } else {
                        // Start a 5 minute break.
                        pomodoro.startBreak();
                    };
                } else {
                    // Track the time spent on the break.
                    pomodoro.timeSpent.breakTime += pomodoro.breakLength;

                    // End the break.
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
    updateUI () {
        /**
         * Updates the pomodoro timer display.
         */
        const timerDisplay = document.getElementById("pom-time");
        const timerCircle = document.getElementById("pom-circle");

        // Update the pomodoro timer display.
        if (timerDisplay) {
            timerDisplay.textContent = `${String(pomodoro.minutes).padStart(2, "0")}:${String(pomodoro.seconds).padStart(2, "0")}`;
        };

        // Calculate the percentage of time left and update the stroke.
        const totalSeconds = pomodoro.minutes * 60 + pomodoro.seconds;
        const totalPomodoroSeconds = pomodoro.timerLength * 60;
        const percentLeft = totalSeconds / totalPomodoroSeconds;

        // Calculate the new stroke-dashoffset value.
        const circleLength = 2 * Math.PI * 90;
        const circleOffset = circleLength * (1 - percentLeft);

        // Update the stroke-dashoffset value to animate the circle.
        if (timerCircle) {
            timerCircle.style.strokeDashoffset = circleOffset;
        };
    },
    cheat () {
        /**
         * A function that skips to the end of the pomodoro. This is used for
         * testing, and is not meant to be used by users. The function is
         * supposed to only be called through the console.
         */
        if (pomodoro.isActive || pomodoro.isBreak) {
            // Advance the pomodoro timer.
            pomodoro.minutes = 0;
            pomodoro.seconds = 1;
            console.log("[pomodoro.cheat]: Skipping to the end of the timer.");

            // Update the UI to reflect the change immediately.
            pomodoro.updateUI();
        } else {
            console.log("[pomodoro.cheat]: No timer is currently active.");
        };
    }
};

/*------------------------ POMODORO UTILITY FUNCTIONS ------------------------*/
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
        pomMessage.textContent = "Pomodoro stopped.";

        // Hide the message after 5 seconds.
        setTimeout(() => {
            pomMessage.textContent = "";
        }, 5000);
    } else if (state === "pause") {
        pomMessage.textContent = "Time to focus.";
    } else if (state === "resume") {
        pomMessage.textContent = "Paused";
    } else {
        pomMessage.textContent = "";
    };
};
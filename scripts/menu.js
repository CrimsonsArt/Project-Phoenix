/*---------------------------------- IMPORT ----------------------------------*/

/*------------------------- USER INTERFACE FUNCTIONS -------------------------*/
export const menu = {
    /**
     * Controls the sidebar menu functionality.
     * 
     * @variable state - The state of the menu, open or closed.
     * 
     * @returns {object} menu - The menu object.
     * 
     * TODO: Default to closed on load if screen is small.
     * TODO: Add checkbox to pin the menu to stay open.
     * TODO: Let user hide sections in the menu.
     * TODO: Let the user view specific sections individually.
     * CONSIDER: Add the icons to the menu through JavaScript.
     */
    state: "closed",

    toggle() {
        /**
         * Toggles the sidebar menu.
         * 
         * TODO: Update the button's aria-label and title.
         * TODO: Shift main content to the right if menu is open.
         */
        const button = document.getElementById("menu-toggle");
        const sidebar = document.getElementById("sidebar-menu");

        // Close the menu
        if (menu.state === "open") {
            menu.state = "closed";
            sidebar.classList.add("closed");

        // Open the menu
        } else if (menu.state === "closed") {
            menu.state = "open";
            sidebar.classList.remove("closed");
        };
    }
};
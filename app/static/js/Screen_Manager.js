// ScreenManager.js

console.log(`[INFO]: Loaded page to screen ${current_screen}`)

const screen_definitions = {
    "1": ["add-result", "open-add-result"],
    "2": ["see-result", "open-see-result"],
    "3": ["my-account", "open-my-account"],
    "4": ["the-developer", "open-the-developer"]
}

/**
 * Loads a screen based on the provided screen ID.
 * 
 * Hides all other screens and displays only the selected screen. Also activates the associated tab if it exists.
 * 
 * @param {number|string} screen_id - The ID of the screen to load from the `screen_definitions` object.
 */
function loadScreen(screen_id) {
    try {
        // Hide all screens
        const screens = document.querySelectorAll(".screen")
        screens.forEach(screen => {
            screen.style.display = 'none'
        })
        document.querySelector(".default-screen").style.display = 'none'
        
        // Reset all tabs
        const tabs = document.querySelectorAll(`.tab`)
        tabs.forEach(tab => {
            tab.className = "tab"
        })
        
        // Display the selected screen
        document.querySelector(`#${screen_definitions[screen_id][0]}`).style.display = 'block'
        
        // Activate the associated tab if it exists
        try {
            document.querySelector(`#${screen_definitions[screen_id][1]}`).className = 'tab active-tab'
        } catch (e) {
            console.log(`Doesn't have a trigger button\n${e}`);
        }

        console.log(`[INFO]: Loaded page to screen 👇\nScreen ID: ${screen_id}\nScreen Name: ${screen_definitions[screen_id][0]}`)
        toggleSidebar()
    } catch (e) {
        console.log(`Invalid Screen ID\n${e}`);
    }
}

/**
 * Navigates to a specific screen by hiding all others and displaying the selected one.
 * 
 * This function hides all screens and activates the clicked element's tab. It handles cases where the display property may differ.
 * 
 * @param {HTMLElement} element - The HTML element that triggered the screen change.
 * @param {string} screen_id - The ID of the screen to display.
 * @param {string} display_property - CSS display property to apply (e.g., 'block', 'flex', etc.).
 */
function goToScreen(element, screen_id, display_property) {
    // Hide all screens
    const screens = document.querySelectorAll(".screen")
    screens.forEach(screen => {
        screen.style.display = 'none'
    })
    
    // Reset tabs for the same element class
    const tabs = document.querySelectorAll(`.${element.className}`)
    tabs.forEach(tab => {
        tab.className = "tab"
    })
    
    // Display the selected screen
    document.querySelector(`#${screen_id}`).style.display = display_property.includes('-das') ? "block" : `${display_property}`

    // Activate the tab unless display_property is dashboard-related
    if (!display_property.includes('-das')) {
        element.className = "tab active-tab"
    }
}

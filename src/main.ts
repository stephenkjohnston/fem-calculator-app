import "./scss/styles.scss";

document.addEventListener("DOMContentLoaded", () => {
    // Select the HTML element
    const $htmlElement = document.querySelector("html");

    // Select all theme toggle radio inputs
    const themeSelections = document.querySelectorAll(
        ".theme-toggle input[type='radio']"
    );
    const themeSelectionToggleSound = document.getElementById(
        "themeToggleSound"
    ) as HTMLAudioElement;

    // Select all keys
    const calculatorKeys = document.querySelectorAll(".key");
    const calculatorKeyPressedSound = document.getElementById(
        "themeToggleKeySound"
    ) as HTMLAudioElement;

    // Set a default theme if no theme is set in localStorage
    const currentTheme = localStorage.getItem("theme");

    if (!currentTheme) {
        // Detect system theme preference and set accordingly
        const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const prefersLightMode = window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches;

        if (prefersDarkMode) {
            localStorage.setItem("theme", "dark");
            $htmlElement?.setAttribute("data-theme", "dark");
        } else if (prefersLightMode) {
            localStorage.setItem("theme", "light");
            $htmlElement?.setAttribute("data-theme", "light");
        } else {
            localStorage.setItem("theme", "light");
            $htmlElement?.setAttribute("data-theme", "light");
        }
    } else {
        // Apply the current theme from localStorage
        $htmlElement?.setAttribute("data-theme", currentTheme);
    }

    // Add event listeners to theme selection radio buttons
    themeSelections.forEach((themeSelection) => {
        // Add a click event listener
        themeSelection.addEventListener("click", (event) => {
            const selectedTheme = (event.target as HTMLInputElement).value;
            if ($htmlElement) {
                // Update the data-theme attribute and localStorage with the selected theme
                $htmlElement.setAttribute("data-theme", selectedTheme);
                localStorage.setItem("theme", selectedTheme);

                // Play sound
                themeSelectionToggleSound.currentTime = 0;
                themeSelectionToggleSound.volume = 0.25;
                themeSelectionToggleSound.play();
            }
        });
    });

    // Add event listeners for they calculator keys
    calculatorKeys.forEach((calculatorKey) => {
        const currentKey = calculatorKey as HTMLButtonElement;
        // Add "pressed" class on mousedown
        currentKey.addEventListener("mousedown", (event: MouseEvent) => {
            event.preventDefault();
            currentKey.classList.add("pressed");
            calculatorKeyPressedSound.currentTime = 0;
            calculatorKeyPressedSound.volume = 0.25;
            calculatorKeyPressedSound.play();
        });
        // Remove "pressed" class on mouseup
        currentKey.addEventListener("mouseup", (event: MouseEvent) => {
            event.preventDefault();
            currentKey.classList.remove("pressed");
        });

        // Remove "pressed" class on mouseleave
        currentKey.addEventListener("mouseleave", (event: MouseEvent) => {
            currentKey.classList.remove("pressed");
        });
    });
});

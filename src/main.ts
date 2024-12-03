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

    const calculatorDisplay = document.querySelector(
        ".display__input"
    ) as HTMLInputElement;

    // Select all keys
    const calculatorKeys = document.querySelectorAll(".key");
    const calculatorKeyPressedSound = document.getElementById(
        "themeToggleKeySound"
    ) as HTMLAudioElement;

    let currentInput = "";
    let operator = "";
    let previousInput;

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
            calculatorKey.setAttribute("aria-pressed", "true");

            handleCalculatorInput(
                currentKey.dataset.value,
                currentKey.dataset.type
            );
        });
        // Remove "pressed" class on mouseup
        currentKey.addEventListener("mouseup", (event: MouseEvent) => {
            event.preventDefault();
            currentKey.classList.remove("pressed");
            calculatorKey.setAttribute("aria-pressed", "false");
        });

        // Remove "pressed" class on mouseleave
        currentKey.addEventListener("mouseleave", (event: MouseEvent) => {
            currentKey.classList.remove("pressed");
        });
    });

    function handleCalculatorInput(value, type) {
        if (calculatorDisplay) {
            if (type === "number") {
                currentInput += value;
                calculatorDisplay.value = currentInput;
            }

            if (type === "action") {
                if (value === "delete") {
                    currentInput = currentInput.slice(0, -1);
                    calculatorDisplay.value = currentInput;
                }

                if (value === "equals") {
                    if (previousInput && operator && currentInput) {
                        const result = calculate(
                            previousInput,
                            operator,
                            currentInput
                        );
                        console.log({ result });
                        calculatorDisplay.value = `${result}`;
                        currentInput = "";
                        operator = "";
                        previousInput = result;
                    }
                }

                if (value === "reset") {
                    currentInput = "";
                    operator = "";
                    previousInput = "";
                    calculatorDisplay.value = "";
                }
            }

            if (type === "operator") {
                if (currentInput) {
                    if (operator) {
                        previousInput = calculate(
                            previousInput,
                            operator,
                            currentInput
                        );
                        calculatorDisplay.textContent = previousInput;
                    } else {
                        previousInput = currentInput;
                    }
                    operator = value;
                    currentInput = "";
                }
            }
        }
    }

    function calculate(a, operator, b) {
        switch (operator) {
            case "add":
                return parseFloat(a) + parseFloat(b);
            case "subtract":
                return parseFloat(a) - parseFloat(b);
            case "multiply":
                return parseFloat(a) * parseFloat(b);
            case "divide":
                return parseFloat(a) / parseFloat(b);
            default:
                return b;
        }
    }
});

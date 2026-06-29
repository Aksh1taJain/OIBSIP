/**
 * script.js — Temperature Converter
 *
 * How it works:
 * 1. Read the value and unit from the form.
 * 2. Validate: must be a number, must not be below absolute zero.
 * 3. Convert the input to Celsius (intermediate step).
 * 4. From Celsius, derive Fahrenheit and Kelvin.
 * 5. Display the three results in the result tiles.
 *
 * Absolute-zero limits (the coldest physically possible temperature):
 *   Celsius    : -273.15 °C
 *   Fahrenheit : -459.67 °F
 *   Kelvin     :    0 K
 */

"use strict"; // catch common JS mistakes early

/* ── DOM references ────────────────────────────────────────── */
const tempInput   = document.getElementById("temp-input");
const unitSelect  = document.getElementById("unit-select");
const convertBtn  = document.getElementById("convert-btn");
const resetBtn    = document.getElementById("reset-btn");
const errorMsg    = document.getElementById("error-msg");

// Result value elements
const resultC = document.getElementById("result-celsius");
const resultF = document.getElementById("result-fahrenheit");
const resultK = document.getElementById("result-kelvin");

/* ── Absolute-zero limits per unit ─────────────────────────── */
const ABS_ZERO = {
  celsius:    -273.15,
  fahrenheit: -459.67,
  kelvin:       0
};

/* ── Conversion helpers (all go via Celsius) ────────────────── */

/**
 * Convert any unit → Celsius.
 * @param {number} value  - The temperature value.
 * @param {string} unit   - "celsius" | "fahrenheit" | "kelvin"
 * @returns {number} Temperature in Celsius.
 */
function toCelsius(value, unit) {
  switch (unit) {
    case "celsius":    return value;
    case "fahrenheit": return (value - 32) * (5 / 9);
    case "kelvin":     return value - 273.15;
  }
}

/**
 * Convert Celsius → Fahrenheit.
 * @param {number} celsius
 * @returns {number}
 */
function celsiusToFahrenheit(celsius) {
  return celsius * (9 / 5) + 32;
}

/**
 * Convert Celsius → Kelvin.
 * @param {number} celsius
 * @returns {number}
 */
function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

/* ── Formatting helper ──────────────────────────────────────── */

/**
 * Round a number to at most 4 decimal places, then remove
 * trailing zeros so "100.0000" becomes "100".
 * @param {number} n
 * @returns {string}
 */
function format(n) {
  return parseFloat(n.toFixed(4)).toString();
}

/* ── Error helpers ──────────────────────────────────────────── */

/** Show an error message and mark the input as invalid. */
function showError(message) {
  errorMsg.textContent   = message;
  errorMsg.classList.add("is-visible");
  tempInput.classList.add("is-invalid");
}

/** Clear any existing error. */
function clearError() {
  errorMsg.textContent      = "";
  errorMsg.classList.remove("is-visible");
  tempInput.classList.remove("is-invalid");
}

/* ── Main conversion logic ──────────────────────────────────── */

function convertTemperature() {
  clearError(); // clear previous errors first

  const rawValue = tempInput.value.trim();
  const unit     = unitSelect.value;

  // --- Validation 1: empty input ---
  if (rawValue === "") {
    showError("Please enter a temperature value.");
    return;
  }

  // --- Validation 2: must be a numeric value ---
  // parseFloat handles decimals and negatives; isNaN catches text
  const value = parseFloat(rawValue);
  if (isNaN(value)) {
    showError("That doesn't look like a number. Try something like 100 or -40.");
    return;
  }

  // --- Validation 3: physical lower bound (absolute zero) ---
  const limit = ABS_ZERO[unit];
  if (value < limit) {
    // Build a user-friendly message that mentions the actual limit
    const unitLabel = {
      celsius:    "°C",
      fahrenheit: "°F",
      kelvin:     "K"
    }[unit];
    showError(
      `${value} ${unitLabel} is below absolute zero. ` +
      `The minimum in ${unit.charAt(0).toUpperCase() + unit.slice(1)} is ${limit} ${unitLabel}.`
    );
    return;
  }

  // --- Conversion ---
  const celsius    = toCelsius(value, unit);
  const fahrenheit = celsiusToFahrenheit(celsius);
  const kelvin     = celsiusToKelvin(celsius);

  // --- Display results ---
  resultC.textContent = format(celsius);
  resultF.textContent = format(fahrenheit);
  resultK.textContent = format(kelvin);
}

/* ── Reset / clear ──────────────────────────────────────────── */

function resetAll() {
  tempInput.value     = "";
  unitSelect.value    = "celsius";
  resultC.textContent = "–";
  resultF.textContent = "–";
  resultK.textContent = "–";
  clearError();
  tempInput.focus(); // return focus to the input for convenience
}

/* ── Event listeners ────────────────────────────────────────── */

// Convert when the button is clicked
convertBtn.addEventListener("click", convertTemperature);

// Also convert when the user presses Enter inside the input field
tempInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    convertTemperature();
  }
});

// Clear the error highlight as soon as the user starts typing again
tempInput.addEventListener("input", function () {
  if (tempInput.classList.contains("is-invalid")) {
    clearError();
  }
});

// Clear button resets everything
resetBtn.addEventListener("click", resetAll);

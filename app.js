// API address
const API_URL = "https://bored-api.appbrewery.com";

// Find the HTML elements
const categoryInput = document.querySelector("#category");
const priceInput = document.querySelector("#price");
const accessibilityInput = document.querySelector("#accessibility");
const findButton = document.querySelector("#find-button");

const activityName = document.querySelector("#activity-name");
const activityType = document.querySelector("#activity-type");
const activityDescription = document.querySelector("#activity-description");

const participants = document.querySelector("#participants");
const priceValue = document.querySelector("#price-value");
const accessibilityValue = document.querySelector("#accessibility-value");
const message = document.querySelector("#message");

// Display the activity details
function showActivity(activity) {

```
activityName.innerText = activity.activity;
activityType.innerText = activity.type;

activityDescription.innerText =
    "Here is something new to try. Make it part of your day!";

participants.innerText = activity.participants;

// Convert the price value into a percentage
priceValue.innerText = Math.round(activity.price * 100) + "%";

// Show the accessibility description returned by the API
accessibilityValue.innerText = activity.accessibility;

message.innerText = "Your activity is ready. Enjoy your discovery!";
```

}

// Get an activity from the API
async function findActivity() {

```
// Read the user's choices
const category = categoryInput.value;
const maximumPrice = Number(priceInput.value);
const maximumAccessibility = Number(accessibilityInput.value);

// Show a loading message
findButton.disabled = true;
findButton.innerText = "Finding your activity...";
message.innerText = "Searching for a great idea...";

try {

    let response;

    // Choose the API request based on the category
    if (category === "") {

        response = await axios.get(`${API_URL}/random`);

    } else {

        response = await axios.get(`${API_URL}/filter`, {
            params: {
                type: category
            }
        });

    }

    // The random endpoint returns one object.
    // The filter endpoint returns an array.
    let activities;

    if (Array.isArray(response.data)) {
        activities = response.data;
    } else {
        activities = [response.data];
    }

    // Keep activities that meet the price limit.
    const affordableActivities = activities.filter(function(activity) {
        return Number(activity.price) <= maximumPrice;
    });

    // This API uses text for accessibility, not a numeric value.
    // Therefore, we cannot correctly compare accessibility
    // against the numeric limit selected by the user.
    const hasNumericAccessibility = affordableActivities.some(
        function(activity) {
            return typeof activity.accessibility === "number";
        }
    );

    if (!hasNumericAccessibility && maximumAccessibility < 1) {

        message.innerText =
            "The current API provides accessibility as text, not a number. " +
            "Please select Any level for accessibility.";

        activityName.innerText = "Choose another accessibility option";
        activityType.innerText = "FILTER INFORMATION";

        participants.innerText = "—";
        priceValue.innerText = "—";
        accessibilityValue.innerText = "Text-based";

        return;
    }

    // Use a numeric accessibility limit only when the API provides
    // a numeric accessibility value.
    const matchingActivities = affordableActivities.filter(
        function(activity) {

            if (typeof activity.accessibility === "number") {
                return activity.accessibility <= maximumAccessibility;
            }

            return maximumAccessibility === 1;

        }
    );

    // Handle the case when no activity matches
    if (matchingActivities.length === 0) {

        activityName.innerText = "No activity found for these preferences.";

        activityType.innerText = "TRY AGAIN";

        activityDescription.innerText =
            "Try another category or increase your price limit.";

        participants.innerText = "—";
        priceValue.innerText = "—";
        accessibilityValue.innerText = "—";

        message.innerText = "No matching activity was found.";

        return;
    }

    // Pick one activity at random
    const randomNumber = Math.floor(
        Math.random() * matchingActivities.length
    );

    const chosenActivity = matchingActivities[randomNumber];

    // Display the selected activity
    showActivity(chosenActivity);

} catch (error) {

    // Log the error to the browser console
    console.error("Could not load an activity:", error);

    activityName.innerText = "We couldn't find an activity.";

    activityType.innerText = "PLEASE TRY AGAIN";

    activityDescription.innerText =
        "Check your internet connection and try again.";

    participants.innerText = "—";
    priceValue.innerText = "—";
    accessibilityValue.innerText = "—";

    message.innerText =
        "The API request failed. Please try again.";

} finally {

    // Enable the button again
    findButton.disabled = false;
    findButton.innerText = "Find My Activity →";

}
```

}

// Listen for button clicks
findButton.addEventListener("click", findActivity);

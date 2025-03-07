const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

let todoList = []; // Declare todoList outside the function

function speak(sentence) {
    if ('speechSynthesis' in window) {
        const text_speak = new SpeechSynthesisUtterance(sentence);
        text_speak.rate = 1;
        text_speak.pitch = 1;
        window.speechSynthesis.speak(text_speak);
    } else {
        console.error("Speech synthesis is not supported in this browser.");
    }
}

function wishMe() {
    const day = new Date();
    const hr = day.getHours();

    if (hr >= 0 && hr < 12) {
        speak("Need password to work");
    } else if (hr === 12) {
        speak("Good noon sir");
    } else if (hr > 12 && hr <= 17) {
        speak("Need password to work");
    } else {
        speak("Need password to work");
    }
}

window.addEventListener('load', () => {
    speak("Activating SARVIS");
    speak("Making programme ready to work, making system ready, going online");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    speakThis(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    recognition.start();
});

async function speakThis(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = "I did not understand what you said. Please try again.";

    if (message.includes('hey') || message.includes('hello')) {
        speech.text = "Hello sir";
    } else if (message.includes('password is 2006')) {
        speech.text = "System is ready. Nice to see you back, sir. Really looking handsome as usual, sir ji.";
    } else if (message.includes('tell something about me')) {
        speech.text = "Just 4 words for you, sir: Genius, Billionaire, Romeo, and Philanthropist.";
    } else if (message.includes('tell me something about yourself')) {
        speech.text = "An advanced format of AI assistant made to work with you, sir. I'll be grateful if I can do something for you.";
    } else if (message.includes('how are you')) {
        speech.text = "I am fine, boss. Tell me how I can help you.";
    } else if (message.includes('name')) {
        speech.text = "My name is Sarvis.";
    } else if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        speech.text = "Opening Google.";
    } else if (message.includes('open instagram')) {
        window.open("https://instagram.com", "_blank");
        speech.text = "Opening Instagram.";
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speech.text = "This is what I found on the internet regarding " + message;
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        speech.text = "This is what I found on Wikipedia regarding " + message;
    } else if (message.includes('add task')) {
        const task = message.replace("add task", "").trim();
        todoList.push(task);
        speech.text = `Added "${task}" to your to-do list.`;
    } else if (message.includes('view tasks')) {
        if (todoList.length === 0) {
            speech.text = "Your to-do list is empty.";
        } else {
            speech.text = "Your tasks are: " + todoList.join(", ");
        }
    } else if (message.includes('delete task')) {
        const task = message.replace("delete task", "").trim();
        todoList = todoList.filter(item => item !== task);
        speech.text = `Deleted "${task}" from your to-do list.`;
    } else if (message.includes('clear tasks')) {
        todoList = [];
        speech.text = "Your to-do list has been cleared.";
    } else if (message.includes('weather')) {
        let location = message.replace("weather", "").trim();
        location = `${location},IN`; // Append ",IN" for India
        location = encodeURIComponent(location); // Encode the city name
        console.log("Location:", location); // Debug: Log the extracted location

        if (!location) {
            speech.text = "Please specify a location to get the weather information.";
            window.speechSynthesis.speak(speech);
            return;
        }

        async function getCoordinates(city) {
            const apiKey = '5f7940a6e35e83844ca419bd6b0293dc';
            const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

            try {
                const response = await fetch(geocodeUrl);
                const data = await response.json();
                if (data.length > 0) {
                    return { lat: data[0].lat, lon: data[0].lon }; // Return latitude and longitude
                } else {
                    throw new Error("City not found");
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                return null;
            }
        }

        async function fetchWeatherByCoordinates(lat, lon) {
            const apiKey = '5f7940a6e35e83844ca419bd6b0293dc';
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                if (data.cod === 200) {
                    const weather = data.weather[0].description;
                    const temp = data.main.temp;
                    return `The weather is ${weather} with a temperature of ${temp}°C.`;
                } else {
                    return `Error: ${data.message}`;
                }
            } catch (error) {
                console.error("Fetch error:", error);
                return "Sorry, I couldn't fetch the weather information.";
            }
        }

        // Fetch coordinates and then weather
        const coordinates = await getCoordinates(location);
        if (coordinates) {
            const weatherResponse = await fetchWeatherByCoordinates(coordinates.lat, coordinates.lon);
            console.log("Weather response:", weatherResponse); // Debug: Log the final response
            speech.text = weatherResponse;
        } else {
            speech.text = `Sorry, I couldn't find "${decodeURIComponent(location)}". Please check the spelling.`;
        }
    } else if (message.includes('map')) {
        const location = message.replace("map", "").trim();
        if (location) {
            const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}`;
            window.open(mapUrl, "_blank");
            speech.text = `Opening Google Maps for ${location}.`;
        } else {
            speech.text = "Please specify a location to open the map.";
        }
    } else if (message.includes('directions to')) {
        const destination = message.replace("directions to", "").trim();
        if (destination) {
            const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
            window.open(mapUrl, "_blank");
            speech.text = `Opening directions to ${destination}.`;
        } else {
            speech.text = "Please specify a destination for directions.";
        }
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speech.text = time;
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speech.text = date;
    } else if (message.includes('calculator')) {
        window.open('https://www.google.com/search?q=calculator', "_blank");
        speech.text = "Opening Calculator.";
    } else if (message.includes('help')) {
        speech.text = "I can help you with the following: weather, maps, directions, to-do lists, information about somebody, simple calculations, and many more things. Just ask!";
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speech.text = "I found some information for " + message + " on Google.";
    }

    speech.volume = 1;
    speech.pitch = 1;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}

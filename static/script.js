const input = document.getElementById("city");
const suggestions = document.getElementById("suggestions");
const weatherResult = document.getElementById("weatherResult");
const unitRadios = document.querySelectorAll('input[name="units"]');

// Get the selected unit (metric or imperial)
function getSelectedUnit() {
    let selectedUnit = "metric";
    unitRadios.forEach(radio => {
        if (radio.checked) {
            selectedUnit = radio.value;
        }
    });
    return selectedUnit;
}

// Add event listeners to unit toggle
unitRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        // If we already have a city displayed, refresh the weather with new units
        if (input.value.trim()) {
            fetchWeather(input.value.trim());
        }
    });
});

// Function to add animation class with delay
function animateElement(element, className, delay = 0) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

// Function to fetch weather data
function fetchWeather(city) {
    const units = getSelectedUnit();
    
    // Reset and hide the weather box
    weatherResult.innerHTML = '';
    weatherResult.classList.remove('visible');
    
    // Hide suggestions
    suggestions.innerHTML = '';
    
    fetch(`/weather?city=${encodeURIComponent(city)}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                weatherResult.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
                weatherResult.classList.add('visible');
                return;
            }

            const tempUnit = units === "metric" ? "°C" : "°F";
            const windUnit = units === "metric" ? "m/s" : "mph";
            const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

            weatherResult.innerHTML = `
                <div class="weather-header">
                    <img src="${iconUrl}" alt="${data.description}" class="weather-icon">
                    <h3>Weather in ${city}</h3>
                </div>
                <ul>
                    <li><strong>Temperature:</strong> ${data.temperature}${tempUnit}</li>
                    <li><strong>Feels Like:</strong> ${data.feels_like}${tempUnit}</li>
                    <li><strong>Description:</strong> ${data.description}</li>
                    <li><strong>Humidity:</strong> ${data.humidity}%</li>
                    <li><strong>Wind Speed:</strong> ${data.wind_speed} ${windUnit}</li>
                    <li><strong>UV Index:</strong> ${data.uv_index}</li>
                    <li><strong>AQI:</strong> ${data.aqi} (${data.aqi_level})</li>
                </ul>
            `;
            
            // Add animation with a slight delay
            setTimeout(() => {
                weatherResult.classList.add('visible');
            }, 100);
        })
        .catch(err => {
            weatherResult.innerHTML = `<p style="color:red;" class="fade-in">Weather fetch failed.</p>`;
            weatherResult.classList.add('visible');
            console.error("Weather fetch error:", err);
        });
}

// Create animated suggestions
function createAnimatedSuggestion(city, index) {
    const div = document.createElement("div");
    div.textContent = city;
    div.classList.add("suggestion");
    div.style.opacity = "0";
    div.style.transform = "translateY(10px)";
    div.style.transition = "all 0.3s ease";
    div.style.transitionDelay = `${index * 0.05}s`;
    
    // Animate in after a small delay
    setTimeout(() => {
        div.style.opacity = "1";
        div.style.transform = "translateY(0)";
    }, 10);

    div.addEventListener("click", () => {
        input.value = city;
        suggestions.innerHTML = "";
        fetchWeather(city);
    });

    return div;
}

// Hide suggestions when clicking outside
document.addEventListener('click', function(event) {
    if (event.target !== input && !suggestions.contains(event.target)) {
        suggestions.innerHTML = '';
    }
});

input.addEventListener("input", () => {
    const query = input.value.trim();
    weatherResult.innerHTML = "";  // Clear old weather results while typing
    weatherResult.classList.remove('visible');

    if (query.length >= 2) {
        fetch(`/suggest?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                suggestions.innerHTML = ""; // Clear previous suggestions
                if (data.length === 0) {
                    suggestions.style.display = "none";
                } else {
                    suggestions.style.display = "block";
                    data.forEach((city, index) => {
                        const div = createAnimatedSuggestion(city, index);
                        suggestions.appendChild(div);
                    });
                }
            })
            .catch(err => {
                console.error("Suggestion fetch failed:", err);
            });
    } else {
        suggestions.innerHTML = "";
    }
});

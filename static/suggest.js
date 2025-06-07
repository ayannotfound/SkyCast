const input = document.getElementById("city");
const suggestions = document.getElementById("suggestions");
const weatherResult = document.getElementById("weatherResult");

input.addEventListener("input", () => {
    const query = input.value.trim();
    weatherResult.innerHTML = "";  // Clear old weather results while typing

    if (query.length >= 2) {
        fetch(`/suggest?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                suggestions.innerHTML = ""; // Clear previous suggestions
                data.forEach(city => {
                    const div = document.createElement("div");
                    div.textContent = city;
                    div.classList.add("suggestion");

                    div.addEventListener("click", () => {
                        input.value = city;
                        suggestions.innerHTML = "";

                        // Fetch weather on suggestion click
                        fetch(`/weather?city=${encodeURIComponent(city)}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    weatherResult.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
                                    return;
                                }

                                weatherResult.innerHTML = `
                                    <h3>🌤️ Weather in ${city}</h3>
                                    <ul>
                                        <li><strong>Temperature:</strong> ${data.temperature}°C</li>
                                        <li><strong>Feels Like:</strong> ${data.feels_like}°C</li>
                                        <li><strong>Description:</strong> ${data.description}</li>
                                        <li><strong>Humidity:</strong> ${data.humidity}%</li>
                                        <li><strong>Wind Speed:</strong> ${data.wind_speed} m/s</li>
                                        <li><strong>UV Index:</strong> ${data.uv_index}</li>
                                        <li><strong>AQI:</strong> ${data.aqi} (${data.aqi_level})</li>
                                    </ul>
                                `;
                            })
                            .catch(err => {
                                weatherResult.innerHTML = `<p style="color:red;">Weather fetch failed.</p>`;
                                console.error("Weather fetch error:", err);
                            });
                    });

                    suggestions.appendChild(div);
                });
            })
            .catch(err => {
                console.error("Suggestion fetch failed:", err);
            });
    } else {
        suggestions.innerHTML = "";
    }
});

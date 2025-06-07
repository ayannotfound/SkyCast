async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    document.getElementById("weatherResult").innerHTML = "Failed to fetch weather.";
    return;
  }

  const data = await res.json();
  document.getElementById("weatherResult").innerHTML = `
    <h2>${city}</h2>
    <p><strong>Temperature:</strong> ${data.temperature}°C</p>
    <p><strong>Feels Like:</strong> ${data.feels_like}°C</p>
    <p><strong>Humidity:</strong> ${data.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind_speed} m/s</p>
    <p><strong>Condition:</strong> ${data.description}</p>
    <p><strong>UV Index:</strong> ${data.uv_index}</p>
    <p><strong>AQI:</strong> ${data.aqi} (${data.aqi_level})</p>
  `;
}

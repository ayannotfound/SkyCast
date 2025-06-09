import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")

def get_city_coordinates(city):
    url = f"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if data:
            lat = data[0]["lat"]
            lon = data[0]["lon"]
            print(f"{city} → Latitude: {lat}, Longitude: {lon}")
            return lat, lon, city
        else:
            print("City not found.")
            return None
    else:
        print("Failed to fetch coordinates:", response.status_code)
        return None

def get_aqi(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if data:
            aqi = data["list"][0]["main"]["aqi"]
            aqi_levels = {
                1: "Good",
                2: "Fair",
                3: "Moderate",
                4: "Poor",
                5: "Very Poor"
            }
            print(f"Air Quality Index: {aqi} ({aqi_levels.get(aqi)})")
            return aqi, aqi_levels.get(aqi)
        else:
            print("City not found.")
            return None, None
    else:
        print("Failed to fetch AQI data:", response.status_code)
        return None, None

def get_uv(lat, lon, city_name):
    url = f"https://api.openweathermap.org/data/2.5/uvi?appid={API_KEY}&lat={lat}&lon={lon}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        uv_index = data.get("value", "N/A")
        print(f"UV Index in {city_name}: {uv_index}")
        return uv_index
    else:
        print("Failed to fetch UV index:", response.status_code)
        return None

def get_weather(city, units="metric"):
    coords = get_city_coordinates(city)
    if not coords:
        return None
    lat, lon, city_name = coords

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units={units}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if data:
            temp = data["main"]["temp"]
            feelslike = data["main"]["feels_like"]
            humidity = data["main"]["humidity"]
            wind_speed = data["wind"]["speed"]
            description = data["weather"][0]["description"].title()
            icon_code = data["weather"][0]["icon"]
            
            temp_unit = "°C" if units == "metric" else "°F"
            wind_unit = "m/s" if units == "metric" else "mph"

            print(f"\nWeather in {city_name}:\n"
                  f"Temperature: {temp}{temp_unit}\n"
                  f"Feels Like: {feelslike}{temp_unit}\n"
                  f"Humidity: {humidity}%\n"
                  f"Wind Speed: {wind_speed} {wind_unit}\n"
                  f"Description: {description}")

            uv_index = get_uv(lat, lon, city_name)
            aqi, aqi_desc = get_aqi(lat, lon)

            return {
                "temperature": temp,
                "feels_like": feelslike,
                "humidity": humidity,
                "wind_speed": wind_speed,
                "description": description,
                "uv_index": uv_index,
                "aqi": aqi,
                "aqi_level": aqi_desc,
                "icon": icon_code,
                "units": units
            }
        else:
            print("City not found.")
            return None
    else:
        print("Failed to fetch weather data:", response.status_code)
        return None

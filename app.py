from flask import Flask, request, jsonify, render_template
import requests
import os
from weather import get_weather
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/weather")
def weather_route():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    weather_data = get_weather(city)
    if weather_data is None:
        return jsonify({"error": "Failed to get weather data"}), 500

    return jsonify(weather_data)

@app.route("/suggest")
def suggest_cities():
    query = request.args.get("query")
    print("Suggestion query:", query)  # Debug print
    if not query:
        return jsonify([])

    url = f"http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        print("Failed to fetch suggestions:", response.status_code)
        return jsonify([])

    cities = response.json()
    suggestions = [f"{c['name']}, {c.get('state', '')}, {c['country']}".strip(', ') for c in cities]
    print("Suggestions:", suggestions)  # Debug print
    return jsonify(suggestions)


if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, request, jsonify, render_template
from weather import get_weather
from dotenv import load_dotenv

load_dotenv()

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

if __name__ == "__main__":
    app.run(debug=True)
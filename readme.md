# Weather Info

A simple weather web app built with [Flask](https://flask.palletsprojects.com/) and [OpenWeatherMap](https://openweathermap.org)'s API. 
Shows current weather, UV index, and air quality for any city.

[Live Demo](https://weather-ehsc.onrender.com)

---

## Features
- Real-time weather, UV index, and air quality
- City autocomplete
- Switch between °C and °F
- Responsive design
- Deployed on Render
- **Android version in progress**

---

## Tech Stack
- Python (Flask)
- OpenWeatherMap API
- HTML, CSS, JavaScript
- Deployment: Render

---

## Getting Started
1. Clone the repo
   ```bash
   git clone https://github.com/ayannotfound/Weather.git
   cd Weather
   ```
2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
3. Add your OpenWeatherMap API key to a `.env` file:
   ```
   API_KEY=your_openweathermap_api_key
   ```
4. Run locally
   ```bash
   python app.py
   ```
   Visit `http://localhost:5000`

---

## What I Learned
- Flask routes and templates
- Using `jsonify` and `render_template`
- API integration
- Deployment basics

---

## About Me

[LinkedIn](https://www.linkedin.com/in/ayush-anand-420590306/)  
[GitHub](https://github.com/ayannotfound)

---

**References:**
- [Flask Quickstart](https://github.com/pallets/flask/blob/main/docs/quickstart.rst#_snippet_5)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Weather Info Live Demo](https://weather-ehsc.onrender.com)
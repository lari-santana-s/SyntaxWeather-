const apiKey = "43ff12bc45fcebd8ed2eb941c5678acf";
const defaultCities = ["New York", "London", "Paris", "Tokyo", "Sydney"];

const cityInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const weatherCards = document.getElementById("weather-cards");
const loadingIncator = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");




const weatherIcons = { // ao lado temos um objeto javascript
  'Clear': '☀️',
  'Clouds': '⛅',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Haze': '🌫️',
  'Dust': '🌫️',
  'Smoke': '🌫️',
  'default': '🌡️'
};

function getWeatherIcon(weatherParam) {
  return weatherIcons[weatherParam] || weatherIcons['default'];
}

async function fetchWeatherForCity(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)

    if(!response.ok) {
      throw new Error(`City not found: ${city}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data not found" + error);
    throw new Error(error);
  }
}

function createWeatherCards(data) {
  const weatherMain = data.weather[0].main;
  const icon = getWeatherIcon(weatherMain);
  const temperature = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind.speed);
  const description = data.weather[0].description;
  const feelsLike = Math.round(data.main.feels_like);

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="content-card">
      <h3>${data.name}, ${data.sys.country}</h3>
      <div class="weather-icon">${icon}</div>
      <div class="temp">${temperature}</div>
      <p class="weather-description">${description}</p>
      <div class="details">
      <div class="detail">
        <span>💧</span>
        <span>Himidity</span>
      </div>
      <div class="detail">
        <span>💨</span>
        <span>${windSpeed} km/h</span>
        <span>Wind</span>
      </div>
      <div>
        <span>🌡️</span>
        <span>${feelsLike}°C</span>
        <span>Feels Like</span>
      </div>
    </div>
    </div>
  `

  return card
}

function showLoading(ative){
  if(ative){
    loadingIncator.style.display = "flex";
  }else {
    loadingIncator.style.display = "none";
  }
}

function hideError() {
  errorMessage.style.display =  "none";
}



function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

async function loadWeatherForCities(cities){
  showLoading(true);
  hideError();

  weatherCards.innerHTML = "";

  try {
    for(const city of cities) {
      try {
          const data = await fetchWeatherForCity(city);
          const card = createWeatherCards(data);
          weatherCards.appendChild(card);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
    if(weatherCards.children.length === 0) {
      showError("No weather data available.")
    }
  } catch (error) {
    showError("Failed to load weather data.")
  }finally {
    showLoading(false);
  }
}


async function searchCity() {
  const city  = cityInput.value.trim()

  if(!city){
    showError("Please enter a city name");
    return;
  }
  showLoading(true);
  hideError();

  try {
    const data = await fetchWeatherForCity(city)
    weatherCards.innerHTML = "";
    const card = createWeatherCards(data);
    weatherCards.appendChild(card);
  } catch (error) {
    showError(`Could not find weather data for ${city}. Please try again.`);
  } finally {
    showLoading(false);
  }

}

showLoading(true)

document.addEventListener("DOMContentLoaded", () => {
  loadWeatherForCities(defaultCities);
})

searchButton.addEventListener("click", searchCity);

searchButton.addEventListener("keypress", (event)=> {
  if(event.key === "Enter"){
    searchCity();
  }
});
  

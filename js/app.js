const api = {
  key: "20f6ff8f9e94a52343b6af8262bce37c",
  base: "https://api.openweathermap.org/data/2.5/",
  onecall: "https://api.openweathermap.org/data/2.5/onecall",
};

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchbox = document.querySelector(".inputSearch");
searchbox.addEventListener("keypress", setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    evt.preventDefault();

    getResults(searchbox.value);
  }
}

// load difault weather tempature
if (
  document.readyState !== "complete" &&
  document.readyState === "loading" &&
  !document.documentElement.doScroll
) {
  document.addEventListener("DOMContentLoaded", getResults("New york"));
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weatherLoc) => {
      return weatherLoc.json();
    })

    .then((weatherLoc) => {
      fetch(
        `${api.onecall}?lat=${weatherLoc.coord.lat}&lon=${weatherLoc.coord.lon}&exclude=minutely&units=metric&APPID=${api.key}`
      )
        .then((weather) => {
          return weather.json();
        })
        .then(displayResults);
    });

  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weather) => {
      // const stripped = searchbox.replace(/\s+/g, "_");

      return weather.json();
    })
    .then(displayCurrentResults);
}

function displayCurrentResults(weather) {
  //country name and city name
  let city = document.querySelector(".location-and-date .country-location");
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector(".location-and-date .date");
  date.innerText = dateBuilder(now);

  // hiht temperature
  let tempHiht = document.querySelector(".temp_max");
  tempHiht.innerText = weather.main.temp_max;

  // low temperature
  let tempLow = document.querySelector(".temp_min");
  tempLow.innerText = weather.main.temp_min;
}

function displayResults(weather) {
  // weather main
  // const stripped = searchbox.replace(/\s+/g, "_");
  localStorage.setItem("stripped", "safsd");
  //the main weather temperature
  let tempElement = document.querySelector(".current-temperature__value");
  tempElement.innerHTML = `${weather.current.temp} <span>°c</span>`;

  //getting Weather icon id
  let iconElement = document.querySelector(
    ".current-temperature__icon-container"
  );
  iconElement.innerHTML = ` <img src="/images/icons/${weather.current.weather[0].icon}.png" alt="Icon Weather, ${weather.current.weather[0].description} icon" />`;
  //getting deescription
  let descElement = document.querySelector(".current-temperature__summary");
  descElement.innerText = weather.current.weather[0].description;
  var d = new Date();
  let daily_weather = document.querySelector(".next-5-days__container");
  let days_container = "";
  let hourly_weather = document.querySelector(".weather-by-hour__container");
  let hourly_container = "";

  //Today's weather
  for (let index = 0; index < 7; index++) {
    const element = weather.hourly[index];
    var d = new Date(element.dt * 1000);

    hourly_container += `<div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">${d.getHours()} H</div>
            <img src="/images/icons/${
              element.weather[0].icon
            }.png" alt="Mostly sunny" />
            <div>${element.temp}&deg;</div>
          </div>`;
  }

  for (let index = 0; index < weather.daily.length; index++) {
    const element = weather.daily[index];
    var d = new Date(element.dt * 1000);

    days_container += `<div class="next-5-days__row">
            <div class="next-5-days__date">
              ${days[d.getDay()]}
              <div class="next-5-days__label">${d.getDate()}/${d.getMonth()}  </div>
            </div>

            <div class="next-5-days__low">
             ${element.temp.min}&deg;
              <div class="next-5-days__label">Low</div>
            </div>

            <div class="next-5-days__high">
                ${element.temp.max}&deg;
              <div class="next-5-days__label">High</div>
            </div>

            <div class="next-5-days__icon">
              <img src="images/icons/${
                element.weather[0].icon
              }.png" alt="Mostly sunny" />
            </div>

            <div class="next-5-days__rain">
               ${element.humidity}%
              <div class="next-5-days__label">Humidity</div>
            </div>

            <div class="next-5-days__wind">
               ${element.wind_speed} m/s
              <div class="next-5-days__label">Wind</div>
            </div>
             <div class="next-5-days__wind">
               ${element.pressure} hPa
              <div class="next-5-days__label">Pressure</div>
            </div>
             <div class="next-5-days__wind">
               ${element.clouds}%
              <div class="next-5-days__label">Cluds</div>
            </div>
          </div>`;
  }

  daily_weather.innerHTML = days_container;
  hourly_weather.innerHTML = hourly_container;

  //Wind speed.
  let speedElement = document.querySelector(".wind_speed");
  speedElement.innerText = weather.current.wind_speed;

  //Humidity.
  let humidity = document.querySelector(".humidity");
  humidity.innerText = weather.current.humidity;

  // sunrise
  let sunRiseElement = document.querySelector(".sun_rise");
  let sunRiseDateObj = new Date(weather.current.sunrise * 1000);
  // Get hours from the timestamp
  sunRiseHours = sunRiseDateObj.getUTCHours();
  // Get minutes part from the timestamp
  sunRiseMinutes = sunRiseDateObj.getUTCMinutes();
  // Get seconds part from the timestamp
  sunRiseSeconds = sunRiseDateObj.getUTCSeconds();
  formattedTimeSunRise =
    sunRiseHours.toString().padStart(2, "0") +
    ":" +
    sunRiseMinutes.toString().padStart(2, "0") +
    ":" +
    sunRiseSeconds.toString().padStart(2, "0");
  sunRiseElement.innerText = `${formattedTimeSunRise}`;

  // sunset
  let sunSetElement = document.querySelector(".sun_set");
  let sunsetDateObj = new Date(weather.current.sunset * 1000);
  // Get hours from the timestamp
  sunsetHours = sunsetDateObj.getUTCHours();
  // Get minutes part from the timestamp
  sunsetMinutes = sunsetDateObj.getUTCMinutes();
  // Get seconds part from the timestamp
  sunsetSeconds = sunsetDateObj.getUTCSeconds();
  formattedTimeSunSet =
    sunsetHours.toString().padStart(2, "0") +
    ":" +
    sunsetMinutes.toString().padStart(2, "0") +
    ":" +
    sunsetSeconds.toString().padStart(2, "0");

  sunSetElement.innerText = `${formattedTimeSunSet}`;
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "Decembre",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

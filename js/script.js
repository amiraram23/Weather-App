document.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementById("searchInput");
  var searchButton = document.getElementById("searchButton");
  var weatherForecast = document.getElementById("weatherForecast");

  var apiKey = "7892f7b982304db8b5a140313252306";
  var currentLocation = "Cairo";

  getWeatherForLocation(currentLocation);

  searchInput.addEventListener("input", function () {
    var searchText = this.value.trim();
    if (searchText.length >= 2) {

      searchCitiesDirectly(searchText);
    }
  });

  searchInput.addEventListener("input", function () {
  var searchText = this.value.trim();
  if (searchText.length > 3) {
    currentLocation = searchText;
    getWeatherForLocation(currentLocation);
  }
});


  function searchCitiesDirectly(searchText) {
    var url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchText}`;

    fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network problem");
        }
        return response.json();
      })
      .then(function (cities) {
        
      })
      .catch(function (error) {
        console.log("Search error:", error);
      });
  }

  async function getWeatherForLocation(location) {
    var url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;

    try {
      var response = await fetch(url);
      if (!response.ok) {
        throw new Error("Weather data not available");
      }
      var weatherData = await response.json();
      updateWeatherDisplay(weatherData);
    } catch (error) {
      console.error("Error getting weather data:", error);
      weatherForecast.innerHTML =
        '<div class="col-12 text-center text-danger">Error loading weather data</div>';
    }
  }

  function updateWeatherDisplay(weatherData) {
    document.getElementById("cityName").textContent = `${weatherData.location.name}`;
    
    if (!weatherData.forecast || !weatherData.forecast.forecastday) {
      console.error("No forecast data available");
      return;
    }

    var forecastDays = weatherData.forecast.forecastday;
    var weatherCards = weatherForecast.querySelectorAll(".col-md-4");

    forecastDays.forEach(function (day, index) {
      if (index >= 3) return;

      var date = new Date(day.date);
      var dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      var dayNumber = date.getDate();
      var monthAbbrev = getMonthAbbreviation(date.getMonth());
      var formattedDate = `${dayName} ${dayNumber}${monthAbbrev}`;
      var temp = day.day.avgtemp_c;
      var condition = day.day.condition.text;
      var weatherIconClass = getWeatherIconClass(condition);
      var card = weatherCards[index]?.querySelector(".weather-card");

      if (card) {
        card.querySelector(".card-day").textContent = formattedDate;
        card.querySelector(
          ".weather-icon"
        ).innerHTML = `<i class="${weatherIconClass} fa-3x"></i>`;
        card.querySelector(".card-temp").textContent = `${temp}°C`;
      }
    });
  }

  function getMonthAbbreviation(monthNumber) {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber];
  }

  function getWeatherIconClass(weatherCondition) {
  var condition = weatherCondition.toLowerCase();
  if (condition.includes("sunny") || condition.includes("clear")) {
    return "fa-regular fa-sun"; // Cute Sun
  } else if (condition.includes("cloud")) {
    return "fa-solid fa-cloud"; // Cute Cloud
  } else if (condition.includes("rain")) {
    return "fa-solid fa-cloud-showers-heavy"; // Cute Rain
  } else if (condition.includes("snow")) {
    return "fa-regular fa-snowflake"; // Cute Snow
  } else if (condition.includes("thunder") || condition.includes("storm")) {
    return "fa-solid fa-bolt"; // Lightning
  } else if (condition.includes("fog") || condition.includes("mist")) {
    return "fa-solid fa-smog"; // Cute Mist
  } else {
    return "fa-regular fa-heart"; // Generic cute icon
  }
}

});

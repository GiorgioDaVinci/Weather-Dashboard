// This logic makes sure that the html elements are ready before loading the javascript file
$(document).ready(function () {

  // Loads search history from local storage
  loadSearchHistory();

  // A submit event handler for the form
  $("#search-form").submit(function(event){

    // I added the prevent default submission
    event.preventDefault();

    // This gets user input
    let cityName = $("#search-input").val();

    // This calls the function cityWeather with the user input
    cityWeather(cityName);

    // this adds the city name to search history and saves it to local storage
    addToSearchHistory(cityName);
  });

  // Adding a click event handler for the search history items
  $("#history").on("click", ".history-item", function(){
    let cityName = $(this).text();

    // Calling the function cityWeather to fetch weather data and update UI
    cityWeather(cityName);
  });

  // This function fetches the weather data
  function cityWeather(cityName){
    let APIKey = "c8eb07a44e7175d7747d40acd09c89e0";
  let queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + ",&limit=1&appid=" +
    APIKey;
  
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
  
    .then(function (data) {
      console.log(data);

      // This updates the UI with the weather data
      updateUI(data)
    });
  }

  function updateUI(data) {
    console.log('Received data:', data);
  
    if (data.list.length > 0 && data.city) {
      let cityInfo = data.city;
  
      // Displays city name
      if (cityInfo.name) {
        $("#today").html("<h2>" + cityInfo.name + "</h2>");
      }
  
      // Gets the current date using Day.js
      let currentDate = dayjs().format('MMMM D, YYYY');
  
      // Displays the date and I made it bold using strong
      $("#today").append("<p><strong>Date: " + currentDate + "</strong></p>");
  
      // Assumes that the first item in the list array represents current weather
      let currentWeather = data.list[0];
  
      if (currentWeather && currentWeather.main && currentWeather.wind) {
        // Displays temperature
        if (currentWeather.main.temp) {
          // converts the temperature from Kelvin to Celsius
          let weather = (currentWeather.main.temp) - 273.15
          $("#today").append("<p>Temperature: " + weather.toFixed(2) + "°C</p>");
        }
  
        // Displays humidity 
        if (currentWeather.main.humidity) {
          $("#today").append("<p>Humidity: " + currentWeather.main.humidity + "%</p>");
        }
  
        // Displays wind speed 
        if (currentWeather.wind.speed) {
          $("#today").append("<p>Wind Speed: " + currentWeather.wind.speed + " m/s</p>");
        }

        

        // This display the weather icon
        if(currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].icon){
          let weatherIcon = "<img src='https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png' alt='Weather Icon'>";
          $("#today").append(weatherIcon);
        }
      } else {
        console.error('Missing main or wind property in current weather data.');
      }
      displayForecast(data);
    } else {
      console.error('Invalid data format or empty data.');
    }

  }

  function displayForecast(data){
    console.log("Received data:", data);

    if(data.list && data.list.length > 0){
      let forecastList = data.list;

      $("#forecast").empty();
      $("#forecast").append("<h2 class = text-center> 5-Day Forecast</h2>");
      
      //This variables filters the forecast list for entries with time 12:00:00
      let filteredForecast = forecastList.filter(entry => entry.dt_txt.includes("12:00:00"));
      
      filteredForecast.forEach(function(forecast){
        let forecastDate = dayjs(forecast.dt_txt).format('MM/DD/YYYY');
        let forecastTemperature = (forecast.main.temp-273.15).toFixed(2);
        let forecastHumidity = forecast.main.humidity;
        let forecastWind = forecast.wind.speed;

        let forecastItem = $("<div class='col-md-2 forecast-item border border-primary'></div> ");
        forecastItem.append("<p><strong>Date: " + forecastDate + "</strong></p>");
        forecastItem.append("<p>Temp: " + forecastTemperature + "°C</p>");
        forecastItem.append("<p>Humidity: " + forecastHumidity + "%</p>");
        forecastItem.append("<p>Wind: " + forecastWind + "m/s</p>");

        $("#forecast").append(forecastItem);
        
      });
    }else{
      console.error("Invalid forecast format")
    }
  }
  
  // Adding cities to the search history
  function addToSearchHistory(cityName){

    // This variable creates the history item
    let historyItem = $("<a href='#' class='list-group-item history-item'>" + cityName + "</a>");

    // This will remove older items in history if they are more than 5
    if($("#history .history-item").length>=5){
      $("#history .history-item:last").remove();
    }
  // Adds history item to the history list
  $("#history").prepend(historyItem);

  // Saves search history to local storage
  saveSearchHistory();
  }

function saveSearchHistory(){
  let searchHistory = [];

  // Iterates over the search history item and adds their texts to the search history array

  $("#history .history-item").each(function(){
    searchHistory.push($(this).text());
  });

  // Saves the search history array to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Loads search history from local storage
function loadSearchHistory(){
  let searchHistory = localStorage.getItem("searchHistory");
  if(searchHistory){
    searchHistory = JSON.parse(searchHistory);

    // This iterates over the search history array and adds each item to the search history list
    searchHistory.forEach(function(cityName){
      addToSearchHistory(cityName);
    });
  }
}

});






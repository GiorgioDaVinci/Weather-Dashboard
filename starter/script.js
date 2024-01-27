$(document).ready(function () {

  // A submit event handler for the form
  $("#search-form").submit(function(event){

    // I added the prevent default submission
    event.preventDefault();

    // This gets user input
    let cityName = $("#search-input").val();

    // This calls the function cityWeather with the user input
    cityWeather(cityName);
  });

  // This function fetches the weather data
  function cityWeather(cityName){
    let APIKey = "c8eb07a44e7175d7747d40acd09c89e0";
  let queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + ",&limit=1&appid=" +
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
  
    if ( data.list.length > 0 && data.city) {
      let cityInfo = data.city;
  
      // Displays city name
      if (cityInfo.name) {
        $("#today").html("<h2>" + cityInfo.name + "</h2>");
      }
  
      // Gets the current date using Day.js
      let currentDate = dayjs().format('MMMM D, YYYY');
  
      // Displays the date
      $("#today").append("<p>Date: " + currentDate + "</p>");
  
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
      } else {
        console.error('Missing main or wind property in current weather data.');
      }
    } else {
      console.error('Invalid data format or empty data.');
    }
  }
  
  
  
});






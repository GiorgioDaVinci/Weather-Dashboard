$(document).ready(function () {

  $("#search-form").submit(function(event){
    event.preventDefault();

    var cityName = $("#search-input").val();

    cityWeather(cityName);
  });

  function cityWeather(cityName){
    var APIKey = "c8eb07a44e7175d7747d40acd09c89e0";
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + ",&limit=1&appid=" +
    APIKey;
  
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
  
    .then(function (data) {
      console.log(data);
      updateUI(data)
    });
  }

  function updateUI(data){}
});






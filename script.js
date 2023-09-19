const apiKey = "0b26a0d735f1c68e879212c2650e5b40";
let cities = [];

function getWeather(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            // Use the data to display weather
            displayWeather(data, cityName);
        });
}

function displayWeather(data, cityName) {

    document.getElementById("today").innerHTML = "";


    saveCity(cityName);
}

function saveCity(cityName) {
    if (cities.indexOf(cityName) === -1) {
        cities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
}
// adding event listener 
document.getElementById("search-button").addEventListener("click", function(event) {
    event.preventDefault();
    let city = document.getElementById("search-input").value.trim();
    if (city) {
        getWeather(city);
        document.getElementById("search-input").value = "";
    }
});

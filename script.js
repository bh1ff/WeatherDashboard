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

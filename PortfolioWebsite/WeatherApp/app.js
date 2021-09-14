//API Used : https://openweathermap.org/ and html5 geolocation api
//select elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const UnitElement = document.querySelector(".Unit-conversion button");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//App data store
const weather={};
weather.temperature = {
    unit: "celcius"
}
//App consts and var
const Kelvin = 273;
//API key
const key = "82005d27a116c2880c8f0fcb866998a0";

//check for geolocation support by browser
//using html5 geolocation api 
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);

}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML=" <p>Browser doesn't Support Geolocation </p>";

}

// set user's position
// output of getCurrentPosition will be passed to fn setPosition using a object (i.e., position)
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}
//show error when there's an issue with geolocation service
function showError(error){
    notificationElement.style.display= "block"; //making notification visible
    notificationElement.innerHTML = `<p> ${error.message}</p>`;
}

//get weather from api provider
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    // log api to console to check if working
    console.log(api);
    // open console in browser -- click on the link to see output

    fetch(api)
        .then(function(response){
            let data = response.json();         // fetch api will return a json which will be passed to next function using response object 
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp- Kelvin);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

// display weather 
//changing inner html
function displayWeather(){
    iconElement.innerHTML = `<img src = "icons/${weather.iconId}.png"/>`;  //backtick symbol
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`; 
    UnitElement.innerHTML = "Click here to see in Fahrenheit";
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city} ${weather.country}`;
    
}

//c to F
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5)+32;
}

//when user clicks on the temp element
UnitElement.addEventListener("click", function(){
    if(weather.temperature.value == undefined){
        return;
    }
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        UnitElement.innerHTML = "Click here to see in Celcius";
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        UnitElement.innerHTML = "Click here to see in Farhenheit";
        weather.temperature.unit = "celsius";
    }
});
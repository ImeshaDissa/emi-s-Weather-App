
const api = {
  key: '0a6b5e05c1e27c6bde3dc24a7542f4e3',
  base: 'https://api.openweathermap.org/data/2.5/weather?',
};

const Input = document.getElementById('input');

Input.addEventListener('keypress', (event) => {
    if(event.keyCode == 13) {
        getWeather(Input.value);

        //to display date and time

        const date = moment();
        document.getElementById('date').innerHTML = date.format('Do MMM YYYY dddd, h:mm:ss');

        document.querySelector('.main-weather').style.display = 'block';
    }
});

function getWeather(city) {
    fetch(`${api.base}q=${city}&appid=${api.key}&units=metric`)
    .then((details) => {
        return details.json();
    })
    .then(showWeather)
    .catch((error) => {
        alert("Failed to Fetch Weather Data!");
        console.error(error);
    });
}

function showWeather(details) {
    if(details.cod !== 200) {
        alert("City not found!");
        return;
    }
    //taking receving values from API into this fucntion
    //console.log(details);

    let city = document.getElementById('city');
    city.innerHTML = `${details.name}, ${details.sys.country}`;

    let temperature = document.getElementById('temp');
    temperature.innerHTML = `${Math.round(details.main.temp)}°C`;

    let minMax = document.getElementById('min-max');
    minMax.innerHTML = `${Math.round(
        details.main.temp_min
    )}°C (Min) and ${Math.round(details.main.temp_max)}°C (Max) `;

    let weatherType = document.getElementById('weather-type');
    weatherType.innerHTML = `${details.weather[0].main}`;

    const iconCode = details.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-icon').alt = details.weather[0].description;
}


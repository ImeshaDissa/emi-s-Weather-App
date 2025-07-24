const api = {
  key: '0a6b5e05c1e27c6bde3dc24a7542f4e3',
  base: 'https://api.openweathermap.org/data/2.5/weather?',
  forecast: 'https://api.openweathermap.org/data/2.5/forecast?'
};

const Input = document.getElementById('input');

Input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getWeather(Input.value);
        document.querySelector('.main-weather').style.display = 'block';
    }
});

function getWeather(city) {
    // Fetch current weather
    fetch(`${api.base}q=${city}&appid=${api.key}&units=metric`)
    .then((res) => res.json())
    .then((details) => {
        if (details.cod !== 200) {
            alert("City not found!");
            return;
        }
        showWeather(details);

        // Fetch forecast to get min/max temps
        return fetch(`${api.forecast}q=${city}&appid=${api.key}&units=metric`);
    })
    .then((res) => res.json())
    .then((forecast) => {
        if (!forecast || forecast.cod !== "200") return;

        // Filter today's temps
        const today = new Date().getDate();
        const todayTemps = forecast.list.filter(item => {
            return new Date(item.dt_txt).getDate() === today;
        }).map(item => item.main.temp);

        // Get min/max from today's forecast data
        const minTemp = Math.round(Math.min(...todayTemps));
        const maxTemp = Math.round(Math.max(...todayTemps));

        document.getElementById('min-max').innerHTML =
            `${minTemp}°C (Min) and ${maxTemp}°C (Max)`;
    })
    .catch((error) => {
        alert("Failed to Fetch Weather Data!");
        console.error(error);
    });
}

function showWeather(details) {
    let city = document.getElementById('city');
    city.innerHTML = `${details.name}, ${details.sys.country}`;

    // Show city's local time
    const cityTime = moment.unix(details.dt).utc().add(details.timezone, 'seconds');
    document.getElementById('date').innerHTML = cityTime.format('Do MMM YYYY, dddd, h:mm:ss A');

    let temperature = document.getElementById('temp');
    temperature.innerHTML = `${Math.round(details.main.temp)}°C`;

    let weatherType = document.getElementById('weather-type');
    weatherType.innerHTML = `${details.weather[0].main}`;

    const iconCode = details.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-icon').alt = details.weather[0].description;
}

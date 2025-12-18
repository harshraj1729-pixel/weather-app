async function getWeather() {
    const city = document.getElementById("city").value;
    const result = document.getElementById("result");

    if (!city) {
        result.innerText = "Please enter a city name";
        return;
    }

    // Ask permission for notifications
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    try {
        // 1️⃣ Get coordinates
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            result.innerText = "City not found";
            return;
        }

        const { latitude, longitude } = geoData.results[0];

        // 2️⃣ Get weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const temp = weatherData.current_weather.temperature;
        const wind = weatherData.current_weather.windspeed;

        const weatherInfo = `${city}: ${temp}°C, Wind ${wind} km/h`;

        result.innerText = weatherInfo;

        // 3️⃣ Browser Notification
        new Notification("Weather Update", {
            body: weatherInfo,
            icon: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png"
        });

    } catch (error) {
        result.innerText = "Error fetching weather data";
        console.error(error);
    }
}

const APIs = {
  coordsAPI: (location) =>
    `https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
  weatherAPI: (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`,
};

const fetchUrl = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

const getCoordinates = async (location) => {
  const url = APIs.coordsAPI(location);
  const response = await fetchUrl(url);
  const { lat, lon } = response[0];
  return { lat, lon };
};

const parseForecastData = (data) => {
  return data.time.map((date, i) => ({
    date,
    tempMin: Math.round(data.temperature_2m_min[i]),
    tempMax: Math.round(data.temperature_2m_max[i]),
  }));
};

const getWeatherData = async ({ lat, lon }) => {
  const url = APIs.weatherAPI(lat, lon);
  const { current, current_units, daily, daily_units } = await fetchUrl(url);
  const currentWeather = { units: current_units, data: current };
  const forecast = { units: daily_units, data: parseForecastData(daily) };
  return { currentWeather, forecast };
};

const composeCurrentWeatherMsg = (currentWeather, location, { lat, lon }) => {
  const { data, units } = currentWeather;

  const msg = `
  Location : ${location}
  Latitude : ${lat}
  Longitude : ${lon}
  Date&Time : ${data.time}
  Temperature : ${Math.round(data.temperature_2m)}${units.temperature_2m}
  Wind Speed : ${data.wind_speed_10m}${units.wind_speed_10m}
  Humidity : ${data.relative_humidity_2m}${units.relative_humidity_2m}
  `;
  return msg;
};

const composeForecastMsg = (forecast) => {
  const { temperature_2m_min: tempMinUnit, temperature_2m_max: tempMaxUnit } =
    forecast.units;
  const msgData = forecast.data.map(({ date, tempMin, tempMax }) => [
    date,
    `${tempMin}${tempMinUnit}`,
    `${tempMax}${tempMaxUnit}`,
  ]);
  const msg = msgData.map((el) => el.join("   ")).join("\n");
  return msg;
};

const displayCurrentWeather = (current, location, { lat, lon }) => {
  const msg = composeCurrentWeatherMsg(current, location, { lat, lon });
  console.log(msg);
};

const displayForecast = (forecast) => {
  const forecastMsg = composeForecastMsg(forecast);
  const title = `   Date      Min    Max   `;
  console.log(title);
  console.log(forecastMsg);
};

const main = async () => {
  const location = prompt("Enter location : ");
  let coordinates = {};
  try {
    coordinates = await getCoordinates(location);
  } catch (error) {
    console.log("Please enter a valid location name!");
    main();
    return;
  }
  const { currentWeather, forecast } = await getWeatherData(coordinates);

  displayCurrentWeather(currentWeather, location, coordinates);
  displayForecast(forecast);
};

main();

const APIs = {
  coordsAPI: (location) =>
    `https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
  weatherAPI: (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto&hourly=temperature_2m`,
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

const parseDailyForecast = (data, units) => {
  const dailyData = [];
  const {
    temperature_2m_min: minTempUnit,
    temperature_2m_max: maxTempUnit,
  } = units;

  const { time, temperature_2m_min: minTemp, temperature_2m_max: maxTemp } =
    data;

  for (let i = 0; i < time.length; i++) {
    dailyData.push({
      date: time[i],
      minTemp: `${Math.round(minTemp[i])}${minTempUnit}`.padStart(4, 0),
      maxTemp: `${Math.round(maxTemp[i])}${maxTempUnit}`.padStart(4, 0),
    });
  }
  return dailyData;
};

const parseHourlyTemp = (data, units) => {
  const { time, temperature_2m } = data;
  const { temperature_2m: tempUnit } = units;
  const hours = time.slice(0, 24).map((el) => el.slice(-5));
  const temp = temperature_2m.slice(0, 24).map((el) =>
    `${Math.round(el)}${tempUnit} `.padStart(5, 0)
  );

  return { hours, temp };
};

const createData = (units, data) => {
  return { units, data };
};

const getWeatherData = async ({ lat, lon }) => {
  const url = APIs.weatherAPI(lat, lon);
  const { current, current_units, daily, daily_units, hourly, hourly_units } =
    await fetchUrl(url);

  return {
    currentWeather : createData(current_units,current),
    hourlyForecast : createData(hourly_units, parseHourlyTemp(hourly, hourly_units)),
    dailyForecast : createData(daily_units, parseDailyForecast(daily, daily_units))
  }
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

const composeDailyForecastMsg = (forecast) => {
  const msgData = forecast.data.map(({ date, minTemp, maxTemp }) => [
    date,
    minTemp,
    maxTemp,
  ]);
  const msg = msgData.map((el) => el.join("   ")).join("\n");
  return msg;
};

const composeHourlyForecastMsg = (forecast) => {
  const { data } = forecast;
  const msg = Object.values(data).map((el) => el.join(" ")).join("\n");
  return msg;
};

const displayCurrentWeather = (current, location, { lat, lon }) => {
  const msg = composeCurrentWeatherMsg(current, location, { lat, lon });
  console.log("\n--- Current Weather ---\n");
  console.log(msg);
};

const displayDailyForecast = (forecast) => {
  const forecastMsg = composeDailyForecastMsg(forecast);
  const title = `   Date      Min    Max   `;
  console.log("\n--- Daily Temperature(min, max) ---\n");
  console.log(title);
  console.log(forecastMsg);
};

const displayHourlyForecast = (forecast) => {
  const forecastMsg = composeHourlyForecastMsg(forecast);
  console.log("\n--- Hourly Temperature ---\n");
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
  const { currentWeather, hourlyForecast, dailyForecast } =
    await getWeatherData(coordinates);

  displayCurrentWeather(currentWeather, location, coordinates);
  displayHourlyForecast(hourlyForecast);
  displayDailyForecast(dailyForecast);
};

main();

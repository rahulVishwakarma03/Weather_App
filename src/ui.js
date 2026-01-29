export const takeInput = () => {
  const location = prompt("Enter location : ");
  return location;
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

export const displayCurrentWeather = (current, location, { lat, lon }) => {
  const msg = composeCurrentWeatherMsg(current, location, { lat, lon });
  console.log("\n--- Current Weather ---\n");
  console.log(msg);
};

export const displayDailyForecast = (forecast) => {
  const forecastMsg = composeDailyForecastMsg(forecast);
  const title = `   Date      Min    Max   `;
  console.log("\n--- Daily Temperature(min, max) ---\n");
  console.log(title);
  console.log(forecastMsg);
};

export const displayHourlyForecast = (forecast) => {
  const forecastMsg = composeHourlyForecastMsg(forecast);
  console.log("\n--- Hourly Temperature ---\n");
  console.log(forecastMsg);
};

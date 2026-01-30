import { weatherCodes } from "./utils.js";

export const takeInput = () => {
  const location = prompt("Enter location : ");
  return location;
};

const composeCurrentWeatherMsg = (currentWeather, location) => {
  const { data, units } = currentWeather;

  const msg = `
  desc : ${weatherCodes[data.weather_code]}
  Temperature : ${Math.round(data.temperature_2m)}${units.temperature_2m}
  Wind Speed : ${data.wind_speed_10m}${units.wind_speed_10m}
  Humidity : ${data.relative_humidity_2m}${units.relative_humidity_2m}
  Date&Time : ${data.time}
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
  return data;
};

export const displayCurrentWeather = (current, location, { lat, lon }) => {
  const msg = composeCurrentWeatherMsg(current, location, { lat, lon });
  console.log("\n--- Current Weather ---");
  console.log(msg);
};

export const displayDailyForecast = (forecast) => {
  const forecastMsg = composeDailyForecastMsg(forecast);
  const title = `   Date      Min    Max   `;
  console.log("\n--- 7 days Weather Forecast ---\n");
  console.log(title);
  console.log(forecastMsg);
};

export const displayHourlyForecast = (forecast) => {
  const forecastMsg = composeHourlyForecastMsg(forecast);
  console.log("\n--- Hourly Temperature ---\n");
  console.table(forecastMsg);
};

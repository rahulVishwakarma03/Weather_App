import { APIs } from "./utils.js";

const fetchUrl = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

export const getCoordinates = async (location) => {
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

export const getWeatherData = async ({ lat, lon }) => {
  const url = APIs.weatherAPI(lat, lon);
  const { current, current_units, daily, daily_units, hourly, hourly_units } =
    await fetchUrl(url);

  return {
    currentWeather: createData(current_units, current),
    hourlyForecast: createData(
      hourly_units,
      parseHourlyTemp(hourly, hourly_units),
    ),
    dailyForecast: createData(
      daily_units,
      parseDailyForecast(daily, daily_units),
    ),
  };
};

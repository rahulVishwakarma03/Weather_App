import {
  displayCurrentWeather,
  displayDailyForecast,
  displayHourlyForecast,
  takeInput,
} from "./src/ui.js";
import { getCoordinates, getWeatherData } from "./src/weather.js";

const main = async () => {
  const location = takeInput();
  let coordinates = {};

  try {
    coordinates = await getCoordinates(location);
  } catch (error) {
    console.log(error.message);
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

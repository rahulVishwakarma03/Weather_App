export const APIs = {
  coordsAPI: (location) =>
    `https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
  weatherAPI: (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto&hourly=temperature_2m`,
};

export const weatherCodes = {
  0: "Clear sky",

  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",

  45: "Fog",
  48: "Depositing rime fog",

  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",

  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",

  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",

  66: "Light freezing rain",
  67: "Heavy freezing rain",

  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",

  77: "Snow grains",

  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",

  85: "Slight snow showers",
  86: "Heavy snow showers",

  95: "Thunderstorm (slight or moderate)",

  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};



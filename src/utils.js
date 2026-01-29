export const APIs = {
  coordsAPI: (location) =>
    `https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
  weatherAPI: (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto&hourly=temperature_2m`,
};


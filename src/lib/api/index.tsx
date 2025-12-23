import axios from "axios";

export const GetWeather = async (city: any) => {
  const GetWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appId=f785b82226f9466fa0834e8f6e891c6c`;
  const response = await axios.get(GetWeatherUrl);
  return response?.data;
};
export const GetForecast = async (lat: any, lon: any) => {
  const GetForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appId=f785b82226f9466fa0834e8f6e891c6c`;
  const response = await axios.get(GetForecastUrl);
  return response?.data;
};

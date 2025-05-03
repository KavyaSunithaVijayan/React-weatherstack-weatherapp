import axios from "axios";

export const GetWeather = async (city: any) => {
  const GetWeatherUrl = `https://api.weatherstack.com/current?access_key=4cb148a4bba8b254bed060d5939c9fa7&query=${city}`;
  const response = axios.get(GetWeatherUrl);
  return response;
};

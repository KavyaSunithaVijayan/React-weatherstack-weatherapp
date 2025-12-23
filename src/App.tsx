import { useState, useEffect } from "react";
import { GetForecast, GetWeather } from "./lib/api";
import { BsSearch } from "react-icons/bs";
import Lottie from "lottie-react";
import wind from "./lib/animation/wind.json";
import sun from "./lib/animation/sun.json";
import humidity from "./lib/animation/humidity.json";
import empty_query from "./lib/animation/empty_query.json";
import loader from "./lib/animation/loader.json";
import no_data from "./lib/animation/no_data.json";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [weatherData, setWeatherData] = useState("");
  const [weatherImage, setWeatherImage] = useState("");
  const [weatherForecast, setWeatherForecast] = useState("");
  const [showFahrenheit, setShowFahrenheit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(false);
  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await GetWeather(inputText);
      setWeatherData(response);
      setWeatherImage(
        `http://openweathermap.org/img/wn/${response?.weather[0]?.icon}@2x.png`
      );
      if (response) {
        setError(false);
        const weatherResponse = await GetForecast(
          response.coord.lat,
          response.coord.lon
        );
        setWeatherForecast(weatherResponse);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setInputText("");
    }
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const currentDate = new Date().toLocaleDateString("en-US", options);
    return currentDate;
  };
  const toggleTemperature = () => {
    setShowFahrenheit((prev) => !prev);
  };
   const toCelsius = (f) => ((f - 32) * 5) / 9;

  const temperature = showFahrenheit
    ? `${weatherData?.main?.temp.toFixed(2)}°F`
    : `${toCelsius(weatherData?.main?.temp).toFixed(2)}°C`;

  const convertUnixToTime = (unixTimestamp, timeZone = "Asia/Kolkata") => {
    if (!unixTimestamp) return "-";
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone,
    }).format(new Date(unixTimestamp * 1000));
  };

  const sunriseTime = convertUnixToTime(
    weatherData?.sys?.sunrise,
    "Asia/Kolkata"
  );
  const sunsetTime = convertUnixToTime(
    weatherData?.sys?.sunset,
    "Asia/Kolkata"
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-5 max-h-screen overflow-auto">
      {initialLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white loader_body">
          <h2 className="loader_text">SkyMate</h2>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(255,255,255,0.4)]">
          <Lottie animationData={loader} loop autoplay className="w-64 h-64" />
        </div>
      )}
      <div className="App">
        <div className="flex gap-5 justify-between">
          <div className="w-full">
            <input
              type="text"
              placeholder="Enter city name"
              value={inputText}
              className="bg-white text-sm rounded-lg w-full p-2 focus:outline-none"
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
          <button
            type="submit"
            className="bg-[#84CEF5] hover:bg-white text-white hover:text-[#84CEF5] px-3 py-1 rounded-full focus:outline-none"
            onClick={handleSubmit}
          >
            <BsSearch />
          </button>
        </div>
        {weatherData === "" ? (
          <div className="py-10">
            <Lottie
              animationData={empty_query}
              loop={true}
              autoplay={true}
              className="w-1/2 mx-auto"
            />
            <p className="mt-2 italic text-sm">Search a location!</p>
          </div>
        ) : error ? (
          <div className="py-10">
            <Lottie
              animationData={no_data}
              loop={true}
              autoplay={true}
              className="w-1/2 mx-auto"
            />
            <h1 className="text-sm italic text-center text-[#5E4330]">
              No Data
            </h1>
          </div>
        ) : (
          <div>
            <div className="py-5 ">
              <span className="flex text-2xl font-semibold justify-center">
                {weatherData?.name},{"  "}
                {weatherData?.sys?.country}
              </span>
            </div>
            <span className="flex text-sm italic justify-center">
              {getCurrentDate()}
            </span>
            <div className="flex gap-10 pt-4 sm:pt-7 justify-center">
              <div className="flex gap-5">
                <div className="flex gap-2">
                  <span className="flex justify-center font-semibold items-center">
                    {weatherImage ? (
                      <img src={weatherImage} alt="weather" />
                    ) : null}
                  </span>
                  <button
                    className="font-bold text-2xl sm:text-6xl text-blue-500"
                    onClick={toggleTemperature}
                  >
                    {temperature || 0}
                  </button>
                </div>
              </div>
            </div>
            <span className="text-lg flex justify-center ">
              {weatherData?.weather[0]?.description}
            </span>
            <div className="mx-0 sm:mx-15 pt-5 flex items-center gap-10 sm:gap-20 justify-center">
              <div className="flex items-center">
                <Lottie
                  animationData={wind}
                  loop={true}
                  autoplay={true}
                  className="w-15"
                />
                <div>
                  <span className="text-[15px]">
                    {weatherData?.wind?.speed} m/s
                  </span>
                  <h2 className="text-[10px] text-center">Wind speed</h2>
                </div>
              </div>
              <div className="flex items-center">
                <Lottie
                  animationData={humidity}
                  loop={true}
                  autoplay={true}
                  className="w-18"
                />
                <div>
                  <span className="text-[15px]">
                    {weatherData?.main?.humidity} <span>%</span>
                  </span>
                  <h2 className="text-[10px] text-center">Humidity</h2>
                </div>
              </div>
            </div>
            <div className="mx-0 sm:mx-15 flex items-center gap-10 sm:gap-20 justify-center">
              <Lottie
                animationData={sun}
                loop={true}
                autoplay={true}
                className="w-1/2 h-1/2"
              />
            </div>
            <span className="text-[10px]">{sunriseTime}</span> -{" "}
            <span className="text-[10px]">{sunsetTime}</span>
          </div>
        )}
      </div>
      <p className="fixed bottom-0 italic w-full text-center text-xs sm opacity-50 ">
        Designed and developer by{" "}
        <span className="text-pink-400">Kavya Vijayan</span>
      </p>
    </div>
  );
}

export default App;

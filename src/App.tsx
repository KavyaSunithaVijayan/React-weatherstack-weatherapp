import { useState } from "react";
import { GetWeather } from "./lib/api";
import { BsSearch } from "react-icons/bs";
import Lottie from "lottie-react";
import wind from "./lib/animation/wind.json";
import humidity from "./lib/animation/humidity.json";
import empty_query from "./lib/animation/empty_query.json";
import loader from "./lib/animation/loader.json";
import no_data from "./lib/animation/no_data.json";

function App() {
  const [inputText, setInputText] = useState("");
  const [weatherData, setWeatherData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await GetWeather(inputText);
      setWeatherData(response?.data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    } finally {
      setLoading(false);
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
  return (
    <div className="py-5">
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
              className="bg-white text-sm rounded-lg w-full p-2 focus:outline-none"
              onChange={(e) => setInputText(e.target.value)}
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
        ) : weatherData?.success === false ? (
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
            <div className="py-5">
              <span className="flex text-2xl font-semibold justify-center">
                {weatherData?.request?.query}
              </span>
            </div>
            <span className="flex text-sm italic justify-center">
              {getCurrentDate()}
            </span>
            <div className="flex gap-10 pt-7 pb-5 justify-center">
              <div className="flex gap-5">
                <img
                  src={weatherData?.current?.weather_icons}
                  className="rounded-xl"
                />
                <div className="flex gap-2">
                  <span className="font-bold text-6xl">
                    {weatherData?.current?.temperature | 0}
                  </span>
                  <span className="font-semibold text-lg">°C</span>
                </div>
              </div>
            </div>
            <span className="flex justify-center text-[#F06792] font-semibold">
              {weatherData?.current?.weather_descriptions}
            </span>
            <div className="mx-15 pt-10 flex items-center gap-10 sm:gap-20 justify-center">
              <div className="flex items-center">
                <Lottie
                  animationData={wind}
                  loop={true}
                  autoplay={true}
                  className="w-15"
                />
                <div>
                  <span className="text-[15px]">
                    {weatherData?.current?.wind_speed} <span>m/s</span>
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
                    {weatherData?.current?.humidity} <span>%</span>
                  </span>
                  <h2 className="text-[10px] text-center">Humidity</h2>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

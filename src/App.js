import "./App.css";
import { useState } from "react";
import DarkMode from "./components/dark-mode/darkMode";
import cloud from "./cloud.svg";

const api = {
  key: "10f0d0d29c43074079cd97a954ac0429",
  base: "http://api.openweathermap.org/data/2.5/",
};

const apiStatus = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
};

const App = () => {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState("");
  const [apiResponse, setApi] = useState({
    status: apiStatus.initial,
  });

  /* 
  converting timestamp to date
*/
  const date = new Date(weather.dt * 1000);
  const formattedDate = date.toLocaleString();

  /* 
search function for fetching weather data
*/
  const onSearch = () => {
    let url = `${api.base}weather?q=${search}&units=metric&APPID=${api.key}`;
    try {
      fetch(url)
        .then((res) => res.json())
        .then((result) => setWeather(result));
      setApi((prev) => ({
        ...prev,
        status: apiStatus.success,
        errorMsg: "Successfully fetched weather data",
      }));
      // console.log("err", weather.main);
    } catch (err) {
      setApi((prev) => ({ ...prev, status: apiStatus.failure }));
    }
  };

  /* 
clearing the search value in the input element
*/
  const onClearSearch = () => {
    console.log(search);
    setSearch("");
    setApi((prev) => ({ ...prev, status: apiStatus.initial }));
  };

  /* 
Initial View
*/

  const renderInitialView = () => (
    <p>Search for Weather Data for required city</p>
  );

  /* 
Success View and Failure View
*/
  const renderSuccessOrFailureView = () =>
    weather.main !== undefined ? (
      <div className="display-weather-data">
        {/* location */}
        <p className="location">{weather.name}</p>

        {/* temperature */}
        <p>
          <img className="cloud" src={cloud} alt="cloud" />
          <span className="temp">{weather.main.temp}</span>°C
        </p>

        {/* Date and Time */}
        <p className="date">{formattedDate}</p>
      </div>
    ) : (
      <div>
        <p>City Not Found, Please Search with proper City Name</p>
        <button className="btn" type="button" onClick={onClearSearch}>
          Clear Search
        </button>
      </div>
    );

  /* 
rendering all the possible views using switch case
*/
  const renderWeatherApp = () => {
    switch (apiResponse.status) {
      case apiStatus.initial:
        return renderInitialView();
      case apiStatus.success:
        return renderSuccessOrFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <DarkMode />
        <h1>Weather App</h1>
        {/* search box */}
        <div>
          <input
            className="input"
            type="text"
            value={search}
            placeholder="Enter a City name..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" onClick={onSearch}>
            Search
          </button>
        </div>
        {renderWeatherApp()}
      </header>
    </div>
  );
};

export default App;

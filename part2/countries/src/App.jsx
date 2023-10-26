import { useState, useEffect } from "react";
import axios from "axios";

const SingleCountry = ({ countryData, weatherData }) => {
  console.log("countryData:", countryData);
  console.log("weatherData:", weatherData);
  console.log("countryData boolean:", Boolean(countryData));
  console.log("weatherData boolean:", Boolean(weatherData));
  if (countryData && weatherData) {
    const languagesArray = Object.entries(countryData.languages);
    const flagImage = countryData.flags.png;
    console.log("flagImage:", flagImage);
    return (
      <>
        <h1>{countryData.name.common}</h1>
        <p>capital {countryData.capital}</p>
        <p>area {countryData.area}</p>
        <h2>languages:</h2>
        <ul>
          {languagesArray.map((language) => {
            return <li key={language[1]}>{language[1]}</li>;
          })}
        </ul>
        <p>
          <img src={flagImage} width="200" height="200"></img>
        </p>
        <h2>Weather in {countryData.capital}</h2>
        <p>
          temperature {Math.round((weatherData.main.temp - 273.15) * 100) / 100}{" "}
          Celcius
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        ></img>
        <p>wind {weatherData.wind.speed} m/s</p>
      </>
    );
  }
};

const ListCountry = (listCountry) => {
  return (
    <p>
      {listCountry} <button>show</button>
    </p>
  );
};

const App = () => {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState(null);
  const [commonNames, setCommonNames] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [countryData, setCountryData] = useState(null);
  const [latitude, setLatitude] = useState("null");
  const [longitude, setlongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null); // temperature, wind speed, wind direction, weather icon
  const [errorMessage, setErrorMessage] = useState("");

  // app start cmd: export VITE_SOME_KEY={{your_api_key}}} && npm run dev
  const api_key = import.meta.env.VITE_SOME_KEY;
  console.log("api_key:", api_key);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        const countryKeys = Object.keys(response.data);
        const newCommonNames = countryKeys.map(
          (country) => response.data[country].name.common
        );
        setCommonNames(newCommonNames);
      });
  }, []);

  const handleCountryChange = (event) => {
    console.log("form event change:", event.target.value);
    console.log("event.target.value bool:", Boolean(event.target.value));
    setCountry(event.target.value);
    const newDisplayedCountries = commonNames.filter((commonName) => {
      return commonName
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    console.log("newDisplayedCountries:", newDisplayedCountries);
    if (!event.target.value) {
      console.log("no displayed countries");
      setErrorMessage("");
    } else if (newDisplayedCountries.length > 10) {
      setCountryData(null);
      setErrorMessage("Too many matches, specify another filter");
      setDisplayedCountries([]);
    } else if (newDisplayedCountries.length === 1) {
      setErrorMessage("");
      axios
        .get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${newDisplayedCountries[0]}`
        )
        .then((response) => {
          setDisplayedCountries([]);
          setCountryData(response.data);
          console.log("countryData capital:", response.data.capital[0]);
          const capital = response.data.capital[0];
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
            )
            .then((response) => {
              console.log("Open Weather API response:", response);
              setWeatherData(response.data);
            });
        });
    } else {
      setErrorMessage("");
      const formattedDisplayedCountries = newDisplayedCountries.map(
        (newDisplayedCountry) => newDisplayedCountry + "\n"
      );
      console.log("formattedDisplayedCountries:", formattedDisplayedCountries);
      setDisplayedCountries(formattedDisplayedCountries);
      setCountryData(null);
    }
  };

  const handleButtonClick = (displayedCountry) => {
    setDisplayedCountries([]);
    console.log("displayedCountry from handleButtonClick:", displayedCountry);
    axios
      .get(
        `https://studies.cs.helsinki.fi/restcountries/api/name/${displayedCountry}`
      )
      .then((response) => {
        setCountryData(response.data);
      });
  };

  return (
    <div>
      {console.log("displayedCountries type:", typeof displayedCountries)}
      <form>
        find countries
        <input onChange={handleCountryChange} />
      </form>
      <p>{errorMessage}</p>
      {displayedCountries.map((displayedCountry) => {
        return (
          <p key={displayedCountry}>
            {displayedCountry}
            <button
              onClick={() => {
                console.log("displayedCountry from button:", displayedCountry);
                setDisplayedCountries([]);
                axios
                  .get(
                    `https://studies.cs.helsinki.fi/restcountries/api/name/${displayedCountry}`
                  )
                  .then((response) => {
                    setCountryData(response.data);
                    console.log(
                      "countryData capital:",
                      response.data.capital[0]
                    );
                    const capital = response.data.capital[0];
                    axios
                      .get(
                        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
                      )
                      .then((response) => {
                        console.log("Open Weather API response:", response);
                        setWeatherData(response.data);
                      });
                  });
              }}
            >
              show
            </button>
          </p>
        );
      })}
      <SingleCountry countryData={countryData} weatherData={weatherData} />
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import axios from "axios";

const SingleCountry = ({ countryData }) => {
  console.log("countryData:", countryData);
  console.log("countryData boolean:", Boolean(countryData));
  if (countryData) {
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
  const [errorMessage, setErrorMessage] = useState("");

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
    console.log(event.target.value);
    setCountry(event.target.value);
    const newDisplayedCountries = commonNames.filter((commonName) => {
      return commonName
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    console.log("newDisplayedCountries:", newDisplayedCountries);
    if (newDisplayedCountries.length > 10) {
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
        });
    } else if (newDisplayedCountries.length === 0) {
      setErrorMessage("");
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
          <p>
            {displayedCountry}
            <button
              onClick={() => {
                console.log("displayedCountry from button:", displayedCountry);
                setDisplayedCountries([]);
                axios
                  .get(
                    `https://studies.cs.helsinki.fi/restcountries/api/name/${displayedCountry}`
                  )
                  .then((response) => setCountryData(response.data));
              }}
            >
              show
            </button>
          </p>
        );
      })}
      <SingleCountry countryData={countryData} />
    </div>
  );
};

export default App;

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

const App = () => {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState(null);
  const [commonNames, setCommonNames] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState(null);
  const [countryData, setCountryData] = useState(null);

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
      setDisplayedCountries("Too many matches, specify another filter");
    } else if (newDisplayedCountries.length === 1) {
      axios
        .get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${newDisplayedCountries[0]}`
        )
        .then((response) => {
          setDisplayedCountries(null);
          setCountryData(response.data);
        });
    } else {
      const formattedDisplayedCountries = newDisplayedCountries.map(
        (newDisplayedCountry) => newDisplayedCountry + "\n"
      );
      console.log("formattedDisplayedCountries:", formattedDisplayedCountries);
      setDisplayedCountries(formattedDisplayedCountries);
      setCountryData(null);
    }
  };

  return (
    <div style={{ whiteSpace: "pre-line" }}>
      <form>
        find countries
        <input onChange={handleCountryChange} />
      </form>
      <p>{displayedCountries}</p>
      <SingleCountry countryData={countryData} />
    </div>
  );
};

export default App;

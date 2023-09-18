import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState(null);
  const [commonNames, setCommonNames] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState();

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
      setDisplayedCountries("Too many matches, specify another filter");
    } else {
      const formattedDisplayedCountries = newDisplayedCountries.map(newDisplayedCountry => newDisplayedCountry + '\n');
      // See https://stackoverflow.com/questions/61768544/n-is-not-rendering-the-text-in-new-line as to why this isn't working in HTML
      console.log('formattedDisplayedCountries:', formattedDisplayedCountries);
      setDisplayedCountries(formattedDisplayedCountries);
    }
  };

  return (
    <div>
      <form>
        find countries
        <input onChange={handleCountryChange} />
      </form>
      <p>{displayedCountries}</p>
    </div>
  );
};

export default App;

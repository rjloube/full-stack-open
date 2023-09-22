import { useState, useEffect } from "react";
import axios from "axios";

const SingleCountry = (props) => {
  if (props.displayedCountries.length !== 1) {
    return
  } else {
    return (
      <p>single country here</p>
    )
  }
  // <>
  //   <h1>{props.commonName}</h1>
  //   <p>
  //     capital {props.capital}
  //     area {props.area}
  //   </p>
  //   <h2>languages:</h2>
  //   <ul>
  //     {props.languages.map((language) => (
  //       <li>language</li>
  //     ))}
  //   </ul>
  //   <img>{props.flagImage}</img>
  // </>;
};

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
    if (newDisplayedCountries.length === commonNames.length) {
      setDisplayedCountries();
    } else if (newDisplayedCountries.length > 10) {
      setDisplayedCountries("Too many matches, specify another filter");
    } else if (newDisplayedCountries.length === 1) {
      setDisplayedCountries(newDisplayedCountries);
      axios
        .get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${newDisplayedCountries[0]}`
        )
        .then((response) => {
          console.log("Single country data:", response.data);
        });
    } else {
      const formattedDisplayedCountries = newDisplayedCountries.map(
        (newDisplayedCountry) => newDisplayedCountry + "\n"
      );
      console.log("formattedDisplayedCountries:", formattedDisplayedCountries);
      setDisplayedCountries(formattedDisplayedCountries);
    }
  };

  return (
    <div style={{ whiteSpace: "pre-line" }}>
      <form>
        find countries
        <input onChange={handleCountryChange} />
      </form>
      <p>{displayedCountries}</p>
      {/* <SingleCountry displayedCountries={displayedCountries} /> */}
    </div>
  );
};

export default App;

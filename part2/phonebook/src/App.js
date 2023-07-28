import axios from "axios";
import { useState, useEffect } from "react";

const Filter = ({ handleFilterChange }) => {
  return (
    <p>
      filter shown with <input onChange={handleFilterChange} />
    </p>
  );
};

const PersonForm = ({ addContact, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addContact}>
      <div>
        name: <input onChange={handleNameChange} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ personsToShow }) => {
  return personsToShow.map((person) => (
    <div key={person.name}>
      {person.name} {person.number}
    </div>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [showAll, setShowAll] = useState(true);

  const addContact = (event) => {
    event.preventDefault();
    const contactObject = {
      name: newName,
      number: newNumber,
    };

    const alreadyExists = persons.find(
      (person) => JSON.stringify(person) === JSON.stringify(contactObject)
    );

    if (alreadyExists) {
      alert(`${contactObject.newName} is already added to phonebook`);
    } else {
      axios
        .post("http://localhost:3001/persons", contactObject)
        .then((response) => {
          setPersons(persons.concat(contactObject));
          console.log(response);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const personsToShow =
    newFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addContact={addContact}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;

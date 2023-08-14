import axios from "axios";
import { useState, useEffect } from "react";
import personService from "./services/persons";

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

const Button = ({ text, handleClick }) => {
  <button onClick={handleClick}>{text}</button>;
};

// TODO: Define handleClick here so we can access the right person to delete as function parameter
// Create function in App for modifying persons state, pass in within handleClick function
const Persons = ({ personsToShow, onDelete }) => {
  return personsToShow.map((person) => (
    <div key={person.name}>
      {person.name} {person.number}
      &nbsp;
      <button
        // DO NOT pass in param to OnClick
        onClick={() => {
          if (window.confirm(`Delete ${person.name}?`)) {
            personService.deletePerson(person.id);
            onDelete(person);
          }
        }}
      >
        {person.name}
      </button>
    </div>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
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
    console.log("contactObject:", contactObject);

    const alreadyExists = persons.find((person) => {
      return (
        person.name === contactObject.name &&
        person.number === contactObject.number
      );
    });

    if (alreadyExists) {
      alert(`${contactObject.name} is already added to phonebook`);
    } else {
      personService
        .create(contactObject)
        .then(setPersons(persons.concat(contactObject)));
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

  const onDelete = (personToDelete) => {
    setPersons(persons.filter((person) => person.id !== personToDelete.id));
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
      <Persons personsToShow={personsToShow} onDelete={onDelete} />
    </div>
  );
};

export default App;

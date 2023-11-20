import axios from "axios";
import { useState, useEffect } from "react";
import personService from "./services/persons";
import "./index.css";

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

const Persons = ({ personsToShow, onDelete }) => {
  return personsToShow.map((person) => (
    <div key={person.name}>
      {person.name} {person.number}
      &nbsp;
      <button
        // DO NOT pass in param to OnClick
        onClick={() => {
          if (window.confirm(`Delete ${person.name}?`)) {
            console.log("About to delete:", person.id);
            personService.deletePerson(person.id);
            onDelete(person);
          }
        }}
      >
        delete
      </button>
    </div>
  ));
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="info-message">{message}</div>;
};

const Error = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="error-message">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addContact = (event) => {
    event.preventDefault();
    const contactObject = {
      name: newName,
      number: newNumber,
    };
    console.log("contactObject:", contactObject);

    const alreadyExists = persons.find((person) => {
      return (
        person.name.toLowerCase() === contactObject.name.toLowerCase() &&
        person.number === contactObject.number
      );
    });

    const modifiedPerson = persons.find((person) => {
      if (
        person.name === contactObject.name &&
        person.number !== contactObject.number
      ) {
        return person;
      }
    });

    if (!contactObject.name || !contactObject.number) {
      alert("Name or number missing");
    } else if (alreadyExists) {
      alert(`${contactObject.name} is already added to phonebook`);
    } else if (modifiedPerson) {
      if (
        window.confirm(
          `${contactObject.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .updateNumber(modifiedPerson, contactObject.number)
          .then(() => {
            personService.getAll().then((newPersons) => {
              setPersons(newPersons);
              setNotification(`Modified ${modifiedPerson.name}`);
              setTimeout(() => {
                setNotification(null);
              }, 5000);
            });
          })
          .catch((error) => {
            setError(
              `Information of ${modifiedPerson.name} has already been removed from the server`
            );
            setTimeout(() => {
              setError(null);
            }, 5000);
          });
      }
    } else {
      personService.create(contactObject).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNotification(`Added ${newPerson.name}`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
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
      <Notification message={notification} />
      <Error message={error} />
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

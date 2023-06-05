import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const addContact = (event) => {
    event.preventDefault();
    const contactObject = {
      name: newName,
    };

    const alreadyExists = persons.find(
      (person) => JSON.stringify(person) === JSON.stringify(contactObject)
    );

    if (alreadyExists) {
      alert(`${contactObject.newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(contactObject));
    }
  };

  const handlePhonebookChange = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <div>debug: {newName}</div>
      <h2>Phonebook</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input onChange={handlePhonebookChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <div key={person.name}>{person.name}</div>
      ))}
    </div>
  );
};

export default App;

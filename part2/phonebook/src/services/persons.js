import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  console.log(`Deleting: ${baseUrl}/${id}`);
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updateNumber = (modifiedPerson, newNumber) => {
  console.log('modifiedPerson:', modifiedPerson);
  const putUrl = `${baseUrl}/${modifiedPerson.id}`
  const request = axios.put(putUrl, {
    name: modifiedPerson.name, number: newNumber,
  });
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  deletePerson,
  updateNumber,
};

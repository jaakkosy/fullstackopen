import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'


const PersonForm = ({newName,newNumber, addContact, handlePhonebookName, handlePhonebookNumber}) => {
  return (
    <form onSubmit={addContact}>
        <div>
          name: <input value = {newName}
          onChange={handlePhonebookName}
          />
        </div>
        <div>
          number: <input value = {newNumber}
          onChange={handlePhonebookNumber}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const PersonFilter = ({persons,query,state,setMessage}) => {
  return (
  persons.filter(person => person.name.toLowerCase().includes(query.toLowerCase())).map(person =>
    <Contact singlePerson = {person} key = {person.id} state = {state} persons = {persons} setMessage = {setMessage} />
  ))
}

const Contact = ({singlePerson, state, persons, setMessage}) => {
  return (
    <li>{singlePerson.name} {singlePerson.number} <button onClick={() =>  personDelete(singlePerson.id,singlePerson.name,state, persons, setMessage)}>delete</button> </li>
  )
}

const personDelete = async (id,name,state, persons, setMessage) => {
  if (window.confirm(`Do you really want to delete ${name}?`)) {
  } else {
    return null
  }
  try {
    await personService.deletePerson(`${id}`);
    setMessage(`${name} deleted!`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    state(
      persons.filter((person) => {
        return person.id !== id;
      })
    );
  } catch (error) {
    console.log(error);
  }
};
const SearchForm = ({setQuery}) => {
  return (
  <input type="text" placeholder="Search..." className="Search" onChange = {e=> setQuery(e.target.value)} />   
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)



  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const updateContact = (newName,duplicatePerson,personObject,event) => {
    if (window.confirm(`${newName} is already added in phonebook, replace old number with new one?`)) {
      event.preventDefault()
      personService
        .update(duplicatePerson.id,personObject)
        .then(returnedPerson => {
          personService.getAll().then(initialPersons => {
            setPersons(initialPersons)
          })
          setNewName('')
          setNewNumber('')
          setMessage(`modified ${returnedPerson.name}'s number!`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error)
          setErrorMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
    }
  

  const addContact = (event) => {

    const personObject = {
      name : newName,
      number: newNumber,
      }

    const duplicatePerson = persons.find(person => person.name === newName)

    if (duplicatePerson != null) {
    updateContact(newName,duplicatePerson,personObject,event)
    
    } else {
      event.preventDefault()
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`added ${returnedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch (error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handlePhonebookName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handlePhonebookNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <Error errorMessage={errorMessage} />
      <SearchForm setQuery = {setQuery} />
      <h2>add a new</h2>
      <PersonForm  newName = {newName} newNumber = {newNumber} addContact = {addContact} handlePhonebookName = {handlePhonebookName} handlePhonebookNumber = {handlePhonebookNumber}/>
      <h2>Numbers</h2>
      <ul>
        <PersonFilter persons = {persons} query = {query} state = {setPersons} setMessage = {setMessage} />
      </ul>
    </div>
  )
}

export default App
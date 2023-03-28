import React, { useState, useEffect } from 'react';
import './index.css'


const SearchForm = ({setQuery}) => {
  return (
    <input type="text"className="Search" onChange = {e=> setQuery(e.target.value)} />   
  )
}

const Capital = ({country}) => {
  return (
    <div>capital {country.capital}</div>
  )
}

const Area = ({country}) => {
  return (
    <div>area {country.area}</div>
  )
}

const Languages = ({languages}) => {
  return (
    <>
      {Object.keys(languages).map((keys, index) => (
        <li className="Languages" key={index}>{languages[keys]}</li>
      ))}
    </>
  )
}

const Flag = ({flag}) => {
  return (
    <img src={flag.png} width = "200" height = "200" className='Flag' alt="flag" />
  )
}

const Weather = ({url,country,setWeather,weather, API_KEY}) => {
  useEffect(() => {
    fetch(`${url}weather?q=${country}&units=metric&APPID=${API_KEY}`)
       .then((response) => response.json())
       .then((result) => {
          console.log(result);
          setWeather(result);
       })
       .catch((err) => {
          console.log(err.message);
       });
  }, []);

  if (typeof weather.main != "undefined") {
  
  return (
    
    <>
    <h2>Weather in {weather.name}</h2>
    <p>temperature {weather.main.temp} Celcius</p>
    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon"></img>
    <p>wind {weather.wind.speed} m/s</p>
    </>
  )
  } 
    return ""
}


const CountryFilter = ({query,setQuery,countries,url,setWeather,weather,API_KEY}) => {

  let filteredCount = countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase())).map(country => country.name.common)
  
  if (filteredCount.length > 10) {
    return (
    <div>Too many matches, specify another filter</div>)
  } else if (filteredCount.length === 1) {
    
    return (
      countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase())).map(country =>
        <>
        <h1>{country.name.common}</h1>
         <Capital country = {country} />
         <Area country = {country} />
         <h3>languages:</h3>
         <Languages languages = {country.languages} />
         <Flag flag = {country.flags} />
         <Weather url = {url} country = {country.name.common} setWeather = {setWeather} weather = {weather} API_KEY = {API_KEY} />
         </>
        )
    )
  
  } else if (filteredCount.length > 1 && filteredCount.length < 10)

    return (
    
      countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase())).map(country =>
        <div>
          {country.name.common}
          <button onClick={() => setQuery(country.name.common)}>show</button>
          </div>)
    )
}

const App = () => {
  const API_KEY = process.env.REACT_APP_API_KEY
  const url = "https://api.openweathermap.org/data/2.5/"

  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState({});



  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
       .then((response) => response.json())
       .then((data) => {
          console.log(data);
          setCountries(data);
       })
       .catch((err) => {
          console.log(err.message);
       });
  }, []);

  return (
  <div>
    <>find countries</>
    <SearchForm setQuery = {setQuery} />
    <CountryFilter query = {query} setQuery = {setQuery} countries = {countries} url = {url} setWeather = {setWeather} weather = {weather} API_KEY = {API_KEY} />
  </div>
  )

}

export default App
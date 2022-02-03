const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')

require('dotenv').config()


// Start express
const app = express()

// Port
const port =  process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App is listening at: http://localhost:${port}`)
})

// Setting up the server 

app.use(express.static('public'))
app.use(express.json({
  limit: '300mb'
}))

// define and load the database

const database = new Datastore('database/database.db')
database.loadDatabase()

// Responsible for getting weather and aqi data and sending it to the client
app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  //console.log(latlon)

  // Api Keys
  const weatherApiKey = process.env.API_KEY_WEATHER
  const aqiApiKey = process.env.API_KEY_AQI

  // Request for weather
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latlon[0]}&lon=${latlon[1]}&appid=${weatherApiKey}`
  const weatherResponse = await fetch(weatherUrl)
  const weatherData = await weatherResponse.json()
  
  // Request for AQI
  const aqiUrl = `https://api.waqi.info/feed/geo:${latlon[0]};${latlon[1]}/?token=${aqiApiKey}`
  const aqiResponse = await fetch(aqiUrl)
  const aqiData = await aqiResponse.json()


  const data = {
    weather: weatherData,
    aqi: aqiData
  }

  res.json(data)
})

// Responsible for Database API ( POST / Insert data in database)

app.post('/api', (req, res) => {
  const data = req.body
  //console.log(data)
  data.timestamp = Date.now()

  database.insert(data)
  data.success = true
  res.json(data)
})

// Responsible for Database API ( GET / Read data from database)

app.get('/api', (req, res) => {
  // Send the information from the database to the client as is

  database.find({}, (err, data) => {
    if (err) {
      console.error(err)
      res.end()
    } else {
      console.log('Server is sending data to the client')
      res.json(data)
    }
  })
})
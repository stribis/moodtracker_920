function setup () {


  // Disable p5js Canvas
  noCanvas()

  // Capture video
  const video = createCapture()
  video.parent('main-container')
  video.size(320, 240)

  let lat, lon, city, temperature, description, aqi
  // Test if geolocation is available
  if ('geolocation' in navigator) {
    //console.log(navigator)

    navigator.geolocation.getCurrentPosition( async position => {

      try {
        // console.log(position)
        // We have the user's location
        lat = position.coords.latitude
        lon = position.coords.longitude

        // Prepare the url for the weather endpoint
        const apiUrl = `weather/${lat},${lon}`

        // Gather response from server
        const response = await fetch(apiUrl)
        const json = await response.json()


        console.log(json)
        city = json.weather.name
        temperature = json.weather.main.temp
        description = json.weather.weather[0].description
        aqi = json.aqi.data.aqi

        const template = `
        <div class="more_info">
          <div>${temperature}</div>
          <div>${description}</div>
          <hr>
          <div>${city}</div>
          <div><span>Lat: ${lat}</span><span>Lon: ${lon}</span></div>
          <div>AQI: ${aqi}</div>
        </div>
        `

        const weatherDiv = document.createElement('div')
        weatherDiv.innerHTML = template
        document.querySelector('main').append(weatherDiv)


      } catch (error) {
        console.error(error)
      }

      



    } )

  } else {
    console.error('Geolocation is not supported')
  }

  // What happens after the user clicks send
  document.querySelector('form button').addEventListener('click', async e => {
    e.preventDefault()

    // Reset Messages
    if (document.querySelector('.success-message')) document.querySelector('.success-message').remove()
    if (document.querySelector('.error-message')) document.querySelector('.error-message').remove()

    // Read input text
    const mood = document.querySelector('form input').value

    // Get current image
    video.loadPixels()
    const image64 = video.canvas.toDataURL()


    // Remember AQI
    const data = {
      mood,
      city,
      temperature,
      description,
      aqi,
      image64
    }

    // Fetch post
    const options = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const response = await fetch('/api', options)
    const json = await response.json()

    // console.log(json)

    if ( json.success ) {
      const message = document.createElement('span')
      message.classList.add('success-message')
      message.innerText = 'Your mood has been added'
      document.querySelector('form').after(message)
    } else {
      const message = document.createElement('span')
      message.classList.add('error-message')
      message.innerText = 'There was an error, please try again.'
      document.querySelector('form').after(message)
    }

  })
}


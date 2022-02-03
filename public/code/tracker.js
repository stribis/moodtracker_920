fetchData()
async function fetchData() {

  // Use fetch to get data from api
  const response = await fetch('/api')
  const data = await response.json()

  console.log(data)

  // Generate a template for the data
  data.forEach( entry => {
    const container = document.createElement('div')

    container.innerHTML = `
    <div>${entry.mood}</div>
    <div>${entry.aqi}</div>
    `

    document.querySelector('section').append(container)
  })

}
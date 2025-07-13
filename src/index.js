import './style.css'

const place = document.querySelector('.place')
const weatherIcon = document.querySelector('.overall-weather-icon')
const temp = document.querySelector('.temp')
const tempFeels = document.querySelector('.temp-feel')
const cloudCondition = document.querySelector('.cloud-condition')
const wind = document.querySelector('.wind-measurement')
const humdity = document.querySelector('.humdity-measurement')
const rain = document.querySelector('.rain-measurement')

let city = 'lagos'

async function getWeather() {
  try {
    const apiKey = '8409f078b588400595c175418251107'

    const fetchWeather =
      await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no
`)
    if (!fetchWeather.ok) {
      // Check for HTTP errors like 400 (Bad Request for invalid city)
      const errorData = await fetchWeather.json()
      throw new Error(
        `HTTP error! Status: ${fetchWeather.status}. Message: ${errorData.error.message || 'Unknown error'}`
      )
    }

    const WeatherJson = await fetchWeather.json()
    return {
      WeatherJson
    }
  } catch (error) {
    console.log('Failed to get weather data:', error)
    alert(
      `Could not fetch weather for "${city}". Please check the city name or your internet connection.`
    )
    place.textContent = 'Error'
    temp.textContent = '--'
    cloudCondition.textContent = 'Failed to load weather'

    const hourlyWeather = document.querySelector('.hourly-weather')

    if (hourlyWeather) {
      hourlyWeather.innerHTML = ''
    }
    throw error
  }
}

async function getHourlyForeCast() {
  try {
    const { WeatherJson } = await getWeather()
    const forecastWeather = await WeatherJson.forecast
    const hourlyData = forecastWeather.forecastday[0].hour

    const hourlyWeather = document.querySelector('.hourly-weather')

    if (hourlyWeather) {
      hourlyWeather.innerHTML = ''
    }

    const now = new Date()
    const currentHour = now.getHours()
    console.log(currentHour)

    const startIndex = hourlyData.findIndex(item => {
      const itemHour = new Date(item.time).getHours()
      return itemHour === currentHour
    })

    let upcomingHourlyData = []

    if (startIndex !== -1) {
      const remainingHoursToday = hourlyData.slice(startIndex)
      upcomingHourlyData = remainingHoursToday
      console.log(upcomingHourlyData)
    } else {
      console.warn(
        'Could not find current hour in the forecast data. Displaying from the begining of the day'
      )
      upcomingHourlyData = hourlyData
    }

    upcomingHourlyData.forEach(hour => {
      const upcomingHourlyDataContainer = document.createElement('div')

      upcomingHourlyDataContainer.classList.add('hourlyDataContainer')

      const hourlyDataTemp = document.createElement('p')
      hourlyDataTemp.textContent = `${hour.temp_c}°C`

      const hourlyWeatherIcon = document.createElement('img')
      hourlyWeatherIcon.classList.add('hourly-weather-icon')
      hourlyWeatherIcon.src = hour.condition.icon

      const hourlyDataTime = document.createElement('p')
      hourlyDataTime.textContent = `${new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`

      upcomingHourlyDataContainer.appendChild(hourlyDataTemp)
      upcomingHourlyDataContainer.appendChild(hourlyWeatherIcon)
      upcomingHourlyDataContainer.appendChild(hourlyDataTime)

      hourlyWeather.appendChild(upcomingHourlyDataContainer)
    })
  } catch (error) {
    console.log(`Failed to fetch hourly forecast data: ${error}`)
    const hourlyWeather = document.querySelector('.hourly-weather')

    if (hourlyWeather) {
      hourlyWeather.innerHTML = 'Hourly data is not available at the moment'
    }
  }
}

async function displayWeather() {
  try {
    const { WeatherJson } = await getWeather()
    const currentWeather = await WeatherJson.current
    const forecastWeather = await WeatherJson.forecast
    const weatherLocation = await WeatherJson.location
    console.log(currentWeather)
    console.log(forecastWeather)
    console.log(weatherLocation)

    place.textContent = `${weatherLocation.name}`
    console.log(place)
    weatherIcon.src = currentWeather.condition.icon
    temp.textContent = `${currentWeather.temp_c}°C`
    tempFeels.textContent = `Feels like ${currentWeather.feelslike_c}°C`
    cloudCondition.textContent = currentWeather.condition.text
    wind.textContent = `${currentWeather.wind_kph} km/h`
    humdity.textContent = `${currentWeather.humidity} %`
    rain.textContent = `${forecastWeather.forecastday[0].day.daily_chance_of_rain} % `

    getHourlyForeCast()
  } catch (err) {
    console.log(`Failed to display weather data:`, err)
    // city = 'lagos'
  }
}

const searchBtn = document.querySelector('.search-btn')

function fetchValue(e) {
  e.preventDefault()
  const locationInput = document.getElementById('search')
  const newCity = locationInput.value.trim()
  if (newCity && newCity !== city) {
    city = newCity
    console.log(`searching for: ${city}`)
    displayWeather()
  } else if (!newCity) {
    alert('Please enter a city name.')
  }
  locationInput.value = ''
}

const locationInput = document.getElementById('search')
locationInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    fetchValue(e)
  }
})

searchBtn.addEventListener('click', fetchValue)

displayWeather()

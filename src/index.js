import './style.css'

const placeSpanContainer = document.querySelector('.place-span')
const weatherIcon = document.querySelector('.overall-weather-icon')
const temp = document.querySelector('.temp')
const tempFeels = document.querySelector('.temp-feel')
const cloudCondition = document.querySelector('.cloud-condition')
const wind = document.querySelector('.wind-measurement')
const humdity = document.querySelector('.humdity-measurement')
const rain = document.querySelector('.rain-measurement')
const sunrise = document.querySelector('.sunrise-time')
const sunset = document.querySelector('.sunset-time')
const moonrise = document.querySelector('.moonrise-time')
const moonset = document.querySelector('.moonset-time')

let city = 'lagos'

const loadingScreen = document.querySelector('.loading-screen')
const container = document.querySelector('.container')

setTimeout(() => {
  loadingScreen.style.display = 'none'
  container.style.display = 'block'
}, 3000)

const dailyForecast = document.querySelector('.daily-forecast')
const homeContainer = document.querySelector('.home-container')
const savedLocation = document.querySelector('.saved-location')

const homeButton = document.querySelector('.home')
const dailyForecastButton = document.querySelector('.days-forecast')
const savedLocationButton = document.querySelector('.saved')

homeButton.addEventListener('click', () => {
  dailyForecast.style.display = 'none'
  savedLocation.style.display = 'none'
  homeContainer.style.display = 'block'
  homeButton.classList.add('fill')
  dailyForecastButton.classList.remove('fill')
  savedLocationButton.classList.remove('fill')
})

dailyForecastButton.addEventListener('click', () => {
  homeContainer.style.display = 'none'
  savedLocation.style.display = 'none'
  dailyForecast.style.display = 'block'
  dailyForecastButton.classList.add('fill')
  homeButton.classList.remove('fill')
  savedLocationButton.classList.remove('fill')
})

savedLocationButton.addEventListener('click', () => {
  homeContainer.style.display = 'none'
  dailyForecast.style.display = 'none'
  savedLocation.style.display = 'block'
  savedLocationButton.classList.add('fill')
  dailyForecastButton.classList.remove('fill')
  homeButton.classList.remove('fill')
})

async function getWeather() {
  try {
    const apiKey = '8409f078b588400595c175418251107'
    const numberOfDays = 7

    const fetchWeather =
      await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${numberOfDays}&aqi=no&alerts=no
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

const weatherBackgrounds = {
  // ☀️ Clear
  1000: 'clear-sky.jpg',

  // ☁️ Clouds
  1003: 'partly-cloudy.jpg',
  1006: 'cloudy-sky.jpg',
  1009: 'overcast.jpg',

  // 🌧️ Rain
  1063: 'rain.jpeg',
  1180: 'rain.jpeg',
  1183: 'rain.jpeg',
  1186: 'rain.jpeg',
  1189: 'rain.jpeg',
  1192: 'heavy-rain.jpeg',
  1195: 'heavy-rain.jpeg',
  1201: 'heavy-rain.jpeg',
  1240: 'rain.jpeg',
  1243: 'rain.jpeg',
  1246: 'heavy-rain.jpeg',

  // ❄️ Snow
  1066: 'snow.jpg',
  1114: 'snow.jpg',
  1117: 'snow.jpg',
  1210: 'snow.jpg',
  1213: 'snow.jpg',
  1216: 'moderate-snow.jpg',
  1219: 'snow.jpg',
  1222: 'snow.jpg',
  1225: 'snow.jpg',
  1237: 'snow.jpg',
  1255: 'snow.jpg',
  1258: 'snow.jpg',

  // ⚡ Thunderstorms
  1087: 'thunderstorm.jpg',
  1273: 'thunderstorm.jpg',
  1276: 'thunderstorm.jpg',
  1279: 'snow-thunder.jpg',
  1282: 'snow-thunder.jpg',

  // 🌫️ Fog / Mist
  1030: 'fog.jpeg',
  1135: 'fog.jpeg',
  1147: 'fog.jpeg',

  // 🧊 Ice / Freezing Rain
  1072: 'freezing-rain.jpeg',
  1150: 'freezing-rain.jpeg',
  1153: 'freezing-rain.jpeg',
  1168: 'freezing-rain.jpeg',
  1171: 'freezing-rain.jpeg',

  // Fallback
  default: 'default.jpg'
}

function setBackground(filename) {
  container.style.backgroundImage = `url("images/${filename}")`
  container.style.backgroundPosition = 'center'
  container.style.backgroundSize = 'cover'
  container.style.backgroundRepeat = 'no-repeat'
}

async function displayWeather() {
  try {
    const { WeatherJson } = await getWeather()
    const currentWeather = await WeatherJson.current
    const forecastWeather = await WeatherJson.forecast
    const weatherLocation = await WeatherJson.location

    try {
      const { code } = currentWeather.condition
      console.log('code', code)

      const bg = weatherBackgrounds[code] || weatherBackgrounds.default
      console.log(bg)
      setBackground(bg)
    } catch (error) {
      console.log('Failed to display weather image: ', error)
      setBackground(weatherBackgrounds.default)
    }

    const astronomyTime = forecastWeather.forecastday[0].astro
    console.log(currentWeather)
    console.log(forecastWeather)
    console.log(weatherLocation)

    placeSpanContainer.innerHTML = ''
    const placeSpan = document.createElement('span')

    placeSpan.textContent = `${weatherLocation.name}, ${weatherLocation.country}`
    placeSpanContainer.appendChild(placeSpan)
    console.log(placeSpanContainer)
    weatherIcon.src = currentWeather.condition.icon
    temp.textContent = `${currentWeather.temp_c}°C`
    tempFeels.textContent = `Feels like ${currentWeather.feelslike_c}°C`
    cloudCondition.textContent = currentWeather.condition.text
    wind.textContent = `${currentWeather.wind_kph} km/h`
    humdity.textContent = `${currentWeather.humidity} %`
    rain.textContent = `${forecastWeather.forecastday[0].day.daily_chance_of_rain} % `
    sunrise.textContent = astronomyTime.sunrise
    sunset.textContent = astronomyTime.sunset
    moonrise.textContent = astronomyTime.moonrise
    moonset.textContent = astronomyTime.moonset

    getHourlyForeCast()
  } catch (err) {
    console.log(`Failed to display weather data:`, err)
  }
}

const searchBtn = document.querySelector('#search-btn')

function fetchValue(e) {
  e.preventDefault()
  const locationInput = document.getElementById('search')
  const newCity = locationInput.value.trim()
  if (newCity && newCity !== city) {
    city = newCity
    console.log(`searching for: ${city}`)
    displayWeather()
    getDailyForecast()
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

async function getDailyForecast() {
  try {
    const { WeatherJson } = await getWeather()
    const forecastWeather = await WeatherJson.forecast
    const tomorrowForecastData = await forecastWeather.forecastday[1]
    console.log('tomorrow', tomorrowForecastData)
    // const tomorrowForecast = document.querySelector('.tomorrow-forecast')

    const tomorrowWeatherIcon = document.querySelector('.tomorrow-weather-icon')
    tomorrowWeatherIcon.src = await tomorrowForecastData.day.condition.icon

    const tomorrowTemp = document.querySelector('.tomorrow-temp')
    tomorrowTemp.textContent = await tomorrowForecastData.day.avgtemp_c

    const tomorrowTempFeel = document.querySelector('.tomorrow-temp-feel')
    tomorrowTempFeel.textContent = `Max temperature: ${await tomorrowForecastData.day.maxtemp_c}°C`

    const tomorrowCloud = document.querySelector('.tomorrow-cloud')
    tomorrowCloud.textContent = await tomorrowForecastData.day.condition.text

    const tomorrowWind = document.querySelector('.tomorrow-wind-measurement')
    tomorrowWind.textContent = `${await tomorrowForecastData.day
      .maxwind_kph} km/h`

    const tomorrowHumidity = document.querySelector(
      '.tomorrow-humidity-measurement'
    )
    tomorrowHumidity.textContent = `${tomorrowForecastData.day.avghumidity}%`

    const tomorrowRain = document.querySelector('.tomorrow-rain-measurement')
    tomorrowRain.textContent = `${await tomorrowForecastData.day.daily_will_it_rain}%`

    const upcomingDailyForecast = []

    for (let i = 2; i < forecastWeather.forecastday.length; i++) {
      upcomingDailyForecast.push(forecastWeather.forecastday[i])
    }

    const nextForecast = document.querySelector('.next-forecast')
    if (nextForecast) {
      nextForecast.innerHTML = ''
    }

    upcomingDailyForecast.forEach(day => {
      const dailyDiv = document.createElement('div')
      dailyDiv.classList.add('daily')

      const date = new Date(day.date)
      const formatted = date.toLocaleDateString('en-US', { weekday: 'short' })
      const iconLink = day.day.condition.icon
      const cloudCondition = day.day.condition.text
      const temp = day.day.avgtemp_c

      const firstDayPara = document.createElement('p')
      firstDayPara.textContent = formatted

      const dayDiv = document.createElement('div')
      const dayImg = document.createElement('img')
      dayImg.src = iconLink
      const daySpan = document.createElement('span')
      daySpan.textContent = cloudCondition
      dayDiv.appendChild(dayImg)
      dayDiv.appendChild(daySpan)

      const secondDayPara = document.createElement('p')
      secondDayPara.textContent = `${temp}°C`
      secondDayPara.classList.add('daily-temp')

      dailyDiv.appendChild(firstDayPara)
      dailyDiv.appendChild(dayDiv)
      dailyDiv.appendChild(secondDayPara)

      nextForecast.appendChild(dailyDiv)
    })

    console.log('upcomingDailyForecast: ', upcomingDailyForecast)

    // const new
  } catch (error) {
    console.log('Failed to get daily forecast', error)
  }
}

getDailyForecast()

// async function getSavedLocationForecast() {
//   try {
//     const { WeatherJson } = await getWeather()
//     const forecastWeather = await WeatherJson.forecast

//     const locations = document.querySelectorAll('.location')
//     locations.forEach(location => {
//       const savedCity = document.querySelector(
//         '.location > .city-wrapper > .city'
//       )
//       console.log('saved city!', savedCity.innerHTML)
//     })
//   } catch (error) {
//     console.log('Failed to get weather for saved location', error)
//   }
// }

// getSavedLocationForecast()

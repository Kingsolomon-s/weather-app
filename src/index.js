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

const homeButton = document.querySelector('.home')
const dailyForecastButton = document.querySelector('.days-forecast')
const savedLocationButton = document.querySelector('.saved')

function showContainer(containerToShow) {
  const containers = [
    document.querySelector('.home-container'),
    document.querySelector('.daily-forecast'),
    document.querySelector('.saved-location')
  ]

  containers.forEach(container => {
    container.style.display = 'none'
  })

  containerToShow.style.display = 'block'

  containerToShow.scrollTop = 0
  containerToShow.scrollIntoView({ behaviour: 'instant', block: 'start' })
}

homeButton.addEventListener('click', () => {
  showContainer(document.querySelector('.home-container'))
  homeButton.classList.add('fill')
  dailyForecastButton.classList.remove('fill')
  savedLocationButton.classList.remove('fill')
})

dailyForecastButton.addEventListener('click', () => {
  showContainer(document.querySelector('.daily-forecast'))
  dailyForecastButton.classList.add('fill')
  homeButton.classList.remove('fill')
  savedLocationButton.classList.remove('fill')
})

savedLocationButton.addEventListener('click', () => {
  showContainer(document.querySelector('.saved-location'))
  savedLocationButton.classList.add('fill')
  dailyForecastButton.classList.remove('fill')
  homeButton.classList.remove('fill')
})

async function getWeather(cityToFetch = city) {
  const apiKey = '8409f078b588400595c175418251107'
  const numberOfDays = 7

  try {
    const fetchWeather =
      await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityToFetch}&days=${numberOfDays}&aqi=no&alerts=no
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

    setTimeout(() => {
      alert(
        `Could not fetch weather for "${city}". Please check the city name or your internet connection.`
      )
    }, 3500)

    placeSpanContainer.textContent = 'Error'
    temp.textContent = '--'
    cloudCondition.textContent = 'Failed to load weather'

    const hourlyWeather = document.querySelector('.hourly-weather')

    if (hourlyWeather) {
      hourlyWeather.innerHTML = ''
    }
    throw error
  }
}

async function getHourlyForeCast(WeatherJson) {
  try {
    const forecastWeather = WeatherJson.forecast
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

async function getDailyForecast(forecastWeatherJson) {
  try {
    const forecastWeather = forecastWeatherJson
    const tomorrowForecastData = await forecastWeather[1]
    console.log('tomorrow', tomorrowForecastData)

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

    for (let i = 2; i < forecastWeather.length; i++) {
      upcomingDailyForecast.push(forecastWeather[i])
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
      const dailyCloudCondition = day.day.condition.text
      const dailyTemp = day.day.avgtemp_c

      const firstDayPara = document.createElement('p')
      firstDayPara.textContent = formatted

      const dayDiv = document.createElement('div')
      dayDiv.classList.add('day-div')
      const dayImg = document.createElement('img')
      dayImg.src = iconLink
      const daySpan = document.createElement('span')
      daySpan.classList.add('day-span')
      daySpan.textContent = dailyCloudCondition
      dayDiv.appendChild(dayImg)
      dayDiv.appendChild(daySpan)

      const secondDayPara = document.createElement('p')
      secondDayPara.textContent = `${dailyTemp}°C`
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

  default: 'default.jpg'
}

function setBackground(filename) {
  document.body.style.backgroundImage = `url("images/${filename}")`
  document.body.style.backgroundPosition = 'center'
  document.body.style.backgroundSize = 'cover'
  document.body.style.backgroundRepeat = 'no-repeat'
}

async function displayWeather(cityToDisplay = city) {
  try {
    const { WeatherJson } = await getWeather(cityToDisplay)
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

    getHourlyForeCast(WeatherJson)
    getDailyForecast(forecastWeather.forecastday)
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
    displayWeather(city)
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

displayWeather(city)

async function getSavedLocationForecast() {
  try {
    const locations = document.querySelectorAll('.location')

    const fetchPromises = Array.from(locations).map(async locationDiv => {
      const savedCitySpan = locationDiv.querySelector(
        '.city-wrapper > .city-name'
      )
      if (!savedCitySpan) {
        console.warn(
          'Could not find .city-name span inside .location element. Skipping this location'
        )

        return null
      }

      const savedCityName = savedCitySpan.textContent.trim()
      console.log('saved city name', savedCityName)
      if (!savedCityName) {
        console.warn('City name is empty for saved location. Skipping.')
        return null
      }

      try {
        const { WeatherJson } = await getWeather(savedCityName)
        const currentWeatherData = WeatherJson.current
        const locationWeatherData = WeatherJson.location

        const savedLocationTemp = locationDiv.querySelector(
          '.saved-location-temp'
        )
        const savedLocationIcon = locationDiv.querySelector(
          '.saved-location-icon > img'
        )
        const savedLocationCondition = locationDiv.querySelector(
          '.saved-location-condition'
        )
        const savedLocationTime = locationDiv.querySelector(
          '.saved-location-time'
        )

        if (savedLocationTemp) {
          savedLocationTemp.textContent = `${currentWeatherData.temp_c}°C`
          console.log('temp', savedLocationTemp)
        }
        if (savedLocationIcon) {
          savedLocationIcon.src = currentWeatherData.condition.icon
          savedLocationIcon.alt = currentWeatherData.condition.text
        }
        if (savedLocationCondition) {
          savedLocationCondition.textContent = currentWeatherData.condition.text
        }
        if (savedLocationTime && locationWeatherData.localtime) {
          const timeDate = new Date(locationWeatherData.localtime)
          const timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: locationWeatherData.tz_id,
            timeZoneName: 'shortOffset'
          })
          savedLocationTime.textContent = timeFormatter.format(timeDate)
        }
      } catch (error) {
        console.log('Failed to get weather for saved location', error)
        if (savedCitySpan) {
          const errorElem = document.createElement('p')
          errorElem.textContent = 'Error loading data'
          errorElem.style.color = 'red'
          locationDiv.appendChild(errorElem)
        }
      }

      locationDiv.addEventListener('click', () => {
        displayWeather(savedCityName)
        showContainer(document.querySelector('.home-container'))
        homeButton.classList.add('fill')
        dailyForecastButton.classList.remove('fill')
        savedLocationButton.classList.remove('fill')
      })

      return null
    })

    await Promise.all(fetchPromises)
    console.log('All saved location forecasts updated')
  } catch (error) {
    console.error(`Error loading saved locations data`, error)
    alert(
      `Could not fetch weather for ${city}. Please check your internet connection`
    )
  }
}

getSavedLocationForecast()

function addCityToSavedLocation(e) {
  e.preventDefault()

  const locationWrapper = document.querySelector('.location-wrapper')

  let savedSearch = document.getElementById('saved-search')
  const input = savedSearch.value

  const location = document.createElement('div')
  location.classList.add('location')

  const cityWrapper = document.createElement('div')
  cityWrapper.classList.add('city-wrapper')

  const cityName = document.createElement('p')
  cityName.classList.add('big-text')
  cityName.classList.add('city-name')
  cityName.textContent = input

  const savedLocationIcon = document.createElement('span')
  savedLocationIcon.classList.add('saved-location-icon')
  const img = document.createElement('img')
  savedLocationIcon.appendChild(img)

  const flexSpan = document.createElement('span')
  flexSpan.classList.add('flex-span')

  const savedLocationCondition = document.createElement('span')
  savedLocationCondition.classList.add('saved-location-condition')

  const savedLocationTime = document.createElement('span')
  savedLocationTime.classList.add('saved-location-time')

  flexSpan.appendChild(savedLocationCondition)
  flexSpan.appendChild(savedLocationTime)

  cityWrapper.appendChild(cityName)
  cityWrapper.appendChild(savedLocationIcon)
  cityWrapper.appendChild(flexSpan)

  const savedLocationTemp = document.createElement('div')
  savedLocationTemp.classList.add('saved-location-temp')

  location.appendChild(cityWrapper)
  location.appendChild(savedLocationTemp)

  locationWrapper.appendChild(location)

  savedSearch = ''

  getSavedLocationForecast()
}

const savedSearchBtn = document.getElementById('saved-search-btn')

savedSearchBtn.addEventListener('click', addCityToSavedLocation)

const savedSearch = document.getElementById('saved-search')
savedSearch.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    addCityToSavedLocation(e)
  }
})

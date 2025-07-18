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

const mainSearchSuggestionContainer = document.getElementById(
  'main-search-suggestions'
)

const savedSearchSuggestionsContainer = document.getElementById(
  'saved-search-suggestions'
)

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
  1000: 'clear-sky.svg',

  // ☁️ Clouds
  1003: 'partly-cloudy.svg',
  1006: 'overcast.svg',
  1009: 'overcast.svg',

  // 🌧️ Rain
  1063: 'rain.svg',
  1180: 'rain.svg',
  1183: 'rain.svg',
  1186: 'rain.svg',
  1189: 'rain.svg',
  1192: 'heavy-rain.svg',
  1195: 'heavy-rain.svg',
  1201: 'heavy-rain.svg',
  1240: 'rain.svg',
  1243: 'rain.svg',
  1246: 'heavy-rain.svg',

  // ❄️ Snow
  1066: 'snow.svg',
  1114: 'snow.svg',
  1117: 'snow.svg',
  1210: 'snow.svg',
  1213: 'snow.svg',
  1216: 'snow.svg',
  1219: 'snow.svg',
  1222: 'snow.svg',
  1225: 'snow.svg',
  1237: 'snow.svg',
  1255: 'snow.svg',
  1258: 'snow.svg',

  // ⚡ Thunderstorms
  1087: 'thunderstorm.svg',
  1273: 'thunderstorm.svg',
  1276: 'thunderstorm.svg',
  1279: 'snow-thunder.jpg',
  1282: 'snow-thunder.jpg',

  // 🌫️ Fog / Mist
  1030: 'fog.svg',
  1135: 'fog.svg',
  1147: 'fog.svg',

  // 🧊 Ice / Freezing Rain
  1072: 'freezing-rain.svg',
  1150: 'freezing-rain.svg',
  1153: 'freezing-rain.svg',
  1168: 'freezing-rain.svg',
  1171: 'freezing-rain.svg',

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

      if (
        code === 1006 ||
        code === 1009 ||
        code === 1030 ||
        code === 1135 ||
        code === 1147 ||
        code === 1087 ||
        code === 1273 ||
        code === 1276
      ) {
        const place = document.querySelector('.place')
        place.classList.add('white')
        document.querySelector('.hourly-weather').classList.add('white')
        document.querySelector('.next-forecast').classList.add('white')
        document.querySelector('.saved-location').classList.add('white')
        document.querySelector('.astronomy').classList.add('white')
        document.querySelector('.tomorrow-forecast').classList.add('white')
      } else {
        const place = document.querySelector('.place')
        place.classList.remove('white')
        document.querySelector('.hourly-weather').classList.remove('white')
        document.querySelector('.next-forecast').classList.remove('white')
        document.querySelector('.saved-location').classList.remove('white')
        document.querySelector('.astronomy').classList.remove('white')
        document.querySelector('.tomorrow-forecast').classList.remove('white')
      }

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

  savedSearchSuggestionsContainer.innerHTML = ''

  if (!input) {
    alert('Please enter a city name to save.')
    return
  }

  const existingCities = Array.from(
    document.querySelectorAll('.location .city-name')
  ).map(span => span.textContent.trim().toLowerCase())

  if (existingCities.includes(input.toLowerCase())) {
    alert(`${input} is already in your saved locations.`)
    savedSearch.value = ''
    return
  }

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

const searchBtn = document.querySelector('#search-btn')

function fetchValue(e) {
  e.preventDefault()
  const locationInput = document.getElementById('search')
  const newCity = locationInput.value.trim()

  mainSearchSuggestionContainer.innerHTML = ''

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

async function getAutocompleteSuggestions(query) {
  if (query.length < 2) {
    return []
  }

  const apiKey = '8409f078b588400595c175418251107'

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch autocomplete suggestions:', error)
  }
}

function displaySuggestions(suggestions, targetInput, targetContainer) {
  targetContainer.innerHTML = ''

  if (suggestions.length === 0) {
    return
  }

  suggestions.forEach(location => {
    const suggestionDiv = document.createElement('div')
    const suggestionSpan = document.createElement('span')

    suggestionDiv.textContent = `${location.name}`

    suggestionSpan.textContent = `${location.region ? `${location.region}, ` : ''}${location.country}`

    suggestionDiv.addEventListener('click', () => {
      targetInput.value = location.name
      targetContainer.innerHTML = ''

      if (targetInput.id === 'search') {
        displayWeather(location.name)
        targetInput.value = ''

        showContainer(document.querySelector('.home-container'))
        homeButton.classList.add('fill')
        dailyForecastButton.classList.remove('fill')
        savedLocationButton.classList.remove('fill')
      } else if (targetInput.id === 'saved-search') {
        // coming back to this
        targetInput.value = ''
      }
    })

    suggestionDiv.appendChild(suggestionSpan)
    targetContainer.appendChild(suggestionDiv)
  })
}

locationInput.addEventListener('input', async e => {
  const query = e.target.value.trim()

  if (query.length > 1) {
    const suggestions = await getAutocompleteSuggestions(query)
    displaySuggestions(
      suggestions,
      locationInput,
      mainSearchSuggestionContainer
    )
  } else {
    mainSearchSuggestionContainer.innerHTML = ''
  }
})

savedSearch.addEventListener('input', async e => {
  const query = e.target.value.trim()

  if (query.length > 1) {
    const suggestions = await getAutocompleteSuggestions(query)
    displaySuggestions(
      suggestions,
      savedSearch,
      savedSearchSuggestionsContainer
    )
  } else {
    savedSearchSuggestionsContainer.innerHTML = ''
  }
})

document.addEventListener('click', e => {
  if (
    !locationInput.contains(e.target) &&
    !mainSearchSuggestionContainer.contains(e.target)
  ) {
    mainSearchSuggestionContainer.innerHTML = ''
  }
  if (
    !savedSearch.contains(e.target) &&
    !savedSearchSuggestionsContainer.contains(e.target)
  ) {
    savedSearchSuggestionsContainer.innerHTML = ''
  }
})

const { fetchData } = require('./http.service')

const cities = ['Jerusalem', 'New York', 'Dubai', 'Lisbon', 'Oslo', 'Paris', 'Berlin', 'Athens', 'Seoul', 'Singapore']
const daysCount = 5
const API_KEY = '21da4badb28db13dc72072bc45fb78d8'

// I have wrote tow approaches to get the same result:

// 1. For each city get the coordinates and then the forecast on the same iteration.

async function getForecastsStr() {
    try {
        const forecastsPromises = cities.map(async cityName => {
            // Get the coordinates of the city.
            const coords = await _getLatLng(cityName)
            // Get the forecast for the city.
            const forecast = await fetchData(`http://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly&units=metric&appid=${API_KEY}`)
            forecast.cityName = cityName
            return forecast
        })
        const citiesForecasts = await Promise.all(forecastsPromises)
        return _calculateData(citiesForecasts)
    } catch (err) {
        throw err.message
    }
}

async function _getLatLng(cityName) {
    try {
        const cityWithCoords = await fetchData(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`)
        const { coord: coords } = cityWithCoords.city
        return Promise.resolve(coords)
    } catch (err) {
        throw err.message
    }
}

// 2. Get all the cities coordinates and then all the cities forecasts.

// async function getForecastsStr() {
//     try {
//         // Get the coordinates of all the cities.
//         const citiesWithLatLng = await _getLatLng()
//         // Get the forecast for all the cities.
//         const forecastsPromises = citiesWithLatLng.map(async city => {
//             const { cityName, coords } = city
//             const forecast = await fetchData(`http://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly&units=metric&appid=${API_KEY}`)
//             forecast.cityName = cityName
//             return Promise.resolve(forecast)
//         })
//         const citiesForecasts = await Promise.all(forecastsPromises)
//         return _calculateData(citiesForecasts)
//     } catch (err) {
//         throw err.message
//     }
// }

// async function _getLatLng() {
//     try {
//         const promises = cities.map(async cityName => {
//             const cityWithCoords = await fetchData(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`)
//             const { coord: coords } = cityWithCoords.city
//             return Promise.resolve({ cityName, coords })
//         })
//         return await Promise.all(promises)
//     } catch (err) {
//         throw err.message
//     }
// }

function _calculateData(citiesForecasts) {
    let dataStr = 'Day , city with highest temp, city with lowest temp, cities with rain\n' // CSV header
    for (var i = 0; i < daysCount; i++) { // for each day
        // Setting variables for the day
        let highestTemp = -Infinity
        let lowestTemp = Infinity
        let highestTempCity, lowestTempCity = ''
        let rainCities = []
        citiesForecasts.forEach(forecast => { // Check every city data on each day.
            const currDayForecast = forecast.daily[i]
            const maxTemp = currDayForecast.temp.max
            const minTemp = currDayForecast.temp.min
            if (maxTemp > highestTemp) { // Check if the current city has the highest temp today.
                highestTemp = maxTemp
                highestTempCity = forecast.cityName
            }
            if (minTemp < lowestTemp) { // Check if the current city has the lowest temp today.
                lowestTemp = minTemp
                lowestTempCity = forecast.cityName
            }
            if (currDayForecast.rain) { // Check if the current city has rain today.
                rainCities.push(forecast.cityName)
            }
        })

        // Add the current day data to the CSV string.
        dataStr += `Day ${new Date(citiesForecasts[0].daily[i].dt * 1000).toLocaleDateString()},${highestTempCity},${lowestTempCity},${rainCities.join(' & ')}\n`
    }
    return dataStr
}

module.exports = {
    getForecastsStr
}
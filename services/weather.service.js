const { fetchData } = require('./http.service')

const cities = ['Jerusalem', 'New York', 'Dubai', 'Lisbon', 'Oslo', 'Paris', 'Berlin', 'Athens', 'Seoul', 'Singapore']
const daysCount = 5

async function getLatLng() {
    try {
        const promises = cities.map(async cityName => {
                const cityWithCoords = await fetchData(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=cd09e461a5a28c027f9444be0f4cb2a0`)
                const { coord: coords } = cityWithCoords.city
                return Promise.resolve({ cityName, coords })
        })
        return await Promise.all(promises)
    } catch (err) {
        throw err.message
    }
}

async function getForecasts(citiesWithLatLng) {
    try {
        const promises = citiesWithLatLng.map(async city => {
            const { cityName, coords } = city
            const forecast = await fetchData(`http://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly&units=metric&appid=cd09e461a5a28c027f9444be0f4cb2a0`)
            forecast.cityName = cityName
            return Promise.resolve(forecast)
        })
        return await Promise.all(promises)
    } catch (err) {
        throw err.message
    }
}

function calculateData(citiesForecasts) {
    let dataStr = 'Day , city with highest temp, city with lowest temp, cities with rain\n'
    for (var i = 0; i < daysCount; i++) {
        let highestTemp = -Infinity
        let lowestTemp = Infinity
        let highestTempCity, lowestTempCity = ''
        let rainCities = []
        citiesForecasts.forEach(forecast => {
            const currDayForecast = forecast.daily[i]
            const maxTemp = currDayForecast.temp.max
            const minTemp = currDayForecast.temp.min
            if (maxTemp > highestTemp) {

                highestTemp = maxTemp
                highestTempCity = forecast.cityName
            }
            if (minTemp < lowestTemp) {
                lowestTemp = minTemp
                lowestTempCity = forecast.cityName
            }
            if (currDayForecast.rain) rainCities.push(forecast.cityName)
        })

        dataStr += `Day ${new Date(citiesForecasts[0].daily[i].dt * 1000).toLocaleDateString()},${highestTempCity},${lowestTempCity},${rainCities.join(' & ')}\n`
    }
    return dataStr
}

module.exports = {
    getForecasts,
    getLatLng,
    calculateData
}
const weatherService = require('./services/weather.service')
const loggerService = require('./services/logger.service')
const fsService = require('./services/fs.service');

(async function () {
    try {
        
        loggerService.info('Started')
        const citiesWithLatLng = await weatherService.getLatLng()
        const citiesForecasts = await weatherService.getForecasts(citiesWithLatLng)
        const calculatedData = weatherService.calculateData(citiesForecasts)
        await fsService.writeFile('weather.csv', calculatedData)
    } catch (err) {
        loggerService.error(err)
    }
})()
const weatherService = require('./services/weather.service')
const loggerService = require('./services/logger.service')
const fsService = require('./services/fs.service');

// Run "npm run dev" to run the app in development mode(nodemon).

(async function () {
    try {
        loggerService.info('Started')
        const calculatedData = await weatherService.getForecastsStr()
        await fsService.writeFile('weather.csv', calculatedData)
    } catch (err) {
        loggerService.error(err)
    }
})()
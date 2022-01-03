const fs = require('fs')

function writeFile(fileName, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, 'utf8', (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}

module.exports = {
    writeFile
}
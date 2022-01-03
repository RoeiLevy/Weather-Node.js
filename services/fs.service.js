function writeFile(fileName, data) {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, 'utf8', function (err) {
            if (err) reject(err);
            else resolve();
        });
    })
}

module.exports = {
    writeFile
}
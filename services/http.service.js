const http = require('http');

function fetchData(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            const { statusCode } = res;
            let err;
            if (statusCode !== 200) {
                err = new Error(`Request Failed. Status Code: ${statusCode}`);
                reject(err);
            }

            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                resolve(JSON.parse(Buffer.concat(data).toString()));
            })
        })
    })
}

module.exports = {
    fetchData
}
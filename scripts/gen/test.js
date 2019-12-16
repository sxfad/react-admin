const https = require('https');
const axios = require('axios');


const request = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});


// request.get('https://172.16.170.48:2233/swagger-ui.html')
request.get('https://172.16.170.48:2233/v2/api-docs')
    .then(function (response) {
        // handle success
        console.log(response.data);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });


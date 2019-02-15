const GrabFiles = require('./index');
const path = require('path');

const grabFiles = new GrabFiles({
    // paths: path.resolve(__dirname, './pages/**/*.model.js'),
    paths: path.resolve(__dirname, './pages/**/*.jsx'),
    content: false,
    displayLog: true,
    ignored: [
        // path.resolve(__dirname, './pages/client-api/api.model.js'),
        // path.resolve(__dirname, './pages/client-api/api2.model.js'),
    ],
});

grabFiles.watch(function (result, event) {
    console.log(event, result);
});

// const result = grabFiles.getResult();
// console.log('grabFiles', result);

//express_demo.js 文件
const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', function(req, res) {
    res.send('Hello World');
});
app.get('/get', function(req, res) {
    const successResult = {
        code: '00',
        data: {name: '张三'},
    };
    const errorResult = {
        code: '999',
        data: null,
        message: '后端返回的错误信息！',
    };
    setTimeout(() => {
        res.send(Math.random() < .5 ? successResult : errorResult);
    }, 2000);
});
app.get('/download', function(req, res) {
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment;filename=aaa.txt');    // 'aaa.txt' can be customized.
    const fileStream = fs.createReadStream('./README.md');
    fileStream.on('data', function(data) {
        res.write(data, 'binary');
    });
    fileStream.on('end', function() {
        res.end();
    });
});

const server = app.listen(8081, function() {
    // const host = server.address().address
    const port = server.address().port;

    console.log('应用实例，访问地址为 http://localhost:%s', port);

});

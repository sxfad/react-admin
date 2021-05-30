//express_demo.js 文件
const express = require('express');
const bodyParser = require('body-parser');//解析,用req.body获取post参数
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const fs = require('fs');


app.all('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/', function(req, res) {
    console.log('get /');
    res.send('Hello World');
});

app.get('/users', function(req, res) {
    res.statusCode = 401;
    res.send({
        total: 1,
        list: [{id: '123', name: '张三'}],
    });
});

app.get('/subApp', function(req, res) {
    setTimeout(() => {
        res.send([
            {id: '123', order: 1000, parentId: '789', target: 'qiankun', name: 'react-admin', activeRule: '/react-admin', baseName: '/react-admin', entry: 'http://localhost:3000', title: '测试子系统', remark: '这是个测试子系统'},
            {id: '456', order: 2000, target: 'iframe', entry: 'http://localhost:3000', title: '测试子系统', remark: '这是个测试子系统'},
            {id: '789', order: 800, target: 'menu', basePath: '/', title: '主系统中应用', remark: '这是个测试主系统应用'},
        ]);
    }, 100);
});

app.get('/subApp/:id', function(req, res) {
    res.send({id: '123', target: 'qiankun', name: 'react-admin', basePath: '/react-admin', entry: 'http://localhost:3000', title: '测试子系统', remark: '这是个测试子系统'});
});

app.put('/subApp', function(req, res) {
    res.send(true);
});
app.post('/subApp', function(req, res) {
    res.send(true);
});

app.del('/subApp', function(req, res) {
    res.send(true);
});


app.post('/', function(req, res) {
    const {user, password} = req.body;
    res.redirect(`http://172.16.40.72:3100/?user=${user}&password=${password}`);
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

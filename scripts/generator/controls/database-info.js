const mysqlService = require('../service/my-sql');

module.exports = {
    testConnection(req, res, next) {
        const {host, port, user, password, database} = req.query;

        mysqlService.testConnection({host, port, user, password, database})
            .then(result => {
                res.send(true);
            })
            .catch(err => {
                res.status(400).send({error: err, message: '连接失败'});
            });
    },

    getTableNames(req, res, next) {
        const {host, port, user, password, database} = req.query;

        mysqlService.getTableNames({host, port, user, password, database})
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.status(400).send({error: err, message: '获取表名失败'});
            });
    },

    getTableColumns(req, res, next) {
        const {host, port, user, password, database, table} = req.query;

        mysqlService.getTableColumns({host, port, user, password, database, table})
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.status(400).send({error: err, message: '获取表字段失败'});
            });
    },
};

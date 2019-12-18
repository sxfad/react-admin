const mysql = require('mysql');
const chalk = require('chalk');

function testConnection(url) {
    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection(url);

        connection.connect(function (err) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(true);
            }
        });

        connection.end();
    });
}


function getTableNames(options) {
    return new Promise(function (resolve, reject) {
        const {url, database} = options;
        const connection = mysql.createConnection(url);

        // url: jdbc:mysql://172.16.60.247:3306/code_generate?useUnicode=true&characterEncoding=UTF-8&useSSL=false
        // username: fd
        // password: 123456

        connection.connect();

        const tableInfoSql = `select table_name from information_schema.tables where table_schema='${database}' and table_type='base table'`;

        connection.query(tableInfoSql, function (error, results, fields) {
            if (error) return reject(error);

            const result = results.map(item => {
                return item.table_name;
            });
            resolve(result);
        });

        connection.end();
    });
}

function getTableColumns(options) {
    return new Promise(function (resolve, reject) {
        const {url, database, table} = options;
        const connection = mysql.createConnection(url);

        connection.connect();

        const tableInfoSql = `select * from information_schema.columns where table_schema = "${database}" and table_name = "${table}"`;

        connection.query(tableInfoSql, function (error, results, fields) {
            if (error) return reject(error);

            const result = results.map(item => {
                const name = item.COLUMN_NAME;
                const camelCaseName = name.replace(/_(\w)/g, (a, b) => b.toUpperCase());
                const comment = item.COLUMN_COMMENT;
                const commentInfo = getInfoByComment(comment);
                const {chinese} = commentInfo;

                return {
                    camelCaseName,
                    name,
                    type: item.DATA_TYPE, // COLUMN_TYPE
                    isNullable: item.IS_NULLABLE === 'YES',
                    comment,
                    chinese,
                    length: item.CHARACTER_MAXIMUM_LENGTH, // CHARACTER_OCTET_LENGTH
                };
            });
            resolve(result);
        });

        connection.end();
    });
}

function getInfoByComment(comment = '') {
    const chinese = getTitle(comment) || '';

    return {
        chinese,
    };
}


function getTitle(description, defaultTitle) {
    if (!description) return defaultTitle;

    description = description.trim();

    const regEx = /[`~!@#$%^&*()_\-+=|{}':;',\[\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？ ]/;
    const sd = description.split(regEx);

    if (sd && sd.length) return sd[0];

    return defaultTitle;
}

// TODO 根据field获取title，需要有个词库，从词库里查找
function getTitleByField(field) {
    console.log(field);
}

function logWarning(text) {
    const icon = '️️⚡️';
    console.log(chalk.yellow(icon + text))
}

function logSuccess(text) {
    const icon = '✨  ';
    console.log(chalk.green(icon + text))
}

module.exports = {
    testConnection,
    getTableColumns,
    getTableNames,
    getTitle,
    logWarning,
    logSuccess,
};


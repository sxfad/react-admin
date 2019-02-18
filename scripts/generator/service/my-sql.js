const mysql = require('mysql');

const options = {
    host: '172.16.60.247',
    port: '3306',
    user: 'fd',
    password: '123456',
    database: 'code_generate',
    table: 'code_generate_project',
};

function testConnection(options) {
    return new Promise(function (resolve, reject) {
        const {host, port, user, password, database} = options;
        const connection = mysql.createConnection({
            host,
            port,
            user,
            password,
            database,
        });

        connection.connect(function (err) {
            console.log(err);
            if (err) {
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
        const {host, port, user, password, database} = options;
        const connection = mysql.createConnection({
            host,
            port,
            user,
            password,
            database,
        });

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
        const {host, port, user, password, database, table} = options;
        const connection = mysql.createConnection({
            host,
            port,
            user,
            password,
            database,
        });

        // url: jdbc:mysql://172.16.60.247:3306/code_generate?useUnicode=true&characterEncoding=UTF-8&useSSL=false
        // username: fd
        // password: 123456

        connection.connect();

        const tableInfoSql = `select * from information_schema.columns where table_schema = "${database}" and table_name = "${table}"`;

        connection.query(tableInfoSql, function (error, results, fields) {
            if (error) return reject(error);

            /*
            TABLE_CATALOG: 'def',
            TABLE_SCHEMA: 'code_generate',
            TABLE_NAME: 'code_generate_project',
            COLUMN_NAME: 'created_Date',
            ORDINAL_POSITION: 11,
            COLUMN_DEFAULT: null,
            IS_NULLABLE: 'NO',
            DATA_TYPE: 'datetime',
            CHARACTER_MAXIMUM_LENGTH: null,
            CHARACTER_OCTET_LENGTH: null,
            NUMERIC_PRECISION: null,
            NUMERIC_SCALE: null,
            DATETIME_PRECISION: 0,
            CHARACTER_SET_NAME: null,
            COLLATION_NAME: null,
            COLUMN_TYPE: 'datetime',
            COLUMN_KEY: '',
            EXTRA: '',
            PRIVILEGES: 'select,insert,update,references',
            COLUMN_COMMENT: '',
            GENERATION_EXPRESSION: '',
            */

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
    const cs = comment.split(' ');
    let chinese = '';
    if (cs && cs.length) {
        chinese = cs[0];
    }

    return {
        chinese,
    };
}

module.exports = {
    testConnection,
    getTableColumns,
    getTableNames,
};

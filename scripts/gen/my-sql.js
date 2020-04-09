const mysql = require('mysql');

function testConnection(dbUrl) {
    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection(dbUrl);

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

function getTableNames(dbUrl) {
    const database = new URL(dbUrl).pathname.replace('/', '');
    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection(dbUrl);

        connection.connect();

        const tableInfoSql = `select table_name, table_comment from information_schema.tables where table_schema='${database}' and table_type='base table'`;

        connection.query(tableInfoSql, function (error, results) {
            if (error) return reject(error);

            const result = results.map(item => {
                return {
                    name: item.table_name,
                    comment: item.table_comment,
                };
            });
            resolve(result);
        });

        connection.end();
    });
}

function getTableColumns(dbUrl, table) {
    const database = new URL(dbUrl).pathname.replace('/', '');

    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection(dbUrl);

        connection.connect();

        const tableInfoSql = `select * from information_schema.columns where table_schema = "${database}" and table_name = "${table}"`;

        connection.query(tableInfoSql, function (error, results) {
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


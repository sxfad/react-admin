const pg = require("pg");

function testConnection(options) {
    return new Promise(function (resolve, reject) {
        const {host, port, user, password, database} = options;

        const client = new pg.Client({
            host,
            port,
            user,
            password,
            database,
        });
        client.connect(function (err) {
            if (err) {
                console.error(err);
                client.end();
                reject(err);
            } else {
                client.end();
                resolve(true);
            }
        });
    });
}


function getTableNames(options) {
    return new Promise(function (resolve, reject) {
        const {host, port, user, password, database} = options;
        const client = new pg.Client({
            host,
            port,
            user,
            password,
            database,
        });
        const tableInfoSql = `select tablename AS table_name from pg_tables where tablename not like 'pg_%' and tablename not like 'sql_%' order by tablename`;

        client.connect();
        client.query(tableInfoSql, function (error, results) {
            if (error) {
                console.error(error);
                client.end();
                return reject(error);
            }

            const result = results.rows.map(item => item.table_name);

            resolve(result);

            client.end();
        });
    });
}

function getTableColumns(options) {
    return new Promise(function (resolve, reject) {
        const {host, port, user, password, database, table} = options;

        const client = new pg.Client({
            host,
            port,
            user,
            password,
            database,
        });
        const tableInfoSql = `select * from information_schema.columns where table_schema = 'public' and table_name = '${table}'`;

        client.connect();

        client.query(tableInfoSql, function (error, results) {
            if (error) {
                client.end();
                return reject(error);
            }

            const result = results.rows.map(item => {
                const name = item.column_name;
                const camelCaseName = name.replace(/_(\w)/g, (a, b) => b.toUpperCase());
                const comment = 'comment';//item.COLUMN_COMMENT;
                const commentInfo = getInfoByComment(comment);
                const {chinese} = commentInfo;

                return {
                    camelCaseName,
                    name,
                    type: item.data_type, // COLUMN_TYPE
                    isNullable: item.is_nullable === 'YES',
                    comment,
                    chinese,
                    length: item.character_maximum_length, // CHARACTER_OCTET_LENGTH
                };
            });
            resolve(result);
            client.end();
        });
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

const mysql = require('mysql');
const pg = require("pg");

function testConnection(options) {
    return new Promise(function (resolve, reject) {
        var client,result;
        const {host, port, user, password, database,dbtype} = options;
        switch (dbtype)
        {
            case '1':
                client = mysql.createConnection({
                    host,
                    port,
                    user,
                    password,
                    database,
                });
                break;
            case '2':
                client = new pg.Client({
                    host,
                    port,
                    user,
                    password,
                    database,
                });
                break;
            default:
                client = mysql.createConnection({
                    host,
                    port,
                    user,
                    password,
                    database,
            });
            break;
        }

        client.connect(function (err) {
            console.log(err);
            if (err) {
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
        var client,tableInfoSql,result;
        const {host, port, user, password, database,dbtype} = options;
        switch (dbtype)
        {
            case '1':
                client = mysql.createConnection({
                    host,
                    port,
                    user,
                    password,
                    database,
                });
                tableInfoSql = `select table_name from information_schema.tables where table_schema='${database}' and table_type='base table'`;
                break;
            case '2':
                client = new pg.Client({
                    host,
                    port,
                    user,
                    password,
                    database,
                });
                tableInfoSql = `select tablename AS table_name from pg_tables where tablename not like 'pg_%' and tablename not like 'sql_%' order by tablename`;
                break;
            default:
                client = mysql.createConnection({
                    host,
                    port,
                    user,
                    password,
                    database,
            });
            tableInfoSql = `select table_name from information_schema.tables where table_schema='${database}' and table_type='base table'`;
            break;
        }

        // url: jdbc:mysql://172.16.60.247:3306/code_generate?useUnicode=true&characterEncoding=UTF-8&useSSL=false
        // username: fd
        // password: 123456

        client.connect();
        client.query(tableInfoSql, function (error, results) {
            if (error) 
            {
                client.end();
                return reject(error);
            }

            switch (dbtype)
            {
                case '1':
                    result = results.map(item => {
                        return item.table_name;
                    });
                    resolve(result);
                    break;
                case '2':
                    result = results.rows.map(item => {
                        return item.table_name;
                    });
                    resolve(result);
                    break;
                default:
                    result = results.map(item => {
                        return item.table_name;
                    });
                    resolve(result);
                    break;
            }
            client.end();
        });
    });
}

function getTableColumns(options) {
    return new Promise(function (resolve, reject) {
        var client,tableInfoSql,result;
        const {host, port, user, password, database, table,dbtype} = options;

        switch (dbtype)
        {
            case '1':
                client = mysql.createConnection({
                    host,
                    port,
                    user,
                    password,
                    database,
                });
                tableInfoSql = `select * from information_schema.columns where table_schema = "${database}" and table_name = "${table}"`;
                break;
            case '2':
                client = new pg.Client({
                    host,
                    port,
                    user,
                    password,
                    database,
                });
                tableInfoSql = `select * from information_schema.columns where table_schema = 'public' and table_name = '${table}'`;
                break;
            default:
                client = mysql.createConnection({
                    host,
                    port,
                    user,
                    password,
                    database,
            });
            tableInfoSql = `select * from information_schema.columns where table_schema = "${database}" and table_name = "${table}"`;
            break;
        }

        // url: jdbc:mysql://172.16.60.247:3306/code_generate?useUnicode=true&characterEncoding=UTF-8&useSSL=false
        // username: fd
        // password: 123456

        client.connect();

        client.query(tableInfoSql, function (error, results) {
            if (error) 
            {
                client.end();
                return reject(error);
            }
            
            switch (dbtype)
            {
                case '1':
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

                    result = results.map(item => {
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
                    break;
                case '2':
                    result = results.rows.map(item => {
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
                    break;
                default:
                    result = results.map(item => {
                        return item.table_name;
                    });
                    resolve(result);
                    break;
            }
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

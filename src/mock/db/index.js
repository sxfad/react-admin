import createTableSql, {initDataSql} from './init-sql';

const db = openDatabase('react-admin', '1.0', 'react-admin测试数据库', 2 * 1024 * 1024);
let tableCreated = false;

export default async function executeSql(sql, args) {
    if (!tableCreated) await createTable();

    return new Promise((resolve, reject) => {
        db.transaction(function(tx) {
            tx.executeSql(
                sql,
                args,
                (transaction, resultSet) => resolve(resultSet),
                (transaction, error) => reject(error));
        });
    });
}

const tables = [
    'menus',
    'roles',
    'users',
    'role_menus',
    'user_roles',
];

export async function createTable(init) {
    if (init) await dropAllTables();
    await executeSplit(createTableSql, 'create table');

    if (init) await initTablesData();
    tableCreated = true;
}

export async function dropAllTables() {
    tables.forEach(table => {
        db.transaction(function(tx) {
            tx.executeSql(`drop table ${table}`);
        });
    });
}

export async function initTablesData() {
    for (let table of tables) {
        const sql = initDataSql[table];
        await executeSplit(sql, 'INSERT INTO');
    }
}

async function executeSplit(sql, keyWord) {
    const arr = sql
        .split(keyWord)
        .filter(item => !!item.trim())
        .map(item => keyWord + item);

    for (let sql of arr) {
        await new Promise((resolve, reject) => {
            db.transaction(function(tx) {
                tx.executeSql(
                    sql,
                    null,
                    (transaction, resultSet) => resolve(resultSet),
                    (transaction, error) => reject(error));
            });
        });
    }
}
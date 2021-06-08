import createTableSql, {initDataSql} from './init-sql';

const db = openDatabase('react-admin', '1.0', 'react-admin测试数据库', 2 * 1024 * 1024);
let CACHE_INI_DB;

const tables = [
    'menus',
    'roles',
    'users',
    'role_menus',
    'user_roles',
];

export default async function executeSql(sql, args, fullResult) {
    CACHE_INI_DB = CACHE_INI_DB || initDB();

    await CACHE_INI_DB;

    return new Promise((resolve, reject) => {
        db.transaction(function(tx) {
            tx.executeSql(
                sql,
                args,
                (transaction, resultSet) => resolve(fullResult ? resultSet : Array.from(resultSet.rows)),
                (transaction, error) => reject(error));
        });
    });
}

// 初始化数据库
export async function initDB(init) {
    const hasInitData = await hasTables();

    if (init) await dropAllTables();

    // 创建表
    await executeSplit(createTableSql, 'create table');

    if (init || !hasInitData) await initTablesData();
}

export async function hasTables() {
    return new Promise((resolve, reject) => {
        db.transaction(
            function(tx) {
                tx.executeSql(
                    'select * from users',
                    null,
                    () => resolve(true),
                    (transaction, error) => {
                        resolve(false);
                    });
            },
        );
    });
}

// 删除所有数据库表
export async function dropAllTables() {
    tables.forEach(table => {
        db.transaction(function(tx) {
            tx.executeSql(`drop table ${table}`);
        });
    });
}

// 插入初始化数据
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

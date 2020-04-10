const mysql = require('mysql');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

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
    console.log(chalk.yellow(icon + text));
}

function logSuccess(text) {
    const icon = '✨  ';
    console.log(chalk.green(icon + text));
}


// 接口，数据库读取时，忽略的字段
const COMMON_EXCLUDE_FIELDS = [
    'SXF-TRACE-ID',
    'pageNum',
    'pageSize',
    'id',
    'token',
    'updatedAt',
    'createdAt',
    'created_at',
    'updated_at',
    'is_deleted',
];

function getConfigFromDbTable(options) {
    const {
        tableName,
        listPage,
        selectable,
        pagination,
        serialNumber,
        query,
        add,
        operatorEdit,
        operatorDelete,
        batchDelete,
        modalEdit,
        pageEdit,
        children,
    } = options;

    // 下划线转连字符
    const moduleName = tableName.replace(/_/g, '-');
    const base = {
        moduleName,
        path: `/${moduleName}`,
        ajax: {
            search: {
                name: '查询',
                method: 'get',
                url: `/${moduleName}`,
            },
            detail: {
                name: '详情',
                method: 'get',
                url: `/${moduleName}/{id}`,
            },
            modify: {
                name: '修改',
                method: 'put',
                url: `/${moduleName}`,
            },
            add: {
                name: '添加',
                method: 'post',
                url: `/${moduleName}`,
            },
            delete: {
                name: '删除',
                method: 'del',
                url: `/${moduleName}/{id}`,
            },
            batchDelete: {
                name: '批量删除',
                method: 'del',
                url: `/${moduleName}`,
            },
        },
    };

    let pages = null;
    if (listPage || modalEdit || pageEdit) {
        pages = [];
        if (listPage) {
            pages.push({
                typeName: '列表页面',
                filePath: path.join(__dirname, '../../src/pages', moduleName, 'index.jsx'),
                template: path.join(__dirname, 'templates', 'list.js'),
            });
        }
        if (modalEdit) {
            pages.push({
                typeName: '弹框表单',
                filePath: path.join(__dirname, '../../src/pages', moduleName, 'EditModal.jsx'),
                template: path.join(__dirname, 'templates', 'edit-modal.js'),
            });
        }
        if (pageEdit) {
            pages.push({
                typeName: '页面表单',
                filePath: path.join(__dirname, '../../src/pages', moduleName, 'Edit.jsx'),
                template: path.join(__dirname, 'templates', 'edit.js'),
            });
        }
    }

    let queries = null;
    if (query) {
        queries = [
            {
                type: 'input',
                label: '条件1',
                field: 'field1',
            },
            {
                type: 'select',
                label: '条件2',
                field: 'field1',
            },
        ];
    }
    let tools = null;

    if (add || batchDelete) {
        tools = [];
        if (add) {
            tools.push({
                text: '添加',
                handle: '',
            });
        }

        if (batchDelete) {
            tools.push(
                {
                    text: '删除',
                    handle: 'handleBatchDelete',
                },
            );
        }
    }

    const table = {
        selectable,
        pagination,
        serialNumber,
    };

    const columns = children.map(item => {
        const {chinese: title, field: dataIndex} = item;
        return {
            title,
            dataIndex,
        };
    });

    let operators = null;
    if (operatorEdit || operatorDelete) {
        operators = [];
        if (operatorEdit) {
            operators.push({
                text: '修改',
                handle: '',
            });
        }
        if (operatorDelete) {
            operators.push({
                text: '删除',
                handle: 'handleDelete',
            });
        }
    }

    let forms = null;

    if (modalEdit || pageEdit) {
        forms = children.map(item => {
            const {
                field,
                chinese: label,
                length: maxLength,
                type: oType,
                isNullable,
            } = item;

            const type = getFormElementType(oType, label);
            const required = !isNullable;

            const options = {
                type,
                label,
                field,
                required,
            };

            if (maxLength) options.maxLength = maxLength;

            return options;
        });
    }

    const listPageConfig = {
        fileTypeName: '列表页面',
        filePath: path.join(__dirname, '../../src/pages', moduleName, 'index.jsx'),
        template: path.join(__dirname, 'templates', 'list.js'),
        base,
        pages,
        queries,
        tools,
        table,
        columns,
        operators,
        forms,
    };

    const modalEditConfig = {
        fileTypeName: '弹框表单',
        filePath: path.join(__dirname, '../../src/pages', moduleName, 'EditModal.jsx'),
        template: path.join(__dirname, 'templates', 'edit-modal.js'),
        base,
        pages,
        queries,
        tools,
        table,
        columns,
        operators,
        forms,
    };

    const pageEditConfig = {
        fileTypeName: '页面表单',
        filePath: path.join(__dirname, '../../src/pages', moduleName, 'edit.jsx'),
        template: path.join(__dirname, 'templates', 'edit.js'),
        base,
        pages,
        queries,
        tools,
        table,
        columns,
        operators,
        forms,
    };

    const configs = [];
    if (listPage) configs.push(listPageConfig);
    if (modalEdit) configs.push(modalEditConfig);
    if (pageEdit) configs.push(pageEditConfig);

    return configs;
}


// 获取表单类型
function getFormElementType({oType, label = ''}) {
    let type = 'input';

    // FIXME 完善更多类型
    if (oType === 'array') type = 'select';

    if (label.startsWith('是否')) type = 'switch';

    if (label.startsWith('密码') || label.endsWith('密码')) type = 'password';

    if (label.includes('电话') || label.includes('手机')) type = 'mobile';

    if (label.includes('邮箱')) type = 'email';

    if (label.includes('时间') || label.includes('日期')) type = 'date';

    return type;
}


async function writeFiles(configs) {
    const successFile = [];

    for (let cfg of configs) {
        let {filePath, template, fileTypeName} = cfg;
        const fp = filePath.replace(process.cwd(), '');
        const content = require(template)(cfg);

        writeFileSync(filePath, content);
        successFile.push({name: fileTypeName, path: fp});
    }

    return successFile;
}


/**
 * 写文件，如果目录不存在直接创建
 * @param toFile
 * @param content
 */
function writeFileSync(toFile, content) {
    const sep = path.sep;
    const folders = path.dirname(toFile).split(sep);
    let p = '';
    while (folders.length) {
        p += folders.shift() + sep;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }

    fs.writeFileSync(toFile, content);
}


module.exports = {
    testConnection,
    getTableColumns,
    getTableNames,
    getTitle,
    logWarning,
    logSuccess,
    COMMON_EXCLUDE_FIELDS,
    getConfigFromDbTable,
    writeFiles,
    getFormElementType,
    writeFileSync,
};


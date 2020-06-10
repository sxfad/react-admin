const mysql = require('mysql');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const http = require('http');
const axios = require('axios');
const https = require('https');
const inflection = require('inflection');


function testConnection(url) {
    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection(url);

        connection.connect(function (err) {
            if (err) return reject(err);

            resolve(true);
        });

        connection.end();
    });
}


function getTableNames(options) {
    return new Promise(function (resolve, reject) {
        const {url, database} = options;
        const connection = mysql.createConnection(url);

        connection.connect(err => {
            if (err) return reject(err);
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
    });
}

function getTableColumns(options) {
    return new Promise(function (resolve, reject) {
        const {url, database, table} = options;
        const connection = mysql.createConnection(url);

        connection.connect(err => {
            if (err) return reject(err);

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

    // 复数
    const moduleNames = inflection.pluralize(moduleName);
    const ModuleName = inflection.camelize(moduleName);
    const ModuleNames = inflection.pluralize(ModuleName);

    const base = {
        moduleName,
        moduleNames,
        ModuleName,
        ModuleNames,

        path: `/${moduleNames}`,
        ajax: {
            search: {
                name: '查询',
                method: 'get',
                url: `/${moduleNames}`,
            },
            detail: {
                name: '详情',
                method: 'get',
                url: `/${moduleNames}/{id}`,
            },
            modify: {
                name: '修改',
                method: 'put',
                url: `/${moduleNames}`,
            },
            add: {
                name: '添加',
                method: 'post',
                url: `/${moduleNames}`,
            },
            delete: {
                name: '删除',
                method: 'del',
                url: `/${moduleNames}/{id}`,
            },
            batchDelete: {
                name: '批量删除',
                method: 'del',
                url: `/${moduleNames}`,
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
                template: path.join(__dirname, 'templates', 'list-hooks.js'),
            });
        }
        if (modalEdit) {
            pages.push({
                typeName: '弹框表单',
                filePath: path.join(__dirname, '../../src/pages', moduleName, 'EditModal.jsx'),
                template: path.join(__dirname, 'templates', 'edit-modal-hooks.js'),
            });
        }
        if (pageEdit) {
            pages.push({
                typeName: '页面表单',
                filePath: path.join(__dirname, '../../src/pages', moduleName, 'Edit.jsx'),
                template: path.join(__dirname, 'templates', 'edit-hooks.js'),
            });
        }
    }

    let queries = null;
    if (query) {
        queries = children.filter(item => item.isQuery).map(item => {
            const {
                field,
                chinese: label,
                type: oType,
                formType,
            } = item;

            const type = formType || getFormElementType({oType, label});

            return {
                type,
                label,
                field,
            };
        });
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

    const columns = children.filter(item => item.isColumn).map(item => {
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
        forms = children.filter(item => item.isForm).map(item => {

            const {
                field,
                chinese: label,
                length: maxLength,
                type: oType,
                formType,
                isNullable,
            } = item;

            const type = formType || getFormElementType({oType, label});
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
        template: path.join(__dirname, 'templates', 'list-hooks.js'),
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
        template: path.join(__dirname, 'templates', 'edit-modal-hooks.js'),
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
        template: path.join(__dirname, 'templates', 'edit-hooks.js'),
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
function getFormElementType({oType = 'string', label = ''}) {

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

async function readSwagger(config, baseConfig) {
    const {url, userName, password} = config;
    const httpInstance = url.startsWith('https') ? https : http;
    const auth = 'Basic ' + Buffer.from(userName + ':' + password).toString('base64');
    const request = axios.create({
        httpsAgent: new httpInstance.Agent({
            rejectUnauthorized: false,
        }),
        headers: {
            Authorization: auth,
        },
    });
    const response = await request.get(url);

    // swagger所能提供的信息 queries columns forms
    const {
        search, // 从search 中获取 quires columns
        modify, // 从modify中获取 forms
    } = baseConfig.ajax;
    const apiDocs = response.data;
    const {paths, definitions} = apiDocs;

    let queries = null;
    let columns = null;
    let forms = null;

    if (search) {
        let {method, url, excludeFields = [], dataPath} = search;

        // 获取查询条件
        if (paths[url]) { // 接口有可能不存在
            excludeFields = [...excludeFields, ...COMMON_EXCLUDE_FIELDS];
            const {parameters} = paths[url][method];

            parameters.forEach(item => {
                const {name: field, required, description, in: inType, type: oType} = item;
                const label = getTitle(description, field);
                let type = getFormElementType({oType, label});

                if (inType === 'query' && !excludeFields.includes(field)) {
                    if (!queries) queries = [];
                    queries.push({
                        type,
                        field,
                        label,
                        required,
                    });
                }
            });

            // 获取表头
            let schema = paths[url][method]['responses']['200'].schema;

            let properties = getProperties(schema, definitions);
            if (dataPath) {
                dataPath.split('.').forEach(key => {
                    schema = properties[key];
                    properties = getProperties(schema, definitions);
                });
            }

            Object.entries(properties).forEach(([dataIndex, item]) => {
                if (!excludeFields.includes(dataIndex)) {
                    const {description} = item;
                    const title = getTitle(description, dataIndex);

                    if (!columns) columns = [];
                    columns.push({
                        title,
                        dataIndex,
                    });
                }
            });
        }
    }

    if (modify) {
        // 获取编辑表单信息
        let {method, url, excludeFields = []} = modify;

        if (paths[url]) { // 接口有可能不存在
            excludeFields = [...excludeFields, ...COMMON_EXCLUDE_FIELDS];
            const {parameters} = paths[url][method];

            parameters.forEach(item => {
                const {in: inType, schema} = item;

                if (inType === 'body') {
                    const properties = getProperties(schema, definitions);

                    Object.entries(properties).forEach(([field, item]) => {
                        if (!excludeFields.includes(field)) {
                            const {description, type: oType} = item;
                            const label = getTitle(description, field);

                            let type = getFormElementType({oType, label});

                            if (!forms) forms = [];
                            forms.push({
                                type,
                                label,
                                field,
                            });
                        }
                    });
                }
            });
        }
    }

    return {
        queries,
        columns,
        forms,
    };
}


// 获取swagger文档中的数据对象，不同的swagger可能有所不同
function getProperties(schema, definitions) {
    const getDefKey = (ref) => {
        const refs = ref.split('/');

        return refs[refs.length - 1];
    };

    const ref = schema.$ref || schema.items.$ref;
    const defKey = getDefKey(ref);
    const {properties} = definitions[defKey];

    if (!properties) return [];

    const propertiesValue = Object.values(properties);
    if (propertiesValue[0].items && propertiesValue[0].items.$ref) {
        const defKey = getDefKey(propertiesValue[0].items.$ref);
        const {properties} = definitions[defKey];
        return properties;
    }

    return properties;
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
    readSwagger,
    getProperties,
};


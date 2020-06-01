const path = require('path');
const inflection = require('inflection');
const urlParse = require('url').parse;
const {
    getTableColumns,
    logWarning,
    logSuccess,
    COMMON_EXCLUDE_FIELDS,
    getFormElementType,
    readSwagger,
} = require('./util');


// 命令要在项目根目录下执行
const PAGES_DIR = path.join(process.cwd(), '/src/pages');

// 模块标志字符串，用来拆分各个配置块
const BLOCK_FLAG = '######';

// 所有可用表单类型
const ELEMENT_TYPES = [
    'input',
    'hidden',
    'number',
    'textarea',
    'password',
    'mobile',
    'email',
    'select',
    'select-tree',
    'checkbox',
    'checkbox-group',
    'radio',
    'radio-group',
    'radio-button',
    'switch',
    'date',
    'time',
    'month',
    'date-time',
    'date-range',
    'cascader',
    'transfer',
    'icon-picker',
];

// 随机生成不重复field字符串
let fieldCount = 1;

function getRandomField() {
    return `field${fieldCount++}`;
}

function arrayRemove(arr, item) {
    const index = arr.indexOf(item);
    if (index < 0) return;
    arr.splice(index, 1);
}

/**
 * 从字符串中提取form表单元素相关配置
 * @param str
 */
function getFormElement(str) {
    // 用户名 userName input r
    if (!str) return;
    let strArr = str;
    if (typeof str === 'string') strArr = str.split(' ');

    // 非表单相关
    const excludes = [' ', 'q', 'f'];
    strArr = strArr.filter(item => !excludes.includes(item)); // 过滤掉不想关配置

    if (!strArr.length) return;

    // 获取表单类型 默认 input
    let type = strArr.find(item => ELEMENT_TYPES.includes(item));
    arrayRemove(strArr, type);

    // 获取是否必填
    const required = strArr.includes('r');
    arrayRemove(strArr, 'r');

    // 最大可输入字符数
    let maxLength = strArr.find(item => !!Number(item));
    arrayRemove(strArr, maxLength);
    if (maxLength) maxLength = Number(maxLength);


    // 获取 label field
    let [label, field] = strArr;
    if (!field) field = getRandomField();

    // type 如果不存在 尝试获取
    if (!type) type = getFormElementType({label});

    return {
        type,
        label,
        field,
        required,
        maxLength,
    };
}

function getElement(configArr, title, key, fromColumn) {
    const config = getBlockConfig(configArr, title) || [];
    const column = fromColumn ? getBlockConfig(configArr, '表格列配置') : [];

    const columns = column.filter(item => item.includes(key));
    const results = config.map(item => getFormElement(item));
    const resultColumn = columns.map(item => getFormElement(item));

    // 去重
    const result = [...results];
    resultColumn.forEach(item => {
        if (!result.find(it => it.label === item.label)) {
            result.push(item);
        }
    });

    if (!result.length) return null;

    return result;
}


function getBlockConfig(configArr, title) {
    const startIndex = configArr.findIndex(item => {
        return item.replace(/\s/g, '').includes(BLOCK_FLAG + title);
    });

    // 没有相关配置
    if (startIndex < 0) return null;

    let endIndex = configArr.slice(startIndex + 1)
        .findIndex(item => item.includes(BLOCK_FLAG));

    // 有可能是最后一个配置项
    endIndex = endIndex < 0 ? configArr.length : endIndex + startIndex;

    return configArr
        .slice(startIndex + 1, endIndex + 1)
        .filter(item => {
            return item
                // 都是被注释掉的行
                && !item.startsWith('//')
                && !item.startsWith('#')
                && !item.startsWith(';');
        })
        .map(item => {
            // 将一行文本进行空格拆分 并去掉空元素
            const lineArr = item.split(' ').filter(item => !!item);

            // 将注释去掉
            const index = lineArr.findIndex(it => it === '//' || it === '#' || it === ';');
            if (index !== -1) lineArr.splice(index);

            return lineArr;
        });
}

function getHandle(configArr, title, defaultProps) {
    const config = getBlockConfig(configArr, title);

    if (!config) return null;

    let result = null;

    config.forEach((item, i) => {
        let [text, handle, icon] = item;
        if (!handle) {
            const index = defaultProps.indexOf(text);
            handle = index > -1 ? defaultProps[index + 1] : `handle${i}`;
        }
        if (!icon) {
            const index = defaultProps.indexOf(text);
            icon = index > -1 ? defaultProps[index + 2] : void 0;
        }

        if (!result) result = [];

        result.push({
            text,
            handle,
            icon,
        });
    });

    return result;
}

// 接口配置
function getInterfaceConfig(configArr) {
    const config = getBlockConfig(configArr, '接口配置');

    if (!config) return null;

    let result = null;

    [
        'url',
        'userName',
        'password',
    ].forEach(key => {
        const cfg = config.find(item => item.length && item[0] === key);
        if (cfg) {
            if (!result) result = {};

            result[key] = cfg[1];
        }
    });

    return result;
}

// 数据库配置
function getDataBaseConfig(configArr) {
    const config = getBlockConfig(configArr, '数据库配置');

    if (!config) return null;

    let result = null;
    [
        'url',
        'tableName',
    ].forEach(key => {
        const cfg = config.find(item => item.length && item[0] === key);
        if (cfg) {
            if (!result) result = {};

            result[key] = cfg[1];
        }
    });

    if (result && result.url) {
        const urlObj = urlParse(result.url, true);

        result = {
            host: urlObj.hostname,
            port: urlObj.port,
            database: urlObj.pathname.substr(1),
            ...result,
        };
    }

    return result;
}

// 获取基本配置
function getBaseConfig(configArr, tableName) {
    const config = getBlockConfig(configArr, '基础配置');

    if (!config) return null;

    let result = null;

    const methodMap = {
        search: '查询',
        detail: '详情',
        modify: '修改',
        add: '添加',
        delete: '删除',
        batchDelete: '批量删除',
    };

    const methods = Object.values(methodMap);

    const keyMap = {
        'moduleName': '目录',
        'path': '路由',
    };

    const others = Object.values(keyMap);

    [
        ...others,
        ...methods,
    ].forEach(key => {
        const cfg = config.find(item => item.length && item[0] === key);
        if (cfg) {

            if (methods.includes(key)) {
                const [name, method, url, dataPath] = cfg;
                const km = Object.entries(methodMap).find(([, vv]) => vv === key);
                const k = km ? km[0] : null;

                if (k) {
                    if (!result) result = {};
                    if (!result.ajax) result.ajax = {};
                    result.ajax[k] = {
                        name,
                        method,
                        url,
                        dataPath,
                    };
                }
            }

            if (others.includes(key)) {
                const [, value] = cfg;
                const km = Object.entries(keyMap).find(([, vv]) => vv === key);
                const k = km ? km[0] : null;

                if (!result) result = {};
                result[k] = value;
            }
        }
    });

    // 基于RestFul规范，处理默认ajax请求url
    if (!result) result = {};
    let {moduleName} = result;
    if (!moduleName) {
        result.moduleName = moduleName = inflection.singularize(tableName);
    }

    Object.entries(methodMap).forEach(([method, name]) => {
        if (!result.ajax) result.ajax = {};

        if (!result.ajax[method]) {
            // 默认根据"查询"或者"目录"基于RestFul风格生成
            const baseUrl = result.ajax.search ? result.ajax.search.url : `/${inflection.pluralize(moduleName)}`;

            if (method === 'search') result.ajax[method] = {name, method: 'get', url: baseUrl};
            if (method === 'detail') result.ajax[method] = {name, method: 'get', url: `${baseUrl}/{id}`};
            if (method === 'modify') result.ajax[method] = {name, method: 'put', url: baseUrl};
            if (method === 'add') result.ajax[method] = {name, method: 'post', url: baseUrl};
            if (method === 'delete') result.ajax[method] = {name, method: 'del', url: `${baseUrl}/{id}`};
            if (method === 'batchDelete') result.ajax[method] = {name, method: 'del', url: baseUrl};
        }
    });

    // 处理页面默认路由地址
    if (!result.path) result.path = `/${inflection.pluralize(moduleName)}`;

    result.ModuleName = inflection.camelize(moduleName);
    result.ModuleNames = inflection.pluralize(result.ModuleName);

    return result;
}

// 获取页面类型配置
function getPagesConfig(configArr, moduleName = '') {
    const config = getBlockConfig(configArr, '页面类型配置');

    if (!config) return null;

    const defaultPages = [
        '列表页面', 'list-hooks.js', 'index.jsx',
        '弹框表单', 'edit-modal-hooks.js', 'EditModal.jsx',
        '页面表单', 'edit-hooks.js', 'Edit.jsx',
    ];

    let result = null;

    config.forEach(item => {
        const [typeName, templateAndFilePath] = item;
        if (!templateAndFilePath) {
            const index = defaultPages.indexOf(typeName);
            if (index < 0) return;
            const templateFileName = defaultPages[index + 1];
            const fileName = defaultPages[index + 2];

            if (!result) result = [];
            result.push({
                typeName,
                filePath: path.join(PAGES_DIR, moduleName, fileName),
                template: path.join(__dirname, 'templates', templateFileName),
            });
        } else {
            const [templateFilePath, fileName] = templateAndFilePath.split('->');
            if (!result) result = [];
            result.push({
                typeName,
                filePath: path.join(PAGES_DIR, moduleName, fileName),
                // 用户模版要基于项目根目录编写
                template: path.join(process.cwd(), templateFilePath),
            });
        }
    });

    return result;
}

// 获取查询条件配置
function getQueryConfig(configArr, fromColumn) {
    return getElement(configArr, '查询条件配置', 'q', fromColumn);
}

// 获取工具条配置
function getToolConfig(configArr) {
    const defaultProps = [
        '添加', '', 'plus',
        '删除', 'handleBatchDelete', 'delete',
        '导入', 'handleImport', 'import',
        '导出', 'handleExport', 'export',
    ];

    return getHandle(configArr, '工具条配置', defaultProps);
}

// 获取表格配置
function getTableConfig(configArr) {
    const config = getBlockConfig(configArr, '表格配置');

    if (!config) return null;

    const defaultProps = [
        '可选中', 'selectable',
        '分页', 'pagination',
        '序号', 'serialNumber',
    ];

    let result = null;
    config.forEach((item) => {
        let [text] = item;
        const index = defaultProps.indexOf(text);
        if (index > -1) {
            if (!result) result = {};
            result[defaultProps[index + 1]] = true;
        }
    });

    return result;
}

// 获取表格列配置
function getColumnConfig(configArr) {
    const config = getBlockConfig(configArr, '表格列配置');

    if (!config) return null;

    let result = null;
    config.forEach((item, i) => {
        let [title, dataIndex = `dataIndex${i}`] = item;

        if (!result) result = [];

        result.push({
            title,
            dataIndex,
        });
    });

    return result;
}

// 获取操作列配置
function getOperatorConfig(configArr) {
    const defaultProps = [
        '修改', '', 'form',
        '删除', 'handleDelete', 'delete',
    ];

    const result = getHandle(configArr, '操作列配置', defaultProps);
    const iconModeIndex = result.findIndex(item => item.text === '图标模式');

    if (iconModeIndex > -1) {
        result.splice(iconModeIndex, 1);
        // 默认图标 question-circle
        result.forEach(item => {
            item.icon = item.icon || 'question-circle';
            item.iconMode = true;
        });
    } else {
        // 非图标模式
        result.forEach(item => item.iconMode = false);
    }

    return result.length ? result : null;
}

// 获取表单配置
function getFormConfig(configArr, fromColumn) {
    return getElement(configArr, '表单元素配置', 'f', fromColumn);
}


async function readDataBase(dataBaseConfig) {
    const {url, tableName: table, database} = dataBaseConfig;
    const tableColumns = await getTableColumns({url, table, database});

    let columns = null;
    let forms = null;

    if (tableColumns && tableColumns.length) {
        tableColumns.forEach(item => {
            const {name: field, chinese, isNullable, type: oType, length: maxLength} = item;
            const label = chinese || field;

            if (!COMMON_EXCLUDE_FIELDS.includes(field)) {
                if (!columns) columns = [];
                columns.push({
                    title: label,
                    dataIndex: field,
                });

                const required = !isNullable;
                let type = getFormElementType({oType, label});
                if (!forms) forms = [];
                forms.push({
                    type,
                    label,
                    field,
                    required,
                    maxLength,
                });
            }
        });
    }
    return {
        columns,
        forms,
    };
}

/**
 * 获取各种配置信息
 * */
async function getConfig(configFilePath, configFileContent) {
    const configArray = configFileContent.split('\n');
    const dataBaseConfig = getDataBaseConfig(configArray);
    const baseConfig = getBaseConfig(configArray, dataBaseConfig.tableName);
    const pageConfig = getPagesConfig(configArray, baseConfig.moduleName);
    const interfaceConfig = getInterfaceConfig(configArray);
    const toolConfig = getToolConfig(configArray);
    const tableConfig = getTableConfig(configArray);
    const operatorConfig = getOperatorConfig(configArray);

    let columns = getColumnConfig(configArray);
    let queries = getQueryConfig(configArray, true);
    let forms = getFormConfig(configArray, true);


    // 从接口中获取先关信息
    if (interfaceConfig && interfaceConfig.url) {
        logSuccess(`基于Swagger文档: ${interfaceConfig.url}`);
        const configFromSwagger = await readSwagger(interfaceConfig, baseConfig);

        queries = configFromSwagger.queries;

        if (configFromSwagger.columns) columns = configFromSwagger.columns;
        if (configFromSwagger.forms) forms = configFromSwagger.forms;

        if (!configFromSwagger.columns) logWarning('表格列配置，将使用配置文件中的《表格列配置》');
        if (!configFromSwagger.forms) logWarning('表单配置，将使用配置文件中的《表单配置》');

    } else if (dataBaseConfig && dataBaseConfig.tableName) {
        // 数据库表中获取信息
        logSuccess(`基于数据库表: ${dataBaseConfig.database}.${dataBaseConfig.tableName}`);
        const configFromTableName = await readDataBase(dataBaseConfig, baseConfig);

        if (configFromTableName.columns) columns = configFromTableName.columns;
        if (configFromTableName.forms) forms = configFromTableName.forms;

        logWarning('查询条件，将使用配置文件中的《查询条件配置》');
        if (!configFromTableName.columns) logWarning('表格列配置，将使用配置文件中的《表格列配置》');
        if (!configFromTableName.forms) logWarning('表单配置，将使用配置文件中的《表单配置》');
    } else {
        logSuccess(`基于配置文件: ${configFilePath.replace(process.cwd(), '')}`);
    }

    // 如果 forms 为空，将获取所有的columnConfig作为form表单元素，默认type=input
    if (!forms) {
        forms = columns.map(item => ({type: 'input', label: item.title, field: item.dataIndex}));
    }

    return pageConfig.map(item => ({
        fileTypeName: item.typeName,
        filePath: item.filePath, // 保存文件名，完整的路径
        template: item.template, //  获取文件内容的函数
        base: baseConfig,
        pages: pageConfig,
        queries, // 查询条件配置
        tools: toolConfig,  // 工具条配置
        table: tableConfig, // 表格配置
        columns, // 列配置
        operators: operatorConfig, // 操作列配置
        forms, // 表单元素配置
    }));
}

module.exports = getConfig;

const path = require('path');

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
    'switch',
    'date',
    'time',
    'date-time',
    'date-range',
    'cascader',
    'json',
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
    const type = strArr.find(item => ELEMENT_TYPES.includes(item)) || 'input';
    arrayRemove(strArr, type);

    // 获取是否必填
    const required = strArr.includes('r');
    arrayRemove(strArr, 'r');

    // 获取 label field
    let [label, field] = strArr;
    if (!field) field = getRandomField();

    return {
        type,
        label,
        field,
        required,
    }
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
                && !item.startsWith(';')
        })
        .map(item => {
            // 将一行文本进行空格拆分 并去掉空元素
            const lineArr = item.split(' ').filter(item => !!item);

            // 将注释去掉
            const index = lineArr.findIndex(it => it === '//' || it === '#' || it === ';');
            if (index !== -1) lineArr.splice(index);

            return lineArr;
        })
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
        })
    });

    return result
}

function getElement(configArr, title, fromColumn) {
    const config = getBlockConfig(configArr, title) || [];
    const column = fromColumn ? getBlockConfig(configArr, '表格列配置') : [];

    if (!config.length && !column.length) return null;

    const columnQuery = column.filter(item => item.includes('q'));
    const resultQuery = config.map(item => getFormElement(item));
    const resultColumn = columnQuery.map(item => getFormElement(item));

    // 去重
    const result = [...resultQuery];
    resultColumn.forEach(item => {
        if (!result.find(it => it.label === item.label)) {
            result.push(item);
        }
    });

    if (!result.length) return null;

    return result;
}

// 接口配置
function getInterface(configArr) {
    const config = getBlockConfig(configArr, '接口配置');

    if (!config) return null;

    let result = null;
    [
        'url',
        'userName',
        'password',
        'get',
        'post',
        'put',
        'delete',
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
function getDataBase(configArr) {
    const config = getBlockConfig(configArr, '数据库配置');

    if (!config) return null;

    let result = null;
    [
        'url',
        'userName',
        'password',
        'tableName',
    ].forEach(key => {
        const cfg = config.find(item => item.length && item[0] === key);
        if (cfg) {
            if (!result) result = {};

            result[key] = cfg[1];
        }
    });

    return result;
}

// 获取基本配置
function getBaseConfig(configArr) {
    const config = getBlockConfig(configArr, '基础配置');

    if (!config) return null;

    let result = null;
    const keyMap = {
        'moduleName': '目录',
        'path': '路由',
        'ajaxUrl': '请求',
    };
    Object.values(keyMap)
        .forEach(value => {
            const key = Object.entries(keyMap).find(item => item[1] === value)[0];
            const cfg = config.find(item => item.length && item[0] === value);

            if (cfg) {
                if (!result) result = {};

                result[key] = cfg[1];
            }
        });
    return result;
}

// 获取页面类型配置
function getPages(configArr, moduleName = '') {
    const config = getBlockConfig(configArr, '页面类型配置');

    if (!config) return null;

    const defaultPages = [
        '列表页', 'list.js', 'index.jsx',
        '弹框编辑', 'edit-modal.js', 'EditModal.jsx',
        '页面编辑', 'edit.js', 'Edit.jsx',
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
            })
        } else {
            const [templateFileName, fileName] = templateAndFilePath.split('->');
            if (!result) result = [];
            result.push({
                typeName,
                filePath: path.join(PAGES_DIR, moduleName, fileName),

                // TODO 用户自定义模板写在哪儿呢？
                template: path.join(__dirname, 'templates', templateFileName),
            })
        }
    });

    return result
}

// 获取查询条件配置
function getQuery(configArr, fromColumn) {
    return getElement(configArr, '查询条件配置', fromColumn);
}

// 获取工具条配置
function getTools(configArr) {
    const defaultProps = [
        '添加', 'handleAdd', 'plus',
        '批量删除', 'handleBatchDelete', 'delete',
        '导入', 'handleImport', 'import',
        '导出', 'handleExport', 'export',
    ];

    return getHandle(configArr, '工具条配置', defaultProps);
}

// 获取表格配置
function getTable(configArr) {
    const config = getBlockConfig(configArr, '表格配置');

    if (!config) return null;

    const defaultProps = [
        '可选中', 'selectable',
        '分页', 'pagination',
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

    return result
}

// 获取表格列配置
function getColumns(configArr) {
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
function getOperator(configArr) {
    const defaultProps = [
        '修改', 'handleEdit', 'form',
        '详情', 'handleEdit', 'detail',
        '删除', 'handleDelete', 'delete',
    ];

    const result = getHandle(configArr, '操作列配置', defaultProps);
    const iconModeIndex = result.findIndex(item => item.text === '图标模式');

    if (iconModeIndex > -1) {
        result.splice(iconModeIndex, 1);
        // 默认图标 help
        result.forEach(item => {
            item.icon = item.icon || 'help';
            item.iconMode = true;
        });
    } else {
        // 非图标模式
        result.forEach(item => item.iconMode = false);
    }

    return result;
}

// 获取表单配置
function getForm(configArr, fromColumn) {
    return getElement(configArr, '表单元素配置', fromColumn);
}

/**
 * 获取各种配置信息
 * */
module.exports = function (configFileContent) {
    const configArray = configFileContent.split('\n');
    const dbConfig = getDataBase(configArray);
    const baseConfig = getBaseConfig(configArray);
    const pages = getPages(configArray, baseConfig.moduleName);
    const interfaceConfig = getInterface(configArray);
    const query = getQuery(configArray);
    const tool = getTools(configArray);
    const table = getTable(configArray);
    const columns = getColumns(configArray);
    const operatorColumn = getOperator(configArray);
    const form = getForm(configArray);

    console.log(form);

    return [
        {
            fileName: '', // 保存文件名，完整的路径
            template: '', //  获取文件内容的函数
            queries: [ // 查询条件配置

            ],
            tools: [  // 工具条配置

            ],
            table: { // 表格配置

            },
            columns: [ // 列配置

            ],
            operators: [ // 操作列配置

            ],
            forms: [ // 表单元素配置

            ],
        },
    ];
};

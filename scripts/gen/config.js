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
    arr.splice(index, 1);
}

/**
 * 从字符串中提取form表单元素相关配置
 * @param str
 */
function getFormElement(str) {
// 用户名 userName input r
    if (!str) return;

    // 非表单相关
    const excludes = [' ', 'q', 'f'];
    const strArr = str
        .split(' ') // 以空格进行分割
        .filter(item => !excludes.includes(item)); // 过滤掉不想关配置

    if (!strArr.length) return;

    // 获取表单类型 默认 input
    const type = strArr.find(item => ELEMENT_TYPES.includes(item)) || 'input';
    arrayRemove(type);

    // 获取是否必填
    const required = strArr.includes('r');
    arrayRemove('r');

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
        return item.includes(BLOCK_FLAG)
            && item.includes(title);
    });

    // 没有相关配置
    if (startIndex < 0) return null;

    const endIndex = configArr.slice(startIndex + 1)
        .findIndex(item => item.includes(BLOCK_FLAG)) + startIndex;

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

// 数据库配置
function getDataBase(configArr) {
    const config = getBlockConfig(configArr, '数据库配置');

    if (!config) return null;

    const result = {};
    [
        'url',
        'userName',
        'password',
        'tableName',
    ].forEach(key => {
        const cfg = config.find(item => item.length && item[0] === key);
        if (cfg) result[key] = cfg[1];
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

    const result = [];

    config.forEach(item => {
        const [typeName, templateAndFilePath] = item;
        if (!templateAndFilePath) {
            const index = defaultPages.indexOf(typeName);
            if (index < 0) return;
            const templateFileName = defaultPages[index + 1];
            const fileName = defaultPages[index + 2];

            result.push({
                typeName,
                filePath: path.join(PAGES_DIR, moduleName, fileName),
                template: path.join(__dirname, 'templates', templateFileName),
            })
        } else {
            const [templateFileName, fileName] = templateAndFilePath.split('->');
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
function getQuery(configArr) {

}

// 获取工具条配置
function getTools(configArr) {

}

// 获取表格配置
function getTable(configArr) {

}

// 获取表格列配置
function getColumns(configArr) {

}

// 获取操作列配置
function getOperator(configArr) {

}

// 获取表单配置
function getForm(config) {

}

/**
 * 获取各种配置信息
 * */
module.exports = function (configFileContent) {
    const configArray = configFileContent.split('\n');
    const dbConfig = getDataBase(configArray);
    const baseConfig = getBaseConfig(configArray);
    const pages = getPages(configArray, baseConfig.moduleName);

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

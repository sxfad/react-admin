const globby = require('globby');
const path = require('path');
const fs = require('fs');
const {pathToRegexp} = require('path-to-regexp');

module.exports = function () {
    // 路由文件所在目录
    const routePagePath = path.resolve(__dirname, '../src/pages');

    // 路由文件
    const pages = path.join(routePagePath, '/**/*.jsx');

    // 将路由页面所在目录添加到依赖当中，当有文件变化，会触发这个loader
    this.addContextDependency(routePagePath);

    // 获取所有的文件名
    const fileNames = globby.sync(pages, {ignore: [], absolute: true});
    const result = {};

    fileNames.forEach(fileName => {
        const content = fs.readFileSync(fileName, 'UTF-8');
        const config = getConfigFromContent(content);

        if (config) result[fileName] = config;
    });

    const err = checkPath(result);
    if (err) throw Error(err);

    return getRouteFileContent(result);
};

// 检测路由配置冲突
function checkPath(result) {
    const arr = Object.entries(result);
    for (const [filePath, config] of arr) {
        const {path} = config;
        const exit = arr.find(([f, c]) => {
            return f !== filePath && (c.path === path || pathToRegexp(c.path).exec(path) || pathToRegexp(path).exec(c.path));
        });
        if (exit) {
            return `路由地址：${path} 与 ${exit[1].path} 配置冲突，对应文件文件如下：
${filePath}
${exit[0]}`;
        }
    }
    return false;
}


/**
 * 从文件内容中获取配置内容
 * @param content
 * @returns {*}
 */
function getConfigFromContent(content) {
    // 最终匹配的结果
    let result;

    // 删除注释
    const reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;
    let noCommentContent = content.replace(reg, function (word) {
        return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? '' : word;
    });

    // 基于常量 PAGE_ROUTE 进行路由匹配
    const patt = /export const PAGE_ROUTE = [ ]*['"]([^'"]+)['"][;]*/gm;
    let block = null;

    while ((block = patt.exec(noCommentContent)) !== null) {
        const match = block[0] && block[1];

        // 匹配到 routePath 直接返回
        if (match) {
            if (!result) result = {};
            result.path = block[1];
            break;
        }
    }


    const importIndex = noCommentContent.indexOf('import config');
    if (importIndex === -1) return result;

    let configIndex = noCommentContent.indexOf('config(');

    if (configIndex === -1) return result;

    // 获取config参数，{}包裹的内容
    noCommentContent = noCommentContent.substring(configIndex);
    noCommentContent = getCurlyBracketContent(noCommentContent);

    if (!noCommentContent) return result;

    // 需要抓取的属性
    const configs = {
        path: 'string',
        noFrame: 'boolean',
        noAuth: 'boolean',
        keepAlive: 'boolean',
    };

    Object.keys(configs).forEach(key => {
        const type = configs[key];
        // const patt = /path:[ ]*['"]([^'"]+)['"][;]*/gm;
        let patt = new RegExp(`${key}:[ ]*['"]([^'"]+)['"][,]*`, 'gm');
        if (type === 'string') patt = new RegExp(`${key}:[ ]*['"]([^'"]+)['"][,]*`, 'gm');

        if (type === 'boolean') patt = new RegExp(`${key}:[ ]*(true|false)[,]*`, 'gm');

        let block = null;
        while ((block = patt.exec(noCommentContent)) !== null) {
            const match = block[0] && block[1];

            // 匹配到了
            if (match) {
                if (!result) result = {};
                result[key] = block[1];
                break;
            }
        }
    });
    return result;
}

// 获取 {} 内的内容 算法不是很严谨，如果字符串中含有不成对的{}，会出错
function getCurlyBracketContent(content) {
    const stack = [];
    const left = '{';
    const right = '}';
    const startIndex = content.indexOf(left);
    if (startIndex === -1) return '';

    content = content.substring(startIndex);

    for (let i = 0; i < content.length; i++) {

        let s = content[i];
        if (left === s) {
            stack.push(s);
        }
        if (right === s) {
            stack.pop();
            if (stack.length === 0) {
                return content.substring(0, i + 1);
            }
        }
    }

    return '';
}

function getRouteFileContent(config) {
    const noFrames = [];
    const noAuths = [];
    const keepAlives = [];
    const routes = [];

    Object.entries(config).forEach(([filePath, {path, keepAlive, noAuth, noFrame}]) => {
        if (!path) return;

        if (noFrame === 'true') noFrames.push(`'${path}'`);
        if (noAuth === 'true') noAuths.push(`'${path}'`);
        if (keepAlive) keepAlives.push(`    {
        path: '${path}',
        keepAlive: ${keepAlive},
    }`);
        routes.push(`    {
        path: '${path}',
        component: () => import('${filePath}'),
    }`);
    });


    return `// 此文件是通过脚本生成的，直接编辑无效！！！

// 不需要导航框架的页面路径
export const noFrames = [
    ${noFrames.join(',\r\n    ')}
];

// 不需要登录就可以访问的页面路径
export const noAuths = [
    ${noAuths.join(',\r\n    ')}
];

// 需要keep alive 页面
export const keepAlives = [
${keepAlives.join(',\r\n')}
];

// 页面路由配置
export default [
${routes.join(',\r\n')}
];
    `;
}

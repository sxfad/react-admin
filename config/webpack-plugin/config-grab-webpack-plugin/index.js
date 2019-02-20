const path = require('path');
const fs = require('fs');
const GrabFiles = require('../utils/grab-files');
const ejs = require('ejs');


const pluginName = 'ConfigGrabWebpackPlugin';

class Plugin {
    constructor(options) {
        // 处理默认值
        const {
            hyphen = false,
            codeSplitting = true,
            paths,
            pagePath,
            ignored,
            output,
            watch,
            template,
            displayLog = false,
        } = options;

        this.options = {
            hyphen,
            codeSplitting,
            paths,
            pagePath,
            ignored,
            output,
            watch,
            template,
            displayLog,
        };

        if (!template) {
            this.options.template = codeSplitting ?
                path.resolve(__dirname, './template-code-splitting.ejs')
                :
                path.resolve(__dirname, './template.ejs');
        }
    }

    apply(compiler) {
        const options = this.options;

        compiler.hooks.entryOption.tap(pluginName, () => {
                doGrab(options);
            }
        );
    }

    modelGrab() {
        doGrab(this.options);
    }
}

function doGrab(options) {
    const {paths, ignored, watch, displayLog} = options;
    const grabFiles = new GrabFiles({content: true, paths, ignored, displayLog});

    if (watch) {
        grabFiles.watch(function (result, event, pathName) {
            writeRouteConfigFile(options, result, event, pathName);
        });
    } else {
        writeRouteConfigFile(options, grabFiles.getResult());
    }
}

function writeRouteConfigFile(options, result) {
    const {output, template} = options;
    const routes = [];
    const noFrames = [];
    const noAuths = [];
    const keepAlives = [];
    for (let i = 0; i < result.length; i++) {
        const {content} = result[i];
        const configs = getConfigFromContent(content);

        const routePath = configs.path;
        const {noFrame, noAuth, keepAlive} = configs;

        if (routePath) {
            routes.push({routePath, ...result[i]});
            if (noFrame === 'true') noFrames.push(routePath);
            if (noAuth === 'true') noAuths.push(routePath);
            if (keepAlive === 'true') keepAlives.push({path: routePath, keep: true});
            if (keepAlive === 'false') keepAlives.push({path: routePath, keep: false});
        }
    }
    writeByTemplate(template, {routes: routes, noFrames, noAuths, keepAlives}, output);
}

/**
 * 基于ejs模版，以及获取的文件信息写文件
 * @param template
 * @param config
 * @param output
 */
function writeByTemplate(template, config, output) {
    // 处理平台兼容性
    if (config.routes && config.routes.length) {
        config.routes.forEach(item => {
            const {routePath, path} = item;
            item.routePath = routePath.replace(/\\/gm, '/').replace('//', '/');
            item.path = path.replace(/\\/gm, '\\\\');
        });
    }

    const templateStr = fs.readFileSync(template, 'UTF-8');
    const fileContent = ejs.render(templateStr, config);

    fs.writeFileSync(output, fileContent);
}

/**
 * 从文件内容中获取路由地址
 * @param content
 * @returns {*}
 */
function getConfigFromContent(content) {
    // 最终匹配的结果
    const result = {};

    // 删除注释
    const reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;
    let noCommentContent = content.replace(reg, function (word) {
        return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
    });

    // 基于常量 PAGE_ROUTE 进行路由匹配
    const patt = /export const PAGE_ROUTE = [ ]*['"]([^'"]+)['"][;]*/gm;
    let block = null;

    while ((block = patt.exec(noCommentContent)) !== null) {
        const match = block[0] && block[1];

        // 匹配到 routePath 直接返回
        if (match) {
            result.path = block[1];
            break;
        }
    }


    // 截取@config部分字符串，提高正则匹配命中率
    const configIndex = noCommentContent.indexOf('@config');

    if (configIndex === -1) return result;

    noCommentContent = noCommentContent.substring(configIndex);

    const classIndex = noCommentContent.indexOf('class');

    if (!classIndex) return result;

    noCommentContent = noCommentContent.substring(0, classIndex);


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
                result[key] = block[1];
                break;
            }
        }
    });
    return result;
}

module.exports = Plugin;

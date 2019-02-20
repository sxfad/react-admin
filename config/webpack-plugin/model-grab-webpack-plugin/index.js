const path = require('path');
const fs = require('fs');
const GrabFiles = require('../utils/grab-files');
const ejs = require('ejs');

const pluginName = 'ModelGrabWebpackPlugin';

class Plugin {
    constructor(options) {
        // 处理默认值
        const {
            paths,
            ignored,
            output,
            watch,
            template = path.resolve(__dirname, './template.ejs'),
            displayLog = false,
        } = options;

        this.options = {
            paths,
            ignored,
            output,
            watch,
            template,
            displayLog,
        };
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

    const grabFiles = new GrabFiles({paths, ignored, displayLog});

    if (watch) {
        grabFiles.watch(function (result, event, pathName) {
            // 基于文件路径抓取，文件内容改变不需要从新抓取
            if (event === 'change') return;

            writeModelFile(options, result, event, pathName);
        });
    } else {
        writeModelFile(options, grabFiles.getResult());
    }
}

function writeModelFile(options, result) {
    const {output, template} = options;
    const res = [];

    result.forEach(item => {
        let modelName = getModelName(item.path);
        const existModelName = res.find(it => it.modelName === modelName);

        if (existModelName) {
            throw new Error(`model name can not be same: ${modelName}, \n ${item.path} \n-> ${existModelName.path}`);
        }

        res.push({modelName, ...item});
    });

    writeByTemplate(template, {result: res}, output);
}

/**
 * 基于ejs模版，以及获取的文件信息写文件
 * @param template
 * @param config
 * @param output
 */
function writeByTemplate(template, config, output) {
    if (config.result && config.result.length) {
        config.result.forEach(item => {
            const {path} = item;
            item.path = path.replace(/\\/gm, '\\\\');
        });
    }
    const templateStr = fs.readFileSync(template, 'UTF-8');
    const fileContent = ejs.render(templateStr, config);

    fs.writeFileSync(output, fileContent);
}


/**
 * 连字符(-) 命名 转 首字母小写 驼峰命名
 * @param str
 */
function firstLowerCase(str) {
    return str.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}

/**
 * 获取文件名 比如：
 * /path/to/user-center.js
 * /path/to/user-center.model.js
 * /path/to/user-center/model.js
 * 获取userCenter
 * @param pathName
 * @returns {*}
 */
function getModelName(pathName) {
    const baseName = path.basename(pathName);
    let fileName = baseName.replace(path.extname(pathName), '');

    // 如果直接 模块直接以model.js命名，取其父级目录为modelName
    if (baseName === 'model.js') {
        let pns;
        if (pathName.indexOf(path.sep) > -1) {
            pns = pathName.split(path.sep);
        } else {
            pns = pathName.split('/');
        }
        fileName = pns[pns.length - 2];
    }

    return firstLowerCase(fileName.replace('.model', ''));
}

module.exports = Plugin;

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

/**
 * 连字符(-) 命名 转 首字母大写转驼峰命名
 * @param str
 */
function firstUpperCase(str) {
    const s = str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2);
    return s.replace(/-/g, '');
}

/**
 * 连字符(-) 命名 转 首字母小写 驼峰命名
 * @param str
 */
function firstLowerCase(str) {
    return str.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}

/**
 * 连字符(-) 命名 转 大写 + 下划线
 * @param str
 * @returns {string}
 */
function allUpperCase(str) {
    const s = str.toUpperCase();
    return s.replace(/-/g, '_');
}

/**
 * 基于配置，获取生成的文件内容
 * @param cfg
 */
function getFileContent(cfg) {
    let {template} = cfg;
    template = path.join(__dirname, template);

    return new Promise((resolve, reject) => {
        ejs.renderFile(template, cfg, (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
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


/**
 * 基于配置，生成文件
 * @param cfg 配置信息
 */
function generateFile(cfg) {

    const {
        outPutFile,
    } = cfg;

    return getFileContent(cfg).then((content) => writeFileSync(outPutFile, content));
}

/**
 * 递归，获取目录结构，忽略node_modules 隐藏文件
 * @param dir
 * @param root
 * @returns {{key: *, label, value: *, shortValue}}
 */
function walkDir(dir, root) {
    const sep = path.sep;

    const label = dir.split(sep)[dir.split(sep).length - 1];

    let result = {
        key: dir,
        label,
        title: label,
        value: dir,
        shortValue: dir.replace(root, ''),
    };

    const isIgnoreDir = (dirName) => {
        return dirName === 'node_modules' || dirName.startsWith('.');
    };

    fs.readdirSync(dir).forEach(function (dirName) {
        if (!isIgnoreDir(dirName)) {
            const path = dir + sep + dirName;
            const stat = fs.statSync(path);

            if (!result.children) result.children = [];

            if (stat && stat.isDirectory()) {
                result.children = result.children.concat(walkDir(path, root))
            }
        }
    });

    return result;
}

/**
 * 获取目录结构，如果存在src目录，直接返回src目录
 * 否则返回当前目录结构
 * walkDir中过滤掉了node_modules
 */
function getDirs() {
    const cwd = process.cwd();
    const src = path.join(cwd, 'src');

    // 存在src目录
    if (fs.existsSync(src)) {
        return walkDir(src, src);
    }
    return walkDir(cwd, cwd);
}

module.exports = {
    firstUpperCase,
    firstLowerCase,
    allUpperCase,
    writeFileSync,
    walkDir,
    getDirs,
    generateFile,
    getFileContent,
};

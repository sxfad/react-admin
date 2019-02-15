const path = require('path');
const fs = require('fs');
const globby = require('globby');
const chokidar = require('chokidar');
const ejs = require('ejs');
const sourceFilePath = [
    path.resolve(__dirname, './components/*'),
];
const watchSourceFilePath = path.resolve(__dirname, './components/**/**.*');
const ignore = [
    path.resolve(__dirname, './components/*.*'),
    // path.resolve(__dirname, '../src/components/index.js'),
    // path.resolve(__dirname, '../src/components/index.less'),
    // path.resolve(__dirname, '../src/components/README.md'),
];
const menusFilePath = path.resolve(__dirname, '../../menus-ant-design-example.js');
const demoPath = path.resolve(__dirname, '../../pages/examples/antd');
const template = path.resolve(__dirname, './template.ejs');


// 删除历史文件
deleteDir(menusFilePath);
deleteDir(demoPath);

function watch() {
    chokidar.watch(watchSourceFilePath).on('all', (event, pathName) => {
        if (pathName.endsWith('/README.md')) {
            // 如果是 README.md 文件相关，直接重新生成
            generator();
        } else if (event === 'add' || event === 'unlink') {
            // 监听是，新增或删除文件时 才重新生成
            generator();
        }
    });
}

function generator() {
    const files = globby.sync(sourceFilePath, {ignore, absolute: true});
    if (files && files.length) {
        const options = [];
        for (let i = 0; i < files.length; i++) {
            options.push(getOption(files[i]));
        }
        options.forEach(writeFile);
        writeMenus(options);
    }
}

/**
 * 获取没个组件要生成demo文档的信息
 * @param componentDir
 * @returns {{componentName, demoFiles: *, title: string, readmeContents: string[]}}
 */
function getOption(componentDir) {
    const demoFiles = globby.sync(path.join(componentDir, '/demo/**.jsx'));
    const readmePath = path.join(componentDir, '/README.md');
    const componentName = componentDir.split(path.sep).pop();
    const {contents = ['', ''], title = ''} = getReadmeFileContent(readmePath);

    return {
        componentName,
        demoFiles,
        title,
        readmeContents: contents,
    };
}

/**
 * 写入每个组件的demo文件
 * @param componentName
 * @param readmeContents
 * @param demoFiles
 */
function writeFile({componentName, readmeContents, demoFiles}) {
    const demos = getDemosFile(demoFiles);
    const cfg = {
        componentName,
        readmeTop: readmeContents[0] || '',
        readmeBottom: readmeContents[1] || '',
        demos
    };

    ejs.renderFile(template, cfg, (err, content) => {
        if (err) {
            return console.log(err);
        }
        const p = path.join(demoPath, componentName, 'index.jsx');
        writeFileSync(p, content);
    });
}

/**
 * 写入所有组件对相应的菜单文件
 * @param options
 */
function writeMenus(options) {
    if (!options || !options.length) return;

    const menus = options.map(({componentName, title}) => {
        return `    {
        key: '/example/antd/${componentName}', 
        parentKey: 'component', 
        icon: 'deployment-unit',
        local: '${firstLowerCase(componentName)}',
        text: '${firstUpperCase(componentName)} ${title}', 
        path: '/example/antd/${componentName}',
    },`;
    });

    console.log(options.map(({componentName, title}) => {
        return `${firstLowerCase(componentName)}: '${title.replace('# ', '')}',`;
    }).join('\n'));
    console.log(options.map(({componentName, title}) => {
        return `${firstLowerCase(componentName)}: '${firstUpperCaseSpace(componentName)}',`;
    }).join('\n'));


    menus.unshift('export default [');
    menus.push('];');
    const content = menus.join('\n');

    fs.writeFileSync(menusFilePath, content);
}

function getDemosFile(demoFiles) {
    if (demoFiles && demoFiles.length) {
        const demoContents = [];
        for (let i = 0; i < demoFiles.length; i++) {
            const df = demoFiles[i];
            const demoName = path.basename(df).replace(`${path.extname(df)}`, '');
            const demoCode = getDemoCode(df);
            demoContents.push({
                name: demoName,
                code: demoCode,
            });
        }

        return demoContents;
    }

    return [];
}

function getDemoCode(demoFile) {
    if (!fs.existsSync(demoFile)) return '';

    let content = fs.readFileSync(demoFile, 'UTF-8');

    return content.split('export const title')
        .shift()
        .replace(/`/g, '\\`').replace(/\${/g, '\\${') // 对模版字符串相关语法进行转义
        .replace('../../index', 'sx-antd') // 替换引用路径
        .replace('../font-awesome', 'sx-antd/lib/font-awesome'); // 替换引用路径
}

function getReadmeFileContent(readmePath) {
    if (!readmePath) return '';
    if (!fs.existsSync(readmePath)) return '';

    let content = fs.readFileSync(readmePath, 'UTF-8');

    content = content.replace(/`/g, '\\`').replace(/\${/g, '\\${');


    // 获取title
    const titleContents = content.split('\n');
    let title = '';
    for (let i = 0; i < titleContents.length; i++) {
        let t = titleContents[i];

        if (t) {
            title = t;
            break;
        }

    }

    // 以 ## API 为标记，拆分成两部分
    const contents = content.split('## API');

    if (contents.length >= 2) {
        contents[1] = `## API\n${contents[1]}`;
    }
    return {contents, title};
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
 * 删除文件夹及文件
 * @param dir
 */
function deleteDir(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
        if (fs.lstatSync(dir).isFile()) {
            fs.unlinkSync(dir);
        } else {
            files = fs.readdirSync(dir);
            files.forEach(function (file) {
                const curPath = path.join(dir, file);
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteDir(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir);
        }
    }
}

/**
 * 连字符(-) 命名 转 首字母大写转驼峰命名
 * @param str
 */
function firstUpperCase(str) {
    const s = str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2);
    return s.replace(/-/g, '');
}


/**
 * 连字符(-) 命名 转 首字母大写 空格隔开
 * @param str
 */
function firstUpperCaseSpace(str) {
    const s = str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2);
    return s.replace(/-/g, ' ');
}

/**
 * 连字符(-) 命名 转 首字母小写 驼峰命名
 * @param str
 */
function firstLowerCase(str) {
    return str.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}

generator();
// watch();
module.exports = {
    generator,
    watch,
};

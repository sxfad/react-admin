const result = {};

// models 目录下 不支持子文件夹
const req = require.context('./', false, /\.js$/);

req.keys().forEach(key => {
    if ([
        './all-models.js',
        './index.js',
        './models.js',
    ].includes(key)) return;
    const model = req(key);
    const name = getModelName(key);
    result[name] = model.default;
});

// pages 目录下 支持子文件夹
const reqPages = require.context('../pages', true, /\.js$/);

reqPages.keys().forEach(key => {
    if (!key.endsWith('model.js')) return;

    const model = reqPages(key);
    const name = getModelName(key);

    result[name] = model.default;
});

console.log(result);
export default result;

/** 获取模块名 */
function getModelName(filePath) {
    // models/page.js 情况
    let name = filePath.replace('./', '').replace('.js', '');

    const names = filePath.split('/');
    const fileName = names[names.length - 1];
    const folderName = names[names.length - 2];

    // users/model.js 情况
    if (fileName === 'model.js') name = folderName;

    // users/center.model.js 情况
    if (fileName.endsWith('.model.js')) {
        name = fileName.replace('.model.js', '').replace(/\./g, '-');
    }

    return name.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}

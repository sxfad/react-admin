const result = {};
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

export default result;

/** 获取模块名 */
function getModelName(filePath) {

    const baseName = filePath.replace('./', '').replace('.js', '');

    return baseName.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}

# model抓取工具
model文件可以集中写在models目录中，也可以分散写在各个模块中，以 model.js 或 user.model.js命名，通过脚本统将引用一收集到一起。

## 抓取方式
model文件命名约定，英文小写 加 连字符（减号）
```
/path/to/modle/user.js -> export user from '/path/to/modle/user.js';
/path/to/pages/user-center/model.js -> export userCenter from '/path/to/pages/user-center/model.js';
/path/to/pages/user-center/user-center.model.js -> export userCenter from '/path/to/pages/user-center/user-center.model.js';
```

### 参数
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
paths | 需要抓取的目录，一般是`/path/to/pages/**/*.jsx` | string or [string] | -
ignored | 需要忽略的文件 | string or [string] | -
output | 生成的文件输出目录 | string | -
watch | 是否启用监听模式，一般开发模式下是true | boolen | -
template | 文件生成模版，ejs文件，如果生成的文件不符合期望，可以自己通过模版生成文件内容 | string | -
displayLog | 是否显示log信息 | boolean | false

### template模版文件能得到的数据
参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- 
modelName | 模块名 | string | -
path | 文件绝对路径 | string | - 
fileName | 不带扩展名的文件名 | string | -
baseName | 含有扩展名的文件名 | string | -

### 非webpack插件方式使用
```
const path = require('path');

const ModelGrabWebpackPlugin = require('sx-model-grab-webpack-plugin');

const rcgwp = new ModelGrabWebpackPlugin({
    paths: [
        path.resolve(__dirname, './src/models/**/*.js'),
        path.resolve(__dirname, './src/pages/**/model.js'),
        path.resolve(__dirname, './src/pages/**/*.model.js'),
    ],
    ignored: [
        "**/index.js",
        "**/all-models.js"
    ],
    output: path.resolve(__dirname, './src/models/all-models.js'),
    watch: false,
    // template,
    displayLog: true,
});

rcgwp.modelGrab();
```

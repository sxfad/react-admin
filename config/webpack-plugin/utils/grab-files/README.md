# 文件抓取工具

## 使用
```
const GrabFiles = require('sx-grab-files');
const path = require('path');

const grabFiles = new GrabFiles({
    paths: path.resolve(__dirname, './pages/**/*.model.js'),
    content: true,
});

grabFiles.watch(function (result, event) {
    console.log(event, result);
});

const result = grabFiles.getResult();
console.log('grabFiles', result);

```

## 构造参数
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
paths | 需要抓取的目录，一般是`/path/to/pages/**/*.jsx` | string or [string] | -
ignored | 需要忽略的文件 | string or [string] | -
content | 是否进行文件读取操作 | boolean | false
displayLog | 是否显示log信息 | boolean | false

## 实例方法
方法 | 返回值 | 说明
--- | --- | ---
grab(filePath) | `{path, content, fileName, baseName}` | 基于filePath获取文件相关信息
getResult() | `[{path, content, fileName, baseName}]` | 获取所有文件信息
watch(cb) | undefined | 监听文件改变，调用cb，并将 `result, event, pathName`参数，传递给cb

## TODO 
- [ ] 在WebStorm下，整个文件夹拖动改变目录结构，并不触发watch，但是单个文件拖动，改变文件位置，会触发watch unlink 和 add 事件  


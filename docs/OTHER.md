# 其他
其他的一些说明

## 页面打印
通过给元素添加相应的class，控制打印内容：

- `.just-print` 只在打印时显示
- `.no-print` 在打印时不显示 

## 组件
目录`src/library/antd`中基于Ant Design 扩展了一些常用组件

编写这些组件时，注意一下几点：
- 通用组件不使用css module，方便使用过程中的样式覆盖;
- 统一各个组件的目录结构，便于文档、demo生成；
- `src/pages/example/antd`、`src/menus-ant-design-example.js` 通过脚本 `src/library/antd/generator-demos.js`生成;


## Webpack
### 使用了alias @: /path/to/src

- 方便路径书写，不必关心相对路径结构
- 复制粘贴到其他文件，不必修改路径
- WebStorm 通过 配置webpack配置文件，可以支持提示和点击跳转：
    ```
    WebStorm -> Preference... -> Languages & Frameworks -> JavaScript -> Webpack
    ```
    
### 支持判断运算符
```js
const name = res?.data?.user?.name || '匿名';
```

## ESLint 说明
如果前端项目，不是git根目录，在提交的时候，会报错 `Not a git repository`

修改package.json，lint-staged 如下即可
```json
"lint-staged": {
    "gitDir": "../",
    "linters": {
        "**/*.{js,jsx}": "lint-staged:js",
        "**/*.less": "stylelint --syntax less"
    }
},
```

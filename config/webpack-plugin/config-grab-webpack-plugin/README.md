# 配置抓取工具
路由配置最常用的方式，是一个path 对应 一个组件，我们可以通过脚本生成；文件路径是唯一的，甚至可以使用文件路径作为路由的path；

## 路由抓取方式
1. 文件中编写 `export const PAGE_ROUTE = '/user';`常量，常量值作为路由的path，当前文件中默认导出的组件，作为路由的component，这种方式可以地址携带参数，比如我们可以定义这样的path：`/user/:id`。
2. 基于文件目录结构，生成路由的path，比如 `src/pages/user/UserList.jsx`，可以对应成 path: `/user/UserList`, component: `path/to/UserList`，这种方式不用定义路由path，但是路由跟目录结构有耦合关系，无法定义`/user/:id`这样的路由，但是可以通过queryString方式解决。
3. 特殊的路由方式，可以在`routes.js`文件中定义


#### 插件参数
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
mode | `dir`、`variable` ，路由抓取方式，`dir`：基于目录；`variable`：基于文件中变量`export const PAGE_ROUTE = '/user';` | string | `dir`
hyphen | 路由中的驼峰命名转换为连字符命名，UserList -> user-list | boolean | false
codeSplitting | 是否使用代码分割 | boolean | true
paths | 需要抓取的目录，一般是`/path/to/pages/**/*.jsx` | string or [string] | -
pagePath | 页面文件所在目录，用于简化从文件路径中截取路由path字符串，比如pathPath = /path/to/src/pages，filePath = /path/to/src/pages/user/UserList.jsx，最终得到的路由path：/user/UserList | string | -
ignored | 需要忽略的文件 | string or [string] | -
output | 生成的路由文件输出文件 | string | -
watch | 是否启用监听模式，一般开发模式下是true | boolen | -
template | 路由文件生成模版，ejs文件，如果生成的路由文件不符合期望，可以自己通过模版生成文件内容 | string | -
displayLog | 是否显示log信息 | boolean | false

#### 默认template模版
codeSplitting = true:
```
// 此文件为生成文件，不要直接编辑
export default [<% for(let i = 0; i< result.length; i++){ %>
    {
        path: '<%= result[i].routePath%>',
        getComponent: () => import('<%= result[i].path %>'),
    },<% } %>
];
```
codeSplitting = false:
```
// 此文件为生成文件，不要直接编辑
<% for(let i = 0; i< result.length; i++){ %>import <%= `Component` + i %> from '<%= result[i].path%>';
<%}%>
export default [<% for(let i = 0; i< result.length; i++){ %>
    {
        path: '<%= result[i].routePath%>',
        component: <%= `Component` + i %>,
    },<% } %>
];
```

#### template模版文件能得到的数据 
routes：
参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- 
routePath | 路由使用的path | string | -
path | 文件绝对路径 | string | - 
fileName | 不带扩展名的文件名 | string | -
baseName | 含有扩展名的文件名 | string | -
content | 文件内容 （mode === variable 时才有）| string | -  

noFrames noAuths：
这两个数组都是数组，元素为路由的routePath

#### webpack插件用法
结合webpack进行使用
```
const path = require('path');

const ConfigGrabWebpackPlugin = require('path/to/config-grab-webpack-plugin');

new ConfigGrabWebpackPlugin({
    mode: 'dir',
    // mode: 'variable',
    codeSplitting: false,
    paths: [
        path.resolve(__dirname, './src/pages/**/*.jsx'),
        path.resolve(__dirname, './src/pages2/**/*.jsx'),
        path.resolve(__dirname, './src/pages3/**/*.jsx'),
    ],
    pagePath: path.resolve(__dirname, './src/pages'),
    ignored: [],
    output: path.resolve(__dirname, './src/page-routes.js'),
    watch: true,
    // template,
});
```

#### 非webpack插件方式使用
自定义脚本，而非webpack环境，可以通过如下方式使用：
```
const path = require('path');

const ConfigGrabWebpackPlugin = require('path/to/config-grab-webpack-plugin');

const cgwp = new ConfigGrabWebpackPlugin({
    mode: 'dir',
    // mode: 'variable',
    codeSplitting: false,
    paths: [
        path.resolve(__dirname, './src/pages/**/*.jsx'),
        path.resolve(__dirname, './src/pages2/**/*.jsx'),
        path.resolve(__dirname, './src/pages3/**/*.jsx'),
    ],
    pagePath: path.resolve(__dirname, './src/pages'),
    ignored: [],
    output: path.resolve(__dirname, './src/page-routes.js'),
    watch: true,
    // template,
});

cgwp.routeConfigGrab();

```

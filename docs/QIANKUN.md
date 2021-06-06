# 微前端

当前框架既可以作为乾坤主项目，又可以作为乾坤子项目

新创建项目注意修改：

- package.json name 属性
- src/theme.less 中 @ant-prefix 和 @ra-lib-prefix

## 作为乾坤子系统时

约定：package.json name 作为:

    - 子系统的BASE_NAME 
    - 子系统注册到主系统中的 name 、 activeRule

- ajax请求前缀设置为 `${window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__}api`
- 接口服务器（后端按需设置）和 开发服务器devServer，设置跨域

    ```js
    {
        headers: {
            'Access-Control-Allow-Origin': '*', // 'https://some-site.com'
            'Access-Control-Allow-Methods': '*', // 'GET, POST'
            'Access-Control-Allow-Headers': '*', // 'X-Requested-With,content-type, Authorization, token, auto-token'
        }
    } 
    ```
- 子系统webpack配置

    ```js
    // craco.config.js
    const packageName = require('./package.json').name;
    
    {
        configure: (webpackConfig, {env, paths}) => {
            webpackConfig.output.library = packageName;
            webpackConfig.output.libraryTarget = 'umd';
            webpackConfig.output.jsonpFunction = `webpackJsonp_${packageName}`;
        }
    }           
    ```  

## 乾坤微前端的坑

-[ ] 子系统卸载时，控制台会报提醒 `[qiankun] Set window.event while sandbox destroyed or inactive in xxx! `

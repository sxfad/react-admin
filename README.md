# React Admin

基于[React17.x](https://reactjs.org)、[Ant Design4.x](https://ant.design/)的管理系统架构。

- [在线预览](https://sxfad.github.io/react-admin/build)
- [查看文档](https://sxfad.github.io/react-admin/#/)
- [组件库ra-lib文档](https://github.com/sxfad/ra-lib)

## 安装依赖

- node v12.14.0
- yarn 1.22.10

```bash
yarn
```

注：如果由于网络等原因安装不成功，可以尝试 `tyarn` 或 `cnpm` 或 `npm`

设置环境变量，windows平台可以使用 [cross-env](https://github.com/kentcdodds/cross-env#)

## 开发启动

```
# 正常启动开发模式
yarn start 

# 自定义端口
PORT=3001 yarn start

# HTTPS 方式启动
HTTPS=true yarn start
```

## 开发代理

修改`src/setupProxy.js`

```js
const proxy = require('http-proxy-middleware');

// 前端web服务代理配置
module.exports = function(app) {
    app.use(proxy('/api',
        {
            target: 'http://localhost:8081/', // 目标服务器
            pathRewrite: {
                '^/api': '', // 如果后端接口无前缀，可以通过这种方式去掉
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: true, // 启用websocket
        },
    ));
};

```

## 生产构建

```
# 正常构建
yarn build

# 指定配置环境
REACT_APP_CONFIG_ENV=test yarn build

# 打包大小分析
yarn build:analyzer

# 打包时间分析
yarn build:time
```

## 样式

- 支持less及css
- src下less进行css module处理，css不进行css module处理
- css module 应用样式写法
    ```jsx
    import styles from './style.module.less';
    
    <div className={styles.root}>
        <h1 className={styles.title}></h1>
    </div>
    ```

- 复杂的样式处理，推荐使用 [classnames](https://github.com/JedWatson/classnames)
- 主题变量修改 theme.less [antd 样式变量](https://ant.design/docs/react/customize-theme-cn)

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

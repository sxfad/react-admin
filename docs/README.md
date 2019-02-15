# 简介

react-admin是基于基于[React16.x](https://reactjs.org)、[Ant Design3.x](https://ant.design/)的管理系统架构。
采用前后端分离，内置了许多管理系统常用功能，通过一些脚本、封装帮助开发人员快速开发管理系统，集中精力处理业务逻辑。

## 项目结构
```
.
├── config              // 构建配置
├── nginx-conf          // 生产部署nginx配置参考
├── public              // 不参与构建的静态文件
├── scripts             // 构建脚本
├── src                 
│   ├── commons         // 通用js
│   ├── components      // 通用组件
│   ├── i18n            // 国际化
│   ├── layouts         // 页面框架布局组件
│   ├── library         // 基础组件
│   ├── mock            // 模拟数据
│   ├── models          // 模块封装，基于redux，提供各组件共享数据、共享逻辑
│   ├── pages           // 页面组件
│   ├── router          // 路由
│   ├── App.js          // 根组件
│   ├── index.css       // 全局样式
│   ├── index.js        // 项目入口
│   ├── menus.js        // 菜单配置
│   ├── setupProxy.js   // 后端联调代理配置
│   └── theme.js        // 主题变量
├── package.json
├── README.md
└── yarn.lock

```

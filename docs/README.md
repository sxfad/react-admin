# 简介

react-admin是基于基于[React16.x](https://reactjs.org)、[Ant Design4.x](https://ant.design/)的管理系统架构。
采用前后端分离，内置了许多管理系统常用功能，通过一些脚本、封装帮助开发人员快速开发管理系统，集中精力处理业务逻辑。

## 项目结构
```
.
├── config              // 构建配置
├── nginx-conf          // 生产部署nginx配置参考
├── public              // 不参与构建的静态文件
├── scripts             // 构建脚本
├── src                 
│   ├── commons         // 通用js，业务相关
│   ├── components      // 通用组件，业务相关
│   ├── layouts         // 页面框架布局组件
│   ├── library         // 基础组件、工具
│   │   ├── ajax        // ajax基础库
│   │   ├── components  // 公共组件，业务无关
│   │   ├── redux       // redux 封装
│   │   └── utils       // 基础工具
│   ├── mock            // 模拟数据
│   ├── models          // 模块封装，基于redux，提供各组件共享数据、共享逻辑
│   ├── pages           // 页面组件
│   ├── router          // 路由
│   ├── App.js          // 根组件
│   ├── index.css       // 全局样式 慎用
│   ├── index.js        // 项目入口
│   ├── menus.js        // 菜单配置
│   ├── setupProxy.js   // 后端联调代理配置
│   └── theme.js        // 主题变量
├── package.json
├── README.md
└── yarn.lock
```
## 预览

部分页面截图，完整项目预览地址[戳这里](http://shubin.wang)
<div style="background: #efefef;padding: 0 10px;">

![登录](imgs/login.jpg)
![首页](imgs/home.jpg)
![用户](imgs/users.jpg)
![菜单&权限](imgs/menu.jpg)
![角色管理](imgs/role.jpg)
![快速生成](imgs/gen_quick.png)
![单独生成](imgs/gen_single.png)
![页面不存在](imgs/404.jpg)

</div>


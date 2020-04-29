# React Admin
基于[React](https://reactjs.org)、[Ant Design](https://ant.design/)的管理系统架构。

感谢开源社区，感谢Ant Design团队提供优秀的开源项目！

## 快速开始

Step 1：将此项目下载到本地
```bash
$ git clone https://github.com/sxfad/react-admin.git
```

Step 2：安装依赖
```bash
$ cd react-admin 
$ yarn 
```
注：如果由于网络原因，下载依赖比较慢，可以使用淘宝镜像：`yarn --registry=https://registry.npm.taobao.org`；

Step 3：运行
```bash
$ yarn start
```
注：正常会自动打开浏览器，启动成功之后，如果浏览器白屏，手动刷新一下浏览器；

## 创建一个页面
Step 1：在`src/pages`目录下新建文件 `MyTest.jsx`，内容如下：
```jsx 
import React, {Component} from 'react';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

@config({
    path: '/my-test'
})
export default class MyTest extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <PageContent>
                我的第一个页面
            </PageContent>
        );
    }
}
```

浏览器访问 `http://localhost:4000/my-test`

此时tab页签应该是空的，配置菜单之后就能正常显示title了，或者在`@config`配置中添加`title`属性。

Step 2：添加菜单
在 `src/menus.js`文件中添加前端硬编码的菜单配置
```javascript
export default function getMenus(userId) {
    return Promise.resolve([
        {key: 'my-key', text: '我的测试页面', icon: 'user', path: '/my-test'},

        {key: 'antDesign', text: 'Ant Design 官网', icon: 'ant-design', url: 'https://ant-design.gitee.io', target: '', order: 2000},
        {key: 'document', text: '文档', icon: 'book', url: 'https://open.vbill.cn/react-admin', target: '_blank', order: 1200},

    ]);
}
```

路由的配置、菜单的关联等等，系统会帮我们处理，新建一个文件，即创建了一个页面。

## 文档地址
最新文档[在这里](https://open.vbill.cn/react-admin)

## 项目预览
预览地址[在这里](https://open.vbill.cn/react-admin-live/)

## 项目截图
这里只提供了部分页面截图，根据文档[快速开始](https://open.vbill.cn/react-admin/#/START)进行项目的搭建，浏览项目丰富功能！

<table>
    <tr>
        <td><img src="docs/imgs/login.jpg" alt="登录"/></td>
        <td><img src="docs/imgs/home.jpg" alt="首页"/></td>
    </tr>
    <tr>
        <td><img src="docs/imgs/users.jpg" alt="用户"/></td>
        <td><img src="docs/imgs/menu.jpg" alt="菜单&权限"/></td>
    </tr>
    <tr>
        <td><img src="docs/imgs/gen_quick.png" alt="快速生成"/></td>
        <td><img src="docs/imgs/gen_single.png" alt="单独生成"/></td>
    </tr>
    <tr>
        <td><img src="docs/imgs/401.jpg" alt="未登录"/></td>
        <td><img src="docs/imgs/404.png" alt="页面不存在"/></td>
    </tr>
</table>

## License

React Admin is licensed under the [Apache License](https://github.com/sxfad/react-admin/blob/master/LICENSE)

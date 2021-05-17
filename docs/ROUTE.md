# 系统路由
系统路由使用 [react-router](https://reacttraining.com/react-router/web/guides/quick-start)。
路由使用最多的场景就是一个path对应一个页面，但是开发人员不得不去编写配置文件，多人协作时，配置文件还经常冲突。
系统通过脚本，简化路由配置。

## 路由配置方式
通过config-loader 将高阶组件参数填充到`/src/pages/page-configs.js`文件。

页面config装饰器
```js
@config({
    path: '/path',
})
export default class SomePage extends React.Component {
    ...
}
```

比如SomePage.jsx中有上面其中任意一种写法，config-loader最终会在`/src/pages/page-configs.js`文件中填充如下路由配置：
```js
{
    path: '/path',
    component: () => import('/path/to/SomePage.jsx'),
},
```

## 二级页面
    
二级页面如果要保持父级菜单的选中状态，在config高阶组件中设置 selectedMenuPath 参数

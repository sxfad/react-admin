# 页面开发

页面指的是路由对应的页面组件。业务开发接触最多的就是页面，通过一些封装，简化开发。

## 配置高阶组件

将组件所需要的一些功能，通过配置装饰器的方式实现，用法如下：

hooks:

```
import config from 'src/commons/config-hoc';

export default config({
    path: '/page/path',
    ...
})(function SomePage(props) {
...
});
```

class:

```
import React, {Component} from 'react';
import config from 'src/commons/config-hoc';

@config({
    path: '/page/path',
    title: '页面title', // 默认基于菜单
    ajax: true, // 默认true
    ...
})
export default class SomePage extend Component {
    componentDidMount(){
        this.props.ajax
            .get(...)
            .then(...)
    }
...
}
```

所有参数如下：

```js
// config 所有可用参数，以及默认值
const {
    // 路由地址
    path,
    // 是否需要登录
    auth,
    // 是否显示顶部
    header,
    // 是否显示标签
    tab,
    // 是否显示页面头部
    pageHeader,
    // 是否显示侧边栏
    side,
    // 侧边栏是否收起
    sideCollapsed,
    // 设置选中菜单，默认基于 window.location.pathname选中 用于设置非菜单的子页面，菜单选中状态
    selectedMenuPath,
    // 设置页面、tab标题，默认基于选中菜单，也可以通过query string 设置 /xxx?title=页面标题
    title,
    // 自定义面包屑导航，默认基于选中菜单，false：不显示，[{icon, title, path}, ...]
    breadcrumb,
    // 基于菜单，追加面包屑导航
    appendBreadcrumb,
    // 页面保持，不销毁，需要设置config.KEEP_PAGE_ALIVE === true 才生效
    keepAlive,
    // 是否添加withRouter高级组件
    router = false,
    // props是否注入ajax
    ajax = CONFIG_HOC.ajax,
    // 连接models，扩展 props.action
    connect = CONFIG_HOC.connect,
    // 弹框高阶组件
    modal,
    // 抽屉高级组件
    drawer,
    ...others
} = options;
```

## 页面保持

页面渲染一次之后会保持状态，再次跳转到此页面不会重新创建或重新渲染。

### 开启方式

`/src/config CONFIG_HOC.keepAlive`设置为true

注：部分不需要keepAlive页面，可以在config高阶组件中设置`keepAlive: false`

### 页面显示/隐藏事件

开启keepAlive功能的页面，会接受到 active props。可以根据active值变化，判断当前页面状态

active值说明

- `undefined`页面初始化，第一次加载
- `false` 页面被隐藏
- `true` 页面被显示

## 页面容器PageContent

系统提供了页面的跟节点PageContent，有如下特性：

- 添加了margin padding 样式；
- 支持页面loading；
- 添加最小高度，始终使页面撑满全屏
- fitHeight功能，是页面撑满全屏，内容过长时，PageContent将显示滚动条

显示loading

```js
const {loading} = this.state;

<PageContent loading={loading}>
    ...
</PageContent>
```
        
    

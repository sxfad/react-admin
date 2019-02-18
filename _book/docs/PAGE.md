# 页面开发
指的是路由对应的页面组件。业务开发接触最多的就是页面，通过一些封装，简化开发。

## 配置高阶组件
将组件所需要的一些功能，通过配置装饰器的方式实现，用法如下：

```jsx
import React, {Component} from 'react';
import config from '@/commons/config-hoc';

@config({
    path: '/page/path',
    title: '页面title',
    ajax: true,
    ...
})
export default class SomePage extend Component {
    componentDidMount() {
        this.props.ajax
            .get(...)
            .then(...)
    }
    ...
}
```

所有参数如下：
            
参数|类型|默认值|说明
---|---|---|---
path|string|-|页面路由地址，如果存在path配置，会通过脚本抓取，当前组件将会作为路由页面，path将作为路由地址 
noFrame|boolean|false|标记当前页面为不需要导航框架的页面，比如登录页，通过脚本抓取实现
noAuth|boolean|false|标记当前页面为不需要登录即可访问的页面，通过脚本抓取实现
keepAlive|boolean|-|标记当前页面内容在页面切换之后是否保持
title|boolean 或 string 或 ReactNode 或 object 或 function(props)|true|true：当前页面显示通过菜单结构自动生成的title；false：当前页面不显示title；string：自定义title，并不参与国际化；object：{local, text}，local对应国际化menu中的配置，text为国际化失败之后的默认显示；function(props): 返回值作为title
breadcrumbs|boolean 或 array 或 function(props)|true|true：当前页面显示通过菜单结构自动生成的面包屑；false：当前页面不显示面包屑；object：\[{local, text, ...}\]，local对应国际化menu中的配置，text为国际化失败之后的默认显示；function(props): 返回值作为面包屑
appendBreadcrumbs|array 或 function(props)|\[\]|在当前面包屑基础上添加；function(props): 返回值作为新添加的面包屑
pageHead|boolean|-|页面头部是否显示
side|boolean|-|页面左侧是否显示
sideCollapsed|boolean|-|左侧是否收起
ajax|boolean|false|是否添加ajax高阶组件，内部可以通过this.props.ajax使用ajax API，组件卸载时，会自动打断未完成的请求
router|boolean|false|是否添加withRouter装饰器，如果设置了path，将自动使用了withRouter，组件内部可以使用this.props.history等API
query|boolean|false|是否添加地址查询字符串转换高阶组件，内部可以通过this.props.query访问查询字符串
connect|boolean 或 function(state)|false|是否与redux进行连接，true：只注入了this.props.action相关方法；false：不与redux进行连接；(state) => ({title: state.page.title})：将函数返回的数据注入this.props
event|boolean|false|是否添加event高阶组件，可以使用this.props.addEventListener添加dom事件，并在组件卸载时会自动清理；通过this.props.removeEventListener移出dom事件
pubSub|boolean|false|是否添加发布订阅高阶组件，可以使用this.props.subscribe(topic, (msg, data) => {...})订阅事件，并在组件卸载时，会自动取消订阅; 通过this.props.publish(topic, data)发布事件

注：
- `noFrame`、`noAuth`、`keepAlive` 只有配置了`path`才有效！
- config装饰器可以用于任何组件，但是`title`、`breadcrumbs`、`appendBreadcrumbs`、`pageHead`、`side`、`sideCollapsed`最好在路由对应的页面组件中使用

## 页面保持
页面渲染一次之后会保持状态，再次跳转到此页面不会重新创建或重新渲染。

### 开启方式

1. 页面有上角 -> 用户头像 -> 设置 -> 页面设置 -> 保持页面状态
1. /src/models/system.js initState.keepPage 属性修改默认值
1. config装饰器 keepAlive属性

### 页面显示/隐藏事件

`config` 装饰器为组件注入了两个事件 `onComponentWillShow`、`onComponentWillHide` ，如果页面使用了 Keep Alive功能，切换显示/隐藏时会触发

```js
@config({
    ...
})
export default class SomePage extends React.Component {
    constructor(...props) {
        super(...props);

        this.props.onComponentWillShow(() => {
            // do some thing 
        });
        
        this.props.onComponentWillHide(() => {
            // do some thing 
        });
    }
    ...
}
```

## 页面容器PageContent
系统提供了页面的跟节点PageContent，有如下特性：

- 添加了margin padding 样式；
- 添加了footer；
- 支持页面loading；
- 自动判定是否有底部工具条FixBottom组件，为底部工具条腾出空间；

是否显示footer，默认true
```js
<PageContent footer={false}>
    ...
</PageContent>
```

显示loading，有两种方式。

1. model方式
    ```js
    this.props.action.page.showLoading();
    this.props.action.page.hideLoading();
    ```
1. props方式
    ```js
    const {loading} = this.state;
    
    <PageContent loading={loading}>
        ...
    </PageContent>
    ```
        
    

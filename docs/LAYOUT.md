# 导航布局
为了满足不同系统的需求，提供了四种导航布局：
- 头部菜单
- 左侧菜单
- 头部+左侧菜单
- tab页方式

## 更改方式
- 用户可以通过 页面有上角用户头像 -> 设置 页面进行选择（如果您为用户提供了此页面）；
- 开发人员可以通过修改`src/models/settings.js`指定布局方式；

## 不需要导航
有些页面可能不需要显示导航，可以通过如下任意一种方式进行设置：

- 页面配置高级组件
    ```js
    @config({
        noFrame: true,
    })
    ```
- 浏览器url中noFrame=true参数 
    ```
    /path/to?noFrame=true
    ```

## Tab标签页
页面头部标签，有如下特性：

1. 在当前tab标签之后打开新的tab标签；
1. 记录并恢复滚动条位置；
1. 保持页面状态（需要开启`Keep Page Alive`）；
1. tab标签右键操作；
1. tab页操作API；
1. tab标签拖拽排序；
1. 关闭一个二级页面tab，尝试打开它的父级；

### Tab操作API
system model（redux）中提供了如下操作tab页的方法：

API|说明
---|---
setCurrentTabTitle(title)|设置当前激活的 tab 标题 title: stirng 或 {local, text, icon} local对应 i18n.menu中字段
refreshTab(targetPath)|刷新targetPath指定的tab页内容（重新渲染）
refreshAllTab()|刷新所有tab页内容（重新渲染）
closeCurrentTab()|关闭当前tab页
closeTab(targetPath)|关闭targetPath对应的tab页
closeOtherTabs(targetPath)|关闭除了targetPath对应的tab页之外的所有tab页
closeAllTabs()|关闭所有tab页，系统将跳转首页
closeLeftTabs(targetPath)|关闭targetPath对应的tab页左侧所有tab页
closeRightTabs(targetPath)|关闭targetPath对应的tab页右侧所有的tab页

使用方式：
```jsx
import config from '@/commons/config-hoc';

@config({
    connect: true,
})
export default class SomeComponent extends React.Component {
    componentDidMount() {
        this.props.action.system.closeTab('/some/path');
    }
    ...
}
```


注：

1. tab基于页面地址，每当使用`this.props.history.push('/some/path')`，就会选中或者新打开一个tab页（`/path` 与 `/path?name=Tom`属于不同url地址，会对应两个tab页）；
1. 没有菜单对应的页面，需要单独设置title，否则tab标签将没有title;


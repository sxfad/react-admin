# 导航布局
为了满足不同系统的需求，提供了四种导航布局：
- 头部菜单
- 左侧菜单
- 头部+左侧菜单
- tab页方式

## 更改方式
- 用户可以通过 页面头部右上角设置 页面进行选择（如果您为用户提供了此页面）；
- 开发人员可以通过修改`src/config`指定布局方式；

## 不需要导航
有些页面可能不需要显示导航，可以通过如下任意一种方式进行设置：

- 页面配置高级组件
    ```js
    @config({
        header: false,
        side: false,
        pageHeader: false,
        tab: false,
    })
    ```

注：

1. tab基于页面地址，每当使用`this.props.history.push('/some/path')`，就会选中或者新打开一个tab页（`/path` 与 `/path?name=Tom`属于不同url地址，会对应两个tab页）；
1. 没有菜单对应的页面，需要单独设置title，否则无法显示tab标签页;


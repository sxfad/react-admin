# 基础框架


## 特性
相关方法已经封装到action中，代码在相应得models中

1. 菜单多种布局方式
1. 头部滚动/固定
1. 菜单固定
1. 菜单可以滚动，并且隐藏滚动条
1. 菜单宽度可拖拽改变大小
1. 菜单可以展开/收起
1. 菜单状态自动获取/可设置
1. 页面头部title自动获取/可设置
1. 页面头部面包屑自动获取/可设置
1. 页面头部可以隐藏/显示

## 导航布局说明

用户可以在设置页面进行修改

开发人员可以修改 `models/settings.js` 中 pageFrameLayout 初始值，来指定默认布局方式。

目前提供三种布局，如下：
1. side-menu: 只有左侧菜单
1. top-menu: 只有顶部菜单
1. top-side-menu: 头部菜单和左侧菜单

## 页面头部

页面头部内容，会基于当前页面地址自动获取，更改方法如下：

```
const {page} = this.props.action;
page.setTitle('自定义title');
page.hide();
page.show();
page.setBreadcrumbs([
    {text: '自定义',icon: 'home',path: '/path'},
    {text: '面包屑',icon: 'home',path: '/path'},
    {text: '导航',icon: 'home',path: '/path'},
])
```

## 左侧菜单

### 菜单数据
```js
[
    {key: 'top1', icon: 'fa-file-code-o', text: '顶级菜单1'},
    {key: 'top11', parentKey: 'top1', icon: 'fa-file-code-o', text: '百度', url: 'https://www.baidu.com'},
    {key: 'top12', parentKey: 'top1', icon: 'fa-file-code-o', text: 'antd', url: 'https://ant.design/index-cn'},
    {key: 'top2', icon: 'fa-file-code-o', text: '顶级菜单2'},
    {key: 'top21', parentKey: 'top2', icon: 'fa-file-code-o', text: '子菜单2', path: '/sub2'},

    {key: 'example', text: 'Example', icon: 'fa-file-code-o', path: ''},
    {key: 'user-center', parentKey: 'example', text: '用户中心', icon: 'user', path: '/user-center', order: 10011},
];
```

说明：

参数|说明|类型|必须
---|---|---|---
key | 唯一标识 | string | true
parentKey | 父级节点的key，顶级节点没有此参数 | string | false
text | 菜单名称 | string | true
icon | 图标 | string | false
path | 菜单路径，配合react-rooter，即：react-rooter的path | string | false
url | iframe的url，如果path缺省，并且存在url参数，页面将以iframe打开url对应的网站| string | false


### 相关方法
菜单状态将基于页面地址自动获取，修改方式如下：

```
const {side} = this.props.acion;
side.hide();
side.show();
```

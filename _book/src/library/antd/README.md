# 组件库

基于antd封装的组件库，适用于管理系统，基于antd 3.x

## 安装

```
$ yarn add sx-antd
```

## 使用

```
$ import {ListPage} from 'sx-antd';
```

样式统一打包在`index.min.css`中，在项目入口文件统一引入：
```
$ import 'sx-antd/lib/index.min.css';
```

如果用到了图标，需要在项目入口文件引入字体图标样式：
```
$ import 'sx-antd/lib/font-icon/font-awesome/css/font-awesome.min.css';
```

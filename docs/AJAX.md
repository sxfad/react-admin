# Ajax 请求
系统的ajax请求基于[axios](https://github.com/axios/axios)封装。

## 方法
基于restful规范，提供了5个方法：

- get 获取服务端数据，参数拼接在url上，以 query string方式发送给后端
- post 新增数据，参数以body形式发送给后端
- put 修改数据，参数以body形式发送给后端
- del 删除数据，参数拼接在url上，以params方式发送给后端
- patch 修改部分数据，参数以body形式发送给后端

## 调用方式
可以通过三种方式，让React组件拿到ajax对象

- config装饰器ajax属性
    ```js
    import React, {Component} from 'react';
    import config from '@/commons/config-hoc';
    
    @config({
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
- ajax装饰器
    ```js
    import React, {Component} from 'react';
    import {ajaxHoc} from '@/commpons/ajax';
    
    @ajaxHoc()
    export default class SomePage extend Component {
        componentDidMount() {
            this.props.ajax
                .get(...)
                .then(...)
        }
        ...
    } 
    ```
- 直接引入ajax对象
    ```js
    import React, {Component} from 'react';
    import {sxAjax} from '@/commpons/ajax';
    
    @ajaxHoc()
    export default class SomePage extend Component {
        componentDidMount() {
            sxAjax.post(...).then(...);
        
            // 组件卸载或者其他什么情况，需要打算ajax请求，可以用如下方式
            const ajax = sxAjax.get(...);
            ajax.then(...).finally(...);
            ajax.cancel();
        }
        ...
    } 
    ```
注：config、ajaxHoc方式做了封装，页面被卸载之后会**自动打断**未完成的请求

## 参数
所有的ajax方法参数统一，都能够接受三个参数：

参数|说明
---|---
url|请求地址
params|请求传递给后端的参数
options|请求配置，即axios的配置，扩展了三个个：successTip errorTip，成功或失败提示；noEmpty过滤掉 ''、null、undefined的参数，不提交给后端

注：全局默认参数可以在src/commons/ajax.js中进行配置，默认baseURL='/api'、timeout=1000 * 60。

## 请求结果提示
系统对ajax失败做了自动提示，开发人员可通过src/commons/handle-error.js进行配置；

成功提示默认不显示，如果需要成功提示，可以配置successTip参数，或者.then()中自行处理；

成功提示在src/commons/handle-success.js中配置；
```js
this.props.ajax.del('/user/1', null, {successTip: '删除成功！', errorTip: '删除失败！', noEmpty: true});
```

## loading处理
系统扩展了promise，提供了finally方法，用于无论成功还是失败，都要进行的处理。一般用于关闭loading
```js
this.setState({loading: true});
this.props.ajax
    .get('/url')
    .then(...)
    .finally(() => this.setState({loading: false}));
```


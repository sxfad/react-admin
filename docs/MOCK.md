# Mock 模拟数据
前后端并行开发，为了方便后端快速开发，不需要等待后端接口，系统提供了mock功能。基于[mockjs](http://mockjs.com/)

## 编写模拟数据
在/src/mock目录下进行mock数据编写，比如：
```js
import {getUsersByPageSize} from './mockdata/user';

export default {
    'post /mock/login': (config) => {
        const {
            userName,
            password,
        } = JSON.parse(config.data);
        return new Promise((resolve, reject) => {
            if (userName !== 'test' || password !== '111') {
                setTimeout(() => {
                    reject({
                        code: 1001,
                        message: '用户名或密码错误',
                    });
                }, 1000);
            } else {
                setTimeout(() => {
                    resolve([200, {
                        id: '1234567890abcde',
                        name: 'MOCK 用户',
                        loginName: 'MOCK 登录名',
                    }]);
                }, 1000);
            }
        });
    },
    'post /mock/logout': {},

    'get /mock/user-center': (config) => {
        const {
            pageSize,
            pageNum,
        } = config.params;


        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, {
                    pageNum,
                    pageSize,
                    total: 888,
                    list: getUsersByPageSize(pageSize),
                }]);
            }, 1000);
        });
    },
    'get re:/mock/user-center/.+': {id: 1, name: '熊大', age: 22, job: '前端'},
    'post /mock/user-center': true,
    'put /mock/user-center': true,
    'delete re:/mock/user-center/.+': 'id',
}
```

## 简化
为了方便mock接口编写，系统提供了简化脚本(/src/mock/simplify.js)，上面的例子就是简化写法

对象的key由 method url delay，各部分组成，以空格隔开

字段|说明
---|---
method| 请求方法 get post等
url|请求的url
delay|模拟延迟，毫秒 默认1000

## 调用
系统封装的ajax可以通过以下两种方式，自动区分是mock数据，还是真实后端数据，无需其他配置

mock请求：
- url以/mock/开头的请求
- /src/mock/url-config.js中配置的请求

```js
this.props.ajax.get('/mock/users').then(...);
```
如果后端真实接口准备好之后，去掉url中的/mock即可

注：mock功能只有开发模式下启用了，生产模式不会开启mock功能

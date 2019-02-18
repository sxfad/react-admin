# 权限控制
系统菜单、具体功能点都可以进行权限控制。

## 菜单权限
如果菜单由后端提供（一般系统都是后端提供），可以通过userId获取用户的菜单权限；页面只显示获取到的菜单；

系统提供了一个基础的菜单、权限管理页面（右上角用户下拉菜单内），需要后端配合存储数据，此页面只有在开发模式下使用。后端接口为了安全起见也需要控制只能开发模式下使用，或者超级管理员才能使用。

## 功能权限
可以通过`@/components/permission`组件对功能的权限进行控制
```js
import React, {Component} from 'react';
import Permission from '@/components/permission';

export default class SomePage extends Component {

    render() {
        return (
            <div>
                <Permission code="USER_ADD">
                    <Button>添加用户</Button>
                </Permission>
            </div>
        );
    }
}
```
注：权限的code前端使用时会硬编码，注意语义化、唯一性。

## 角色
一般系统都会提供角色管理功能，系统中提供了一个基础的角色管理功能，稍作修改即可使用。

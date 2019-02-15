# models(redux) 封装
基于[redux](https://redux.js.org/)进行封装，不改变redux源码，可以结合使用redux社区中其他解决方案。

## models用于管理数据，解决的问题：
1. 命名空间（防止数据、方法命名冲突）：数据与方法，都归属于具体model，比如：state.userCenter.xxx，this.props.action.userCenter.xxx();
1. 如何方便的获取数据：connect与组件连接；@connect(state => ({name: state.user.name}));
1. 如何方便的修改数据：this.props.action中方法；
1. 客户端数据持久化（保存到LocalStorage中）：syncStorage配置；
1. 异步数据处理：基于promise异步封装；
1. 请求错误提示：error处理封装，errorTip配置，自动提示；
1. 请求成功提示：successTip配置，自动提示；
1. 简化写法：types actions reducers 可以在一个文件中编写，较少冲突，方便多人协作，参见[`models/page.js`](./page.js)中的写法;
1. 业务代码可集中归类：在models目录中统一编写，或者在具体业务目录中，模块化方式。


## all-models.js
此文件通过脚本自动生成，不要直接编辑，生成规则如下：

```
/path/to/models/user-center.js --> export userCenter from '/path/to/models/user-center';
/path/to/user-center.model.js  --> export userCenter from '/path/to/user-center.model.js';
/path/to/user-center/model.js  --> export userCenter from '/path/to/user-center/model.js';
```

## 组件与redux进行连接
提供了两种方式，装饰器方式、函数调用方式；

### 装饰器
推荐使用装饰器方式

```jsx
import {connect} from 'path/to/models';

@connect(state => {
    return {
        ...
    }
})
class Demo extends Component{
    ...
}
```

### 函数
```jsx
import {connectComponent} from 'path/to/models';

class Demo extends Component {
   ... 
}
function mapStateToProps(state) {
    return {
        ...
    };
}

export default connectComponent({LayoutComponent: Demo, mapStateToProps});
```

## 简化写法
action reducer 二合一，省去了actionType，简化写法；

注意：
- 所有的reducer方法，无论是什么写法中的，都可以直接返回新数据，不必关心与原数据合并（...state），封装内部做了合并；
- 一个model中，除了initialState syncStorage actions reducers 等关键字之外的属性，都视为action reducer合并写法;

### 一个函数
一个函数，即可作为action方法，也作为reduce使用

- 调用action方法传递的数据将不会做任何处理，会直接传递给 reducer
- 只能用第一个参数接收传递过来的数据，如果多个数据，需要通过对象方式传递，如果不需要传递数据，但是要使用state，也需要定义一个参数占位
- 第二个参数固定为state，第三个参数固定为action，不需要可以缺省（一般都是缺省的）
- 函数的返回值为一个对象或者undefined，将于原state合并，作为store新的state

```js
// page.model.js
export default {
    initialState: {
        title: void 0,
        name: void 0,
        user: {},
        toggle: true,
    },
    
    setTitle: title => ({title}),
    setName: (name, state, action) => {
        const {name: prevName} = state;
        if(name !== prevName) return {name: 'Different Name'};
    },
    setUser: ({name, age} = {}) => ({user: {name, age}}),
    setToggle: (arg, state) => ({toggle: !state.toggle}),
}

// 使用
this.props.action.page.setTitle('my title');
```

### 数据同步
通过配置的方式，可以让redux中的数据自动与localStorage同步

```js
export default {
    initialState: {
        title: '',
        show: true,
        user: {},
        users: [], 
        job: {},
        total: 0,
        loading: false,
        ...
    },
    
    // initialState会全部同步到localStorage中
    // syncStorage: true,
     
    // 配置部分存数据储到localStorage中 
    syncStorage: { 
        titel: true,
        user: { // 支持对象指定字段，任意层次
            name: true,
            address: {
                city: true,
            },
        },
        job: true,
        users: [{name: true, age: true}], // 支持数组
    },
}
```

### action reducer 合并写法
如果action有额外的数据处理，并且一个action 只对应一个reducer，这种写法不需要指定actionType，可以有效简化代码；

```js
export default {
    initialState: {
        title: '',
        ...
    },
    
    arDemo: {
        // 如果是函数返回值将作为action.payload 传递给reducer，如果非函数，直接将payload的值，作为action.payload;
        payload(options) {...},
        
        // 如果是函数返回值将作为action.meta 传递给reducer，如果非函数，直接将meta的值，作为action.meta;
        meta(options) {...},
        reducer(state, action) {
            returtn {...newState}; // 可以直接返回要修改的数据，内部封装会与原state合并`{...state, ...newState}`;
        },
    },
};
```

### 异步action写法

```js

export default {
    initialState: {
        title: '',
        ...
    },
    fetchUser: {
        // 异步action payload 返回promise     
        payload: ({params, options}) => axios.get('/mock/users', params, options),
        
        // 异步action 默认使用通用异步meta配置 commonAsyncMeta，对successTip errorTip onResolve onReject onComplete 进行了合理的默认值处理，需要action以对象形式传参调用
        // meta: commonAsyncMeta, 
        // meta: {
        //     successTip: '查询成功！欧耶~',
        //     errorTip: '自定义errorTip！马丹~',
        // },
        // meta: () => {
        //    return {...};
        // },
        
        // 基于promise 异步reducer写法；
        reducer: {
            pending: (state, action) => ({loading: true}),
            resolve(state, {payload = {}}) {
                const {total = 0, list = []} = payload;
                return {
                    users: list,
                    total,
                }
            },
            complete: (state, action) => ({loading: false}),
        }
    },
};
```
调用方式：
```js
this.props.action.user
    .fetchUser({
        params, 
        options, 
        successTip, 
        errorTip,
        onResolve, 
        onReject, 
        onComplete
    });
```

参数约定为一个对象，各个属性说明如下:

参数|说明
---|---
params|请求参数
options|请求配置
successTip|成功提示信息
errorTip|错误提示信息
onResolve|成功回调
onReject|失败回调
onComplete|完成回调，无论成功、失败都会调用

### 单独定义action 和 reducer
支持这种比较传统的写法，一般也不会太用到

```js
import {createAction} from 'redux-actions';

export const types = {
    GET_MENU_STATUS: 'MENU:GET_MENU_STATUS', // 防止各个模块冲突，最好模块名开头
};

export default {
    initialState: {
        title: '',
        ...
    },
    
    // 单独action定义，需要使用actionType与reducer进行关联
    actions: {
        getMenuStatus: createAction(types.GET_MENU_STATUS),
    },
    
    // 单独reducer定义，使用了actionType，不仅可以处理当前model中的action
    // 也可以处理其他任意action（只要actionType能对应）
    reducers: {
        [types.GET_MENU_STATUS](state) {
            ...
            return {
                ...
            };
        }
    },
}    
```

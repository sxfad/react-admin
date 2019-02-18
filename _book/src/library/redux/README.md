# redux 封装
redux 到底要解决什么问题？管理被多个组件所依赖或者影响的状态；
一个action需要被多个reducer处理吗？

## 构建

```
$ yarn build
```

## 关于redux
actions可以被各个页面组件和reducers复用

- 各个页面（组件）如果挂载到路由，export出`mapStateToProps`，系统就会将`LayoutComponent`组件或默认导出组件 与redux关联，即可使用`this.props.actions`中的方法，获取到redux中的数据；
- 各个页面（组件）如果不是挂载到路由上的，需要显示调用`connectComponent`或者`connect`装饰器与redux的连接；
- 各个页面（组件）如果已经与redux进行连接，通过`const {actions} = this.props`获取actions对象，然后调用`actions.xxx()` 触发action；
- `mapStateToProps` 用于指定redux的state中哪部分数据用于当前组件，由于reducer的`combineReducers`方法包装之后，将各个reducer的state存放在对应的key中，key指的是combineReducers包装时指定的key，比如：

    ```javascript
    export default combineReducers({
        home, // 这个home就是key，es6写法
        utils,
    });

    // src/layout/home.js
    export function mapStateToProps(state) {
        return {
            ...state.home, // 这个home指的就是 combineReducers中的key
            ...state.app // 如果使用 ... home和app中如果有同名属性，app会覆盖home，可以通过调整...state.app，和...state.home得顺序，决定当前页面使用谁的属性。
        };
    }

    ```
- action负责准备数据，数据来源：
    - 调用action方法时传入的参数
    - ajax请求的异步数据
    - storage/cookie中获取数据
- reducer为纯函数，负责处理数据，要对state做deepcopy，返回一个新的数据，不要直接操作state，不会涉及异步，不操作Storage，单纯的获取action的数据之后，做进一步处理。
- store负责将数据以props形式传递给component，以及通过中间件对数据统一处理。
- 组件，调用触发action，获取store处理过的数据，不发送ajax，不操作storage，单纯的展示数据。
- 适当的区分哪些数据需要redux处理，哪些数据直接使用state，不要为了redux而redux
    - 哪些数据适合使用redux处理？
        - 异步数据（包括ajax，websocket，异步状态loading等）
        - 来自cookie/localStorage等其他存储的数据
        - 多组件公用数据
        - 多组件间通信数据
    - 哪些数据直接使用组件内部state即可？
        - 不涉及组件外数据修改（比如ajax修改后端数据），不被其他任何外部组件使用的数据，比如：点击显示隐藏modal；点击展开收起div等控制内部状态的数据。

### action：
- action 使用的是`redux-actions`模块构建的 `Flux Standard Action`
    ```javascript
    createAction(type, payloadCreator = Identity, ?metaCreator)
    ```
- 各个action文件之间，不允许出现同名方法，`src/actions/index.js`中有检测。

### 回调处理
调用actions方法时，给actions方法传入一个回调参数，这个回调参数，最终是由 `createAction` 的 `metaCreator` 参数处理的，项目中做了封装。`metaCreator` 可以携带业务以外的数据，异步actions会触发两次reducer，第一次触发时`payloadCreator` 传递给reducer的是promise对象，无法携带其他数据了，这时候就可以通过`metaCreator`携带额外的数据。

```javascript
export const testAsync = createAction(
    types.TEXT_ASYNC_DEMO,
    async()=> {
        return await homeService.getMsg(); // 返回promise
    },
    (onResolve, onReject)=> {
    	return {
    		onResolve,
    		onReject,
    		sync: 'home'
    	}
    }
);

/* 解释

(onResolve, onReject)=> {
    return {
        onResolve,
        onReject,
        sync: 'home'
    }
}
就是 createAction 的第三个参数 metaCreator，是一个函数，这个函数返回的数据，最终存放在action的meta中。
返回数据 onResolve 和 onReject 就是调用action方法时传入的回调函数，一个代表成功，一个代表失败，这两个数据最终会被 src/store/asyncActionCallbackMiddleware.js中间件使用
*/
```

### 异步写法
异步是使用`src/store/promise-middleware.js`中间件进行处理的
一本异步action其实是触发了两次reducer，第一次标记异步开始，reducer可以获取相应的标记，第二次异步完成，返回数据。具体可以参考`promise-middleware.js`源码

#### action异步写法
```javascript
import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as profileService from '../services/profile-service';

export const saveUserMessage = createAction(types.SAVE_USER_MESSAGE,
    (userMessage) => profileService.saveUserMessage(userMessage), // 返回一个promise实例
    (userMessage, onResolve, onReject) => {
    // 异步action将触发reducer两次，reducer第一次触发获取payload是promise对象，额外的数据就要metaCreator提供了。
        return {
            onResolve, // 执行异步action成功回调，使页面可以获取异步成功
            onReject, // 执行异步action失败回调，使页面可以处理异步失败
            errorTip: '保存失败', // 系统自动提示错误， 默认 ‘未知系统错误’ 传递false，不使用系统提示
            successTip: '个人信息修改成功', // 默认 false，不显示成功提示信息，
        };
    }
);
```

#### reducer 异步写法：
有两种写法，第一种有机会获取所有action的数据，第二种，只能获取自己type的action数据，个人觉得获取所有action数据没有用，反而状态受干扰。推荐第二种写法
```javascript
import * as types from '../constants/actionTypes';

let initialState = {
    isSidebarCollapsed: false,
    fetching: false,
};

export default function (state = initialState, action) {
    const {payload, error, meta={}, type} = action;
    const {sequence = {}} = meta;
    const status = sequence.type === 'start';
    if (status || error) { // 出错，或者正在请求中，注意： 这种写法将捕获所有异步action，自己模块得status要在自己的case中写。
        return {
            ...state,
            fetching: status,
        };
    }
    switch (type) {
    case types.TOGGLE_SIDE_BAR: {
        const isSidebarCollapsed = !state.isSidebarCollapsed;
        return {
            ...state,
            isSidebarCollapsed,
        };
    }
    case types.GET_STATE_TO_STORAGE: {
        return {
            ...state,
            ...(payload.setting || initialState),
        };
    }
    default:
        return state;
    }
}

```
```javascript
import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    loading: false,
    orderState: '',
};

export default handleActions({
    [types.SAVE_USER_MESSAGE](state, action) {
        const {error, meta = {}} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';

        // loading 要反应到页面上，
        // error由middleware处理，全局message提示，或者各个页面添加回调处理
        if (loading || error) {
            return {
                ...state,
                loading,
            };
        }

        return {
            ...state,
            orderState: 'success',
            loading,
        };
    },
}, initialState);

```

### redux中的异常处理
- 基于`flux-standard-action` 规范，异常action返回结构为：`{..., payload: error, error: true, ...}`
- `utils-middleware.js`会统一截获处理异常（无论异步还是同步）， 会根据 `meta.errorTip`来确定是否全局提示处理异常信息
- `async-action-callback-middleware.js` 会调用actions的回调函数，给具体页面处理异常的机会


#### 异步异常
异步操作统一使用的是promise，异常捕获在`src/store/promise-middleware.js`中间件中，一旦异步操作出现异常，action将传递给相应的reducer`{..., payload: error, error: true, ...}`

#### 同步异常
如果`action`返回的`payload`是一个`Error`对象，`redux-actions`，将自动设置`action.error`为`true`
自己可以在action中，使用`try-catch`处理？？？

### 将数据存储到localStorage中
开发过程中只需要在action中添加sync标记即可实现state存储到localStorage。
以及src/actions/utils.js 的 getStateFromStorage 方法中维护对应的sync，即可同步localStorage到state中。

action中通过 metaCreator 的 sync 属性来标记这个action相关的state是否存储到localStorage中。其中sync将会作为存储数据的key
```js
export const setSettings = createAction(types.SET_SETTING, data => data, () => ({sync: 'setting'}));
```

使用 sync-reducer-to-local-storage-middleware.js 中间件进行存储操作：
```js
import {isFSA} from 'flux-standard-action';
import * as types from '../constants/actionTypes';
import * as storage from '../utils/storage';

export default ({dispatch, getState}) => next => action => {
    if (!isFSA(action)) {
        return next(action);
    }

    const {meta = {}, sequence = {}, error, payload} = action;
    const {sync} = meta;

    if (action.type === types.SYNC_STATE_TO_STORAGE) {
        let state = getState();
        try {
            storage.setItem(payload, state[payload]);
        } catch (err) {
            /* eslint-disable */
            console.warn(err);
        }
    }

    if (!sync || sequence.type === 'start' || error) {
        return next(action);
    }

    next(action);

    setTimeout(() => {
        dispatch({
            type: types.SYNC_STATE_TO_STORAGE,
            payload: sync,
        });
    }, 16);
};

```

项目启动的时候，会在src/layouts/app-frame/AppFrame.jsx 中调用 actions.getStateFromStorage(); 方法，将localStorage中的数据同步到state中

actions.getStateFromStorage(); 在 src/actions/utils.js中实现：
```js
// 同步本地数据到state中
export const getStateFromStorage = createAction(types.GET_STATE_FROM_STORAGE, () => {
    return Storage.multiGet(['setting']); // action 中使用sync标记的同时，这里也需要对应的添加，否则无法同不会来
}, (onResolve, onReject) => {
    return {
        onResolve,
        onReject,
    };
});
```

### 撤销&重做

通过 [redux-undo](https://github.com/omnidan/redux-undo) 可以实现撤销&重做功能

通过undoable 对reducer进行包装，就可以实现撤销&重做功能
```
import undoable, {includeAction} from 'redux-undo';

...

export default undoable(organization, {
    filter: includeAction([types.SET_ORGANIZATION_TREE_DATA]),
    limit: 10,
    undoType: types.UNDO_ORGANIZATION,
    redoType: types.REDO_ORGANIZATION,
});

```

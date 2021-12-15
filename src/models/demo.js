export default {
    /**
     * 初始化 state
     *
     * 推荐将model中用到的所有state，都进行初始化：
     * 1. 合理的初始化值，可以避免使用错误；
     * 2. 可以通过state列表快速知晓当前model提供的数据结构
     * */
    state: {
        name: '默认值',
        user: null,
        syncObj: {
            good: 123,
            bar: {
                a: {
                    aa: 'aa',
                    aaa: 'aaa',
                    aaaa: ['a', 'a1', 'a2'],
                },
            },
            foo: ['f', 'f1'],
        },
    },
    /**
     * 将 state 同步到 localStorage中
     * 默认false，两种传值方式：
     * 1. true 所有当前model state 都同步
     * 2. [path, path, ...] 指定jsonpath同步，详见：https://lodash.com/docs/4.17.15#get
     */
    syncLocal: ['syncObj.bar.a.aaaa[1]', 'syncObj.foo', 'name', 'user'],
    /**
     * 配置同 syncLocal，同步到sessionStorage中
     */
    // syncSession: true,

    /**
     * 同步、异步都做try捕获，出现错误是否调用handleError方法进行错误处理，
     * 默认 true，全部处理，可以单独指定哪些需要自动处理
     */
    errorTip: {
        async: true, // 异步提示
        sync: true, // 同步提示
        getUser: '获取用户失败了吧！！！', // getUser提示 优先级最高
    },

    /**
     * 操作成功提示，默认false，规则同errorTip
     */
    successTip: {
        async: false, // 异步提示
        sync: false, // 同步提示
        getUser: '获取用户成功！！！', // getUser提示 默认 "操作成功"
        setUser: '设置用户成功',
    },
    /**
     * 撤销、重做
     * 默认false，两种赋值方式：
     * 1. true，当前model所有方法都将触发撤销、重做历史记录，配置将使用redux-undo默认值
     * 2. object，指定配置，详细参考 https://github.com/omnidan/redux-undo
     *      新增include、exclude两个配置，对标 redux-undo filter。一般只配置一个即可，如果两个同时存在，include生效
     *
     * 如果配置了 undoable
     * 1. state数据结构将被转化成：（只影响connect取值，不影响method返回值）
     * demo = {
     *   future: []
     *   group: null
     *   index: 4
     *   limit: 5
     *   past: (4) [{…}, {…}, {…}, {…}]
     *   present: {name: 1618027715626, ...}
     * }
     * 2. 新增方法：（model中不要定义如下一些方法，会被覆盖掉）
     * `${modelName}Undo`  （demoUndo）
     * `${modelName}Redo`
     * `${modelName}Jump`
     * `${modelName}JumpToPast`
     * `${modelName}JumpToFuture`
     * `${modelName}ClearHistory`
     * */
    undoable: {
        // https://github.com/omnidan/redux-undo
        include: ['setName'],
        exclude: ['setOptions'], // include exclude 同时存在，include将覆盖exclude
        limit: 5,
    },
    /**
     * 异步防抖，默认true，异步还是会执行，只是确保结果的顺序
     * 两种传参方式：
     * 1. true 异步全部防抖
     * 2. ['getUser'] 指定getUser方法防抖，其他不防抖
     */
    // debounce: [
    //     // 'testAsync',
    // ],
    /**
     * 同步方法，返回一个对象，或者 其他，如果返回的不是对象，将不会合并到state中
     * 内部ActionType: action_user_setName （action_模块名_函数名）
     * @param name 自定义参数
     * @param state 当前model state 数据
     * @returns {{name}} 返回：1. 对象 将于state进行合并；2. falsity 假值，不做state处理
     */
    setName(name, state) {
        console.log('同步方法获取的参数', name, state);
        return { name };
    },
    setOptions: (options) => {
        console.log('setOptions 方法被调用');
        return { options };
    },

    /**
     * 异步方法，返回promise
     * 数据中自动添加 state.getUserLoading、state.getUserError 数据
     * 内部ActionType: action_user_getUser_resolve action_user_getUser_reject action_user_getUser_padding
     * 设置debounce，进行防抖：连续多次调用，如果上次未结束，结果将被抛弃，最后一次调用结果将合并到state中。
     * @param id
     * @param state
     * @returns {Promise<{name: number, age: number}>} promise resolve 值逻辑与同步方法相同
     */
    async getUser(id, state) {
        console.log('getUser state', state);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.5 ? resolve({ user: { name: 123, age: 23 } }) : reject(new Error('获取用户失败！'));
            }, 2000);
        });
    },
    testAsync: async (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ asyncResult: `${time}秒执行结果` });
            }, time);
        });
    },
};

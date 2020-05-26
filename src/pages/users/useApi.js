import * as ajax from 'src/commons/ajax';

/*
* TODO
* 三种写法：字符串、对象、函数
*   最终都会转化为函数
*
* 简化写法：
* 方法命名，推导出 http method :
*   getXxx -> get
*   deleteXxx -> del
*   saveXxx -> post
*   updateXxx -> put
*
{
    getUser: '/users',
    deleteUser: '/users/:id',
    saveUser: '/users',
    updateUser: '/users',

    login: {
        method: 'post', // 默认get
        url: '/login',
        options: {successTip: '登录成功'},
    }
}
*
* 基于 swagger 生成 api sdk
*
* api提供hooks版本，和 基础 promise版本
* getUser: (hook = true) => hook ? useGet(...) : (params, options) => ajax.get('/users', params, options)
* */

export default {
    getUser: () => ajax.useGet('/mock/users'),
    deleteUser: () => ajax.useDel('/mock/users/:id', {successTip: '删除成功！', errorTip: '删除失败！'}),
    deleteUsers: () => ajax.useDel('/mock/users', {successTip: '删除成功！', errorTip: '删除失败！'}),
};

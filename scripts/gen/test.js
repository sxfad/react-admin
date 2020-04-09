const regEx = /[`~!@#$%^&*()_\-+=|{}':;',\[\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？ ]/;
const str = '用户名，不,能添加 啊';
// console.log(regEx.test(str));
// console.log(str.split(regEx));


// console.log(new URL('mysql://fd:123456@172.16.60.247:3306/wechat_message'));
const {getTableNames, getTableColumns} = require('./my-sql');

getTableNames('mysql://fd:123456@172.16.60.247:3306/wechat_message').then(data => {
    console.log(data);
});

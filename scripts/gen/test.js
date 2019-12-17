const regEx = /[`~!@#$%^&*()_\-+=|{}':;',\[\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？ ]/;
const str = '用户名，不,能添加 啊';
console.log(regEx.test(str));
console.log(str.split(regEx));

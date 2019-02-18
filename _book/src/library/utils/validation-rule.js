import {getStringByteLength, stringFormat} from './index';
import {debounce} from 'lodash/function';
import * as regexps from './regexp';

/**
 * @ignore
 * currying function 简化异步校验封装，进行节流，提高性能
 * @param ajax
 * @returns {*}
 */
export function remoteCheck(ajax) {
    // 节流
    return debounce((options) => { // options = {rule, value, callback, ignoreValues, [自定义字段]}
        let {value, callback, ignoreValues = []} = options; // ignoreValues 忽略的values，不进行检测，常用与修改的情况
        if (!ignoreValues) ignoreValues = []; // 有可能是 null情况

        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }

        if (!value || ignoreValues.indexOf(value) > -1) {
            return callback();
        }

        ajax(options)
            .catch(err => {
                if (typeof err === 'string') {
                    return callback(err);
                }
                callback((err && err.response && err.response.data && (err.response.data.resultMsg || err.response.data.message)) || '未知系统错误');
            });
    }, 300);
}

export default {
    noSpace(message = '不能含有空格！') {
        return {
            validator: (rule, value, callback) => {
                if (/\s/g.test(value)) return callback(message);
                return callback();
            },
        };
    },

    mobile(message = '请输入正确的手机号！') { // 手机号
        return {
            pattern: regexps.mobile,
            message,
        };
    },

    // fixme: landLine
    landline(message = '请输入正确的座机号！') { // 座机
        return {
            pattern: regexps.landLine,
            message,
        };
    },

    qq(message = '请输入正确的qq号！') { // qq号
        return {
            pattern: regexps.qq,
            message,
        };
    },

    cardNumber(message = '请输入正确的身份证号！') { // 身份证号十五位十八位最后X的校验
        return {
            pattern: regexps.cardNumber,
            message,
        };
    },

    email(message = '请输入正确的邮箱！') {
        return {
            type: 'email',
            message,
        };
    },

    number(message = '请输入数字.') { // 纯数字，不包括 + -
        return {
            pattern: regexps.number,
            message,
        };
    },
    integer(message = '请输入整数！') { // 整数
        return {
            pattern: regexps.integer,
            message,
        };
    },
    positiveInteger(message = '请输入正整数！') { // 正整数 = 不按包含0
        return {
            pattern: regexps.positiveInteger,
            message,
        };
    },
    numberWithTwoDecimal(message = '请输入数字，保存两位小数.') {
        return {
            pattern: regexps.numberWithTwoDecimal,
            message,
        };
    },
    numberRange(min, max, message = '请输入{min}到{max}之间的值.') {
        return {
            validator(rule, value, callback) {
                value = Number(value);

                if (!value && value !== 0) return callback();

                (value < min || value > max) ? callback(stringFormat(message, {min, max})) : callback();
            },
        };
    },
    numberMaxRange(max, message = '不能大于{max}') {
        return {
            validator(rule, value, callback) {
                value = Number(value);

                if (!value && value !== 0) return callback();

                value > max ? callback(stringFormat(message, {max})) : callback();
            },
        };
    },
    numberMinRange(min, message = '不能小于{min}') {
        return {
            validator(rule, value, callback) {
                value = Number(value);

                if (!value && value !== 0) return callback();

                value < min ? callback(stringFormat(message, {min})) : callback();
            },
        };
    },

    stringByteRangeLength(min, max, message = '请输入 {min}-{max} 个字符(汉字算2个字符).') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                let length = getStringByteLength(value);
                (length < min || length > max) ? callback(stringFormat(message, {min, max})) : callback();
            },
        };
    },
    stringByteMinLength(min, message = '最少输入{min}个字符(汉字算2个字符).') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                let length = getStringByteLength(value);
                length < min ? callback(stringFormat(message, {min})) : callback();
            },
        };
    },
    stringByteMaxLength(max, message = '最多输入{max}个字符(汉字算2个字符).') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                let length = getStringByteLength(value);
                length > max ? callback(stringFormat(message, {max})) : callback();
            },
        };
    },

    arrayMaxLength(max, message = '最多{max}个值') {
        return {
            validator(rule, value, callback) {
                if (!value || !Array.isArray(value)) return callback();
                let length = value.length;
                length > max ? callback(stringFormat(message, {max})) : callback();
            },
        };
    },
};

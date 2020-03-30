import {getStringByteLength, stringFormat} from './index';
import * as regexps from './regexp';

export default {
    ip(message = '请输入正确的IP地址！') {
        return {
            pattern: regexps.ip,
            message,
        };
    },
    port(message = '请输入正确的端口号！') {
        return {
            pattern: regexps.port,
            message,
        };
    },
    noSpace(message = '不能含有空格！') {
        return {
            validator: (rule, value) => {
                if (/\s/g.test(value)) return Promise.reject(message);
                return Promise.resolve();
            },
        };
    },

    mobile(message = '请输入正确的手机号！') { // 手机号
        return {
            pattern: regexps.mobile,
            message,
        };
    },

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
            validator(rule, value) {
                if (!value) return Promise.resolve();

                value = Number(value);

                if (!value && value !== 0) return Promise.resolve();

                (value < min || value > max) ? Promise.reject(stringFormat(message, {min, max})) : Promise.resolve();
            },
        };
    },
    numberMaxRange(max, message = '不能大于{max}') {
        return {
            validator(rule, value) {
                if (!value) return Promise.resolve();

                value = Number(value);

                if (!value && value !== 0) return Promise.resolve();

                value > max ? Promise.reject(stringFormat(message, {max})) : Promise.resolve();
            },
        };
    },
    numberMinRange(min, message = '不能小于{min}') {
        return {
            validator(rule, value) {
                if (!value) return Promise.resolve();

                value = Number(value);

                if (!value && value !== 0) return Promise.resolve();

                value < min ? Promise.reject(stringFormat(message, {min})) : Promise.resolve();
            },
        };
    },

    stringByteRangeLength(min, max, message = '请输入 {min}-{max} 个字符(汉字算2个字符).') {
        return {
            validator(rule, value) {
                if (!value) return Promise.resolve();

                let length = getStringByteLength(value);
                (length < min || length > max) ? Promise.reject(stringFormat(message, {min, max})) : Promise.resolve();
            },
        };
    },
    stringByteMinLength(min, message = '最少输入{min}个字符(汉字算2个字符).') {
        return {
            validator(rule, value) {
                if (!value) return Promise.resolve();
                let length = getStringByteLength(value);
                length < min ? Promise.reject(stringFormat(message, {min})) : Promise.resolve();
            },
        };
    },
    stringByteMaxLength(max, message = '最多输入{max}个字符(汉字算2个字符).') {
        return {
            validator(rule, value) {
                if (!value) return Promise.resolve();
                let length = getStringByteLength(value);
                length > max ? Promise.reject(stringFormat(message, {max})) : Promise.resolve();
            },
        };
    },

    arrayMaxLength(max, message = '最多{max}个值') {
        return {
            validator(rule, value) {
                if (!value || !Array.isArray(value)) return Promise.resolve();
                let length = value.length;
                length > max ? Promise.reject(stringFormat(message, {max})) : Promise.resolve();
            },
        };
    },
};

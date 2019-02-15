import {
    firstUpperCase,
    firstLowerCase,
    getStringByteLength,
} from './index';

test('firstUpperCase test to be Test', () => {
    expect(firstUpperCase('test')).toBe('Test');
});

test('firstUpperCase user name job to be User Name Job', () => {
    expect(firstUpperCase('user name job')).toBe('User Name Job');
});

test('firstUpperCase 123 be "123"', () => {
    expect(firstUpperCase(123)).toBe('123');
});


test('firstLowerCase User be user', () => {
    expect(firstLowerCase('User')).toBe('user');
});

test('firstLowerCase User Name Job be user name job', () => {
    expect(firstLowerCase('User Name Job')).toBe('user name job');
});

test('firstLowerCase 123 be "123"', () => {
    expect(firstLowerCase(123)).toBe('123');
});


test('getStringByteLength ab123$%^&中文 length will be 13', () => {
    expect(getStringByteLength('ab123$%^&中文')).toBe(13);
});

test('getStringByteLength 123456 length will be 6', () => {
    expect(getStringByteLength(123456)).toBe(6);
});

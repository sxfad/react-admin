import React, {} from 'react';
import {Input} from 'antd';
import PropTypes from 'prop-types';

function UnitInput(props) {
    const {
        onKeyDown,
        onKeyUp,
        onChange,
        ...others
    } = props;

    function getNextValue(e, offsetValue) {
        let nextValue = e.target.value || '';
        nextValue = nextValue.trim();

        // 为纯数字 直接转换为数字
        if (nextValue && !window.isNaN(nextValue)) {
            nextValue = window.parseFloat(nextValue);
        }

        if (!offsetValue) return nextValue;

        if (!nextValue) nextValue = 0;
        // 为纯数字 直接增减
        if (!window.isNaN(nextValue)) {
            nextValue += offsetValue;
        } else {
            // 带单位，增加数字
            const re = /(-?\d+)(\.\d+)?/.exec(nextValue);
            if (re) {
                const numStr = re[0];
                const tempValue = nextValue.replace(numStr, '<__>');
                let num = window.parseFloat(numStr);
                num += offsetValue;
                nextValue = tempValue.replace('<__>', num);
            }
        }

        return nextValue;
    }

    function handleDoubleClick(e) {
        e.preventDefault();
        let nextValue = getNextValue(e, e.shiftKey ? -8 : 8);

        // 有处理过，重新触发onChange

        if (e.target.value !== nextValue) {
            onChange && onChange({target: {value: nextValue}});
        }
    }

    function handleKeyDown(e) {
        onKeyDown && onKeyDown(e);
        const {key} = e;

        const isUp = key === 'ArrowUp';
        const isDown = key === 'ArrowDown';

        // 防止光标来回跳动
        if (isUp || isDown) e.preventDefault();

        let nextValue = getNextValue(e);

        // 处理上下
        if (isUp) nextValue = getNextValue(e, 1);
        if (isDown) nextValue = getNextValue(e, -1);

        // e.target.value = nextValue;
        // onChange && onChange(e);

        // 有处理过，重新触发onChange
        if (e.target.value !== nextValue) {
            onChange && onChange({target: {value: nextValue}});
        }
    }

    function handleKeyUp(e) {
        let nextValue = e.target.value || '';
        nextValue = nextValue.trim();

        // 为纯数字 直接转换为数字
        if (nextValue && !window.isNaN(nextValue)) {
            nextValue = window.parseFloat(nextValue);
        }

        // 有处理过，重新触发onChange
        if (e.target.value !== nextValue) {
            onChange && onChange({target: {value: nextValue}});
        }
    }

    return (
        <Input
            autoComplete="off"
            onChange={onChange}
            {...others}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onDoubleClick={handleDoubleClick}
        />
    );

}

UnitInput.propTypes = {
    allowClear: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object,
};
UnitInput.defaultProps = {
    allowClear: true,
    placeholder: '请输入',
};

export default UnitInput;

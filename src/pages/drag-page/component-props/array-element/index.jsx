import React from 'react';
import {InputNumber, Input, Switch} from 'antd';
import PropTypes from 'prop-types';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';

const ArrayElement = props => {
    const {
        value = [],
        onChange,
        allowClear = true,
        placeholder = [],
        length,
        type,
    } = props;

    let Element = Input;
    if (type === 'number') Element = InputNumber;
    if (type === 'unit') Element = UnitInput;
    if (type === 'boolean') Element = Switch;

    function handleChange(e, index) {
        let nextValue = Array.from({length}).map((_, i) => {
            if (i === index) {
                let nextValue;
                if (typeof e === 'object' && 'target' in e) {
                    nextValue = e.target.value;
                } else {
                    nextValue = e;
                }

                if (nextValue === null || nextValue === '') return undefined;

                return nextValue;
            }
            return value[i];
        });
        if (nextValue.every(item => item === undefined)) nextValue = undefined;
        onChange(nextValue);
    }

    return (
        <div style={{
            width: '100%',
            display: 'flex',
        }}>
            {Array.from({length}).map((_, index) => {
                return (
                    <Element
                        key={index}
                        style={{flex: 1, marginRight: 8}}
                        allowClear={allowClear}
                        value={value[index]}
                        onChange={e => handleChange(e, index)}
                        placeholder={placeholder[index] || '请输入'}
                    />
                );
            })}
        </div>
    );
};

ArrayElement.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    allowClear: PropTypes.bool,
    placeholder: PropTypes.array,
    type: PropTypes.any,
    length: PropTypes.number,
};

export default ArrayElement;

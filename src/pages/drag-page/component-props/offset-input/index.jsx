import React from 'react';
import {InputNumber} from 'antd';
import PropTypes from 'prop-types';

const OffsetInput = props => {
    const {value = [], onChange, allowClear = true, placeholder = ['x', 'y']} = props;

    return (
        <div style={{
            width: '100%',
            display: 'flex',
        }}>
            <InputNumber
                style={{flex: 1, marginRight: 8}}
                allowClear={allowClear}
                value={value[0]}
                onChange={e => onChange([e, value[1]])}
                step={1}
                placeholder={placeholder[0]}
            />
            <InputNumber
                style={{flex: 1}}
                allowClear={allowClear}
                value={value[1]}
                onChange={e => onChange([value[0], e])}
                step={1}
                placeholder={placeholder[1]}
            />
        </div>
    );
};

OffsetInput.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    allowClear: PropTypes.bool,
    placeholder: PropTypes.array,
};

export default OffsetInput;

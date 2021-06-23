import React, {useMemo, useState} from 'react';
import {getElement} from 'src/pages/drag-page/component-props/form-element';
import {Select} from 'antd';

const MultipleElement = props => {
    const {
        fieldOption,
        node,
        value,
        onChange,
        ...others
    } = props;
    const {type, field} = fieldOption;

    let valueType = typeof value;

    if (Array.isArray(value)) valueType = 'array';

    const typeOption = type.find(item => item.value === valueType);

    const [currentType, setCurrentType] = useState(node[`__${field}_type`] || type[0].value);

    const Ele = useMemo(() => {
        let type = currentType;

        if (currentType === 'object' || currentType === 'array') {
            type = typeOption;
        }
        return getElement({...fieldOption, type, node});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentType]);

    return (
        <div style={{display: 'flex', alignItems: currentType === 'object' ? 'flex-start' : 'center'}}>
            <Select
                style={{flex: '0 0 80px', marginRight: 4}}
                options={type}
                value={currentType}
                onChange={val => {
                    node[`__${field}_type`] = val;
                    setCurrentType(val);
                    onChange(undefined);
                }}
            />
            <div style={{flex: 1}}>
                <Ele value={value} onChange={onChange}  {...others}/>
            </div>
        </div>
    );
};

MultipleElement.propTypes = {};

export default MultipleElement;

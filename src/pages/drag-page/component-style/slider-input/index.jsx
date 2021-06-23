import React from 'react';
import {Row, Col, Slider, InputNumber} from 'antd';
import PropTypes from 'prop-types';

const SliderInput = props => {
    let {
        value,
        onChange,
        max,
        min = 0,
        suffix = '',
        percent,
        placeholder = '请输入',
    } = props;

    const step = percent ? 0.01 : 1;
    if (!max) max = percent ? 1 : 1000;

    return (
        <Row>
            <Col span={16}>
                <Slider
                    min={min}
                    max={max}
                    onChange={onChange}
                    value={value}
                    step={step}
                    tipFormatter={value => percent ? `${Math.round(value * 100)}%` : value}
                />
            </Col>
            <Col span={8} style={{paddingLeft: 8}}>
                <InputNumber
                    style={{width: '100%'}}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    onChange={onChange}
                    value={value}
                    formatter={value => value ? `${Math.round(value * (percent ? 100 : 1))}${suffix}` : value}
                    parser={value => Math.round(value.replace(suffix, '') / (percent ? 100 : 1))}
                />
            </Col>
        </Row>
    );
};

SliderInput.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    suffix: PropTypes.func,
    percent: PropTypes.bool,
};

export default SliderInput;

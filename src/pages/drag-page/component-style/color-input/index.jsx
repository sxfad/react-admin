import React from 'react';
import PropTypes from 'prop-types';
import {Input, Popover} from 'antd';
import {SketchPicker} from 'react-color';
import styles from './style.less';
import theme from '../../../../theme.less';

const presetColors = [
    theme.primaryColor,
    '#FFFFFF',
    '#D8D8D8',
    '#9B9B9B',
    '#4A4A4A',
    '#000000',
    '#D0021B',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
];

function ColorInput(props) {
    const {
        value,
        onChange,
        ...others
    } = props;

    return (
        <div styleName="root">
            <Input
                value={value}
                onChange={onChange}
                addonBefore={(
                    <Popover
                        trigger="click"
                        overlayClassName={styles.overlay}
                        getPopupContainer={() => document.body}
                        content={(
                            <SketchPicker
                                width={250}
                                color={value}
                                presetColors={presetColors}
                                onChangeComplete={color => {
                                    const {source, rgb, hex} = color;
                                    let value = hex;
                                    if (source === 'rgb') value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
                                    onChange(value);
                                }}
                            />
                        )}
                    >
                        <div styleName="colorPreview" style={{backgroundColor: value}}/>
                    </Popover>
                )}
                {...others}
            />
        </div>
    );

}

ColorInput.propTypes = {
    allowClear: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object,
};
ColorInput.defaultProps = {
    allowClear: true,
    placeholder: '请输入颜色值',
};

export default ColorInput;

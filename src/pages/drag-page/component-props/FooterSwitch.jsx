import React from 'react';
import {Switch} from 'antd';

export default function FooterSwitch(props) {

    const {value, onChange, ...others} = props;

    function handleChange(checked) {
        onChange && onChange(checked ? undefined : null);
    }

    const checked = value === undefined;
    return <Switch checked={checked} onChange={handleChange} {...others}/>;
}

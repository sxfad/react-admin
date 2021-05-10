import React from 'react';
import {money} from 'src/commons';

export default function Money(props) {
    const {children, ...others} = props;
    const valueStr = money(children);

    return <span {...others}>{valueStr}</span>
}

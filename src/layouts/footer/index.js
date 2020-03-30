import React from 'react';
import { CopyrightOutlined } from '@ant-design/icons';
import './style.less';

export default function (props) {
    return (
        <div styleName="footer" {...props}>
            Copyright <CopyrightOutlined /> xxx 2019
        </div>
    );
}

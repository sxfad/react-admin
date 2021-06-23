import React from 'react';
import styles from './style.less';

export default function DragHolder(props) {
    const {
        className,
        tip = '请拖入组件',
        ...others
    } = props;

    return (
        <div
            className={`${styles.root} ${className} DragHolder`}
            {...others}
        >
            {tip}
        </div>
    );
};


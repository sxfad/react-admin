import React from 'react';
import styles from './style.less';

export default function RootDragHolder(props) {
    const {
        className,
        ...others
    } = props;

    return (
        <div
            className={`${styles.root} ${className} RootDragHolder`}
            {...others}
        >
            <div className={styles.tip}>请拖入组件</div>
        </div>
    );
};


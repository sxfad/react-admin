import React from 'react';
import styles from './style.less';

function Text(props) {
    const {text, isDraggable, ...others} = props;
    return (
        <span className={isDraggable ? styles.draggable : styles.unDraggable} {...others}>
            {text}
        </span>
    );
}

Text.defaultProps = {
    isDraggable: true,
};
export default Text;


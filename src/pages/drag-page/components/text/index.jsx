import React from 'react';
import './style.less';

function Text(props) {
    const {text, isDraggable, ...others} = props;
    return (
        <span styleName={isDraggable ? 'draggable' : 'unDraggable'} {...others}>
            {text}
        </span>
    );
}

Text.defaultProps = {
    isDraggable: true,
};
export default Text;


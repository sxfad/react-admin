import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.less';

const RectInputsWrapper = props => {
    const {children, inner, large, tip, ...others} = props;

    const styleName = classNames({
        root: true,
        inner,
        large,
        tip,
    });
    return (
        <div styleName={styleName} {...others}>
            {children.flat().map(item => (<div data-tip={tip}>{item}</div>))}
        </div>
    );
};

RectInputsWrapper.propTypes = {
    inner: PropTypes.bool,
    large: PropTypes.bool,
    tip: PropTypes.string,
};

RectInputsWrapper.defaultProps = {
    // large: true,
};

export default RectInputsWrapper;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.less';

const RectInputsWrapper = props => {
    const {children, inner, large, tip, ...others} = props;

    return (
        <div className={{
            [styles.root]: true,
            [styles.inner]: true,
            [styles.large]: large,
            [styles.tip]: tip
        }}
             {...others}
        >
            {children.flat().map(item => (<div key={item} data-tip={tip}>{item}</div>))}
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

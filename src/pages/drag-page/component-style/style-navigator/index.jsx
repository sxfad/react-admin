import React from 'react';
import {Tooltip} from 'antd';
import PropTypes from 'prop-types';
import {scrollElement} from 'src/pages/drag-page/util';
import './style.less';

const StyleNavigator = props => {
    const {
        dataSource,
        containerRef,
        onClick,
        ...others
    } = props;

    return (
        <div styleName="root" {...others}>
            {dataSource.map(item => {
                const {key, title, icon} = item;
                const id = `style-${key}`;

                return (
                    <Tooltip placement="left" title={title}>
                        <div
                            onClick={() => {
                                onClick && onClick(key);
                                const element = document.getElementById(id);
                                scrollElement(containerRef.current, element, true, true, -12);
                            }}
                        >
                            {icon}
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
};

StyleNavigator.propTypes = {
    dataSource: PropTypes.array,
    containerRef: PropTypes.object,
    onClick: PropTypes.func,
};

export default StyleNavigator;

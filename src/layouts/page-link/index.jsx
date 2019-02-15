import React from 'react';
import {Link as RLink, Route} from 'react-router-dom';

/**
 * 页面Link组件，如果当前url已经匹配当前link了，点击无效
 * @param children
 * @param to
 * @param others
 * @returns {*}
 * @constructor
 */
export default function Link({children, to, ...others}) {
    const path = typeof to === 'object' ? to.pathname : to;
    return (
        <Route
            path={path}
            exact
            children={({match}) => {
                return match ? <a>{children}</a> : <RLink to={to} {...others}>{children}</RLink>;
            }}
        />
    );
}

import {getQuery} from '@ra-lib/util';
import {getLoginUser} from './util';

/**
 * 通用高阶组件
 * @param options
 * @returns {function(*): function(*)}
 */
export default function commonHoc(options) {
    const {query, loginUser} = options;
    return WrappedComponent => {
        const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        const WithLayout = props => {
            // 默认添加属性到props中的属性
            const extendProps = {};
            if (query !== false) extendProps.query = getQuery();
            if (loginUser !== false) extendProps.loginUser = getLoginUser();

            return <WrappedComponent {...extendProps} {...props}/>;
        };

        WithLayout.displayName = `WithCommon(${componentName})`;

        return WithLayout;
    };
}

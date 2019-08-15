import React, {Component} from 'react';
import queryString from 'qs';

export default ({propName = 'query'} = {}) => WrappedComponent => {
    class WithSubscription extends Component {
        constructor(props) {
            super(props);
            const search = queryString.parse(window.location.search, {ignoreQueryPrefix: true});
            this.query = search || {};
        }

        static displayName = `WithQuery(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        render() {
            const injectProps = {
                [propName]: this.query,
            };
            return <WrappedComponent {...injectProps} {...this.props}/>;
        }
    }

    return WithSubscription;
};

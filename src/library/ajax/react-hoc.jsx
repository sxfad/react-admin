import React, {Component} from 'react';

const createAjaxHoc = sxAjax => ({propName = 'ajax'} = {}) => WrappedComponent => {
    class WithSubscription extends Component {
        constructor(props) {
            super(props);
            this._$ajax = {};
            this._$ajaxTokens = [];
            const methods = ['get', 'post', 'put', 'patch', 'del', 'singleGet'];

            for (let method of methods) {
                this._$ajax[method] = (...args) => {
                    const ajaxToken = sxAjax[method](...args);
                    this._$ajaxTokens.push(ajaxToken);
                    return ajaxToken;
                };
            }
        }

        static displayName = `WithSubscription(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        componentWillUnmount() {
            this._$ajaxTokens.forEach(item => item.cancel());
        }

        render() {
            const injectProps = {
                [propName]: this._$ajax,
            };
            return <WrappedComponent {...injectProps} {...this.props}/>;
        }
    }

    return WithSubscription;
};

export default createAjaxHoc;

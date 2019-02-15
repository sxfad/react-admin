import React, {Component} from 'react';
import {addEventListener, removeEventListener} from './index';

/**
 * dom事件高级组件
 * 将addEventListener removeEventListener 属性注入到目标组件props中，目标组件可以通过this.props.addEventListener(element, type, handler)方式进行使用;
 * 每次addEventListener 注册事件时，保存了事件名称，在componentWillUnmount方法中，进行统一事件清除
 * @example
 * import {domEvent} from 'path/to/utils/react-hoc';
 * // 装饰器方式：
 * // @domEvent()
 * // class SomeComponent extends Component {...}
 *
 * // 传递参数，修改注入的props属性
 * // @domEvent({addPropName = '$$on'}) // 组件内调用：this.props.$$on
 * // class SomeComponent extends Component {...}
 *
 * @example
 * // 直接使用
 * import {domEvent} from 'path/to/utils/react-hoc';
 * const WrappedComponet = domEvent()(SomeComponent);
 *
 * @module dom事件高级组件
 */

export default function domEvent({addPropName = 'addEventListener', removePropName = 'removeEventListener'} = {}) {
    return function (WrappedComponent) {
        class WithSubscription extends Component {
            constructor(props) {
                super(props);
                this[addPropName] = (element, type, handler) => {
                    this._addedEvents.push({
                        element,
                        type,
                        handler,
                    });
                    addEventListener(element, type, handler);
                };
                this[removePropName] = (element, type, handler) => {
                    removeEventListener(element, type, handler);
                };
            }

            _addedEvents = [];
            static displayName = `WithSubscription(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

            componentWillUnmount() {
                // 当前组件卸载，卸载当前组件绑定过得事件
                this._addedEvents.forEach(item => {
                    const {element, type, handler} = item;
                    removeEventListener(element, type, handler);
                });
            }

            render() {
                const injectProps = {
                    [addPropName]: this[addPropName],
                    [removePropName]: this[removePropName],
                };
                return <WrappedComponent {...injectProps} {...this.props}/>;
            }
        }

        return WithSubscription;
    };
}

import React, {Component} from 'react';
import uuidV4 from 'uuid/v4';
import PubSub from 'pubsub-js'


/**
 * 发布订阅高级组件
 * 将subscribe publish 属性注入到目标组件props中，目标组件可以通过this.props.on(topic, callback)方式进行使用;
 * 每次on 注册事件时，保存了事件名称，在componentWillUnmount方法中，进行统一事件清除
 * @example
 * import {event} from 'path/to/utils/react-hoc';
 * // 装饰器方式：
 * // @event()
 * // class SomeComponent extends Component {...}
 *
 * // 传递参数，修改注入的props属性
 * // @event({subscribePropName = '$on'}) // 组件内调用：this.props.$on
 * // class SomeComponent extends Component {...}
 *
 * @example
 * // 直接使用
 * import {event} from 'path/to/utils/react-hoc';
 * const WrappedComponent = event()(SomeComponent);
 *
 * @module 发布订阅高级组件
 */

export default function event({subscribePropName = 'subscribe', publishPropName = 'publish'} = {}) {
    return (WrappedComponent) => {
        class WithPubSub extends Component {
            constructor(props) {
                super(props);
                this._channel = uuidV4();
                this.tokens = [];
                this[subscribePropName] = (topic, fn) => { // subscribe方法
                    const token = PubSub.subscribe(topic, fn);
                    this.tokens.push(token);
                    return token;
                };
                this[publishPropName] = (topic, args) => { // publish方法
                    PubSub.publish(topic, args);
                };
            }

            static displayName = `WithPubSub(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

            componentWillUnmount() {
                // 当前组件卸载，取消订阅当前组件已经订阅的事件
                this.tokens.forEach(token => {
                    PubSub.unsubscribe(token);
                });
            }

            render() {
                const injectProps = {
                    [subscribePropName]: this[subscribePropName],
                    [publishPropName]: this[publishPropName],
                };
                return <WrappedComponent {...injectProps} {...this.props}/>;
            }
        }

        return WithPubSub;
    };
}

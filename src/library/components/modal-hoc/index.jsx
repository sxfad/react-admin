import React, {Component} from 'react';
import {Modal} from 'antd';
import './style.less';

/**
 *  modal高级组件，确保每次弹框内部组件都是新创建的
 *  注：modal装饰器要放到所有其他装饰器上面（最外层）
 *
 * @param options 各种类型说明如下：
 *      string：modal 的 title
 *      function：返回值为 modal 的options
 *      object：Modal组件相关配置，具体配置参考antd Modal组件
 *          title: string | ReactNode | function(props)
 *          fullScreen: boolean 是否全屏显示modal
 *          其他 ant Modal 属性
 *
 * @param options
 * @returns {function(*): {displayName, new(): ModalComponent, prototype: ModalComponent}}
 */
export default (options) => WrappedComponent => {
    const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    return class ModalComponent extends Component {
        static displayName = `WithModal(${componentName})`;

        render() {
            const {visible, onCancel} = this.props;
            let title;

            let others = {};

            // options 如果是函数，返回值作为参数
            if (typeof options === 'function') options = options(this.props);

            // options 如果为字符串，直接作为title
            if (typeof options === 'string') title = options;

            // options 如果为对象，获取title
            if (typeof options === 'object') {
                title = options.title;
                others = options;
            }

            // 如果title为函数，返回值作为title
            if (typeof title === 'function') title = title(this.props);

            const {fullScreen} = others;

            let className = 'modal-hoc-root';
            let top = 100;
            if (fullScreen) {
                className += ' full-screen';
                top = 0;
            }

            return (
                <Modal
                    className={className}
                    destroyOnClose
                    width="800px"
                    bodyStyle={{padding: 0}}
                    style={{top}}
                    footer={null}
                    maskClosable={false}

                    {...others}
                    title={title}
                    onCancel={onCancel}
                    visible={visible}
                >
                    <WrappedComponent {...this.props}/>
                </Modal>
            );
        }
    };
};

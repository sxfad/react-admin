import React, {Component} from 'react';
import {Modal} from 'antd';

/**
 *  modal高级组件，确保每次弹框内部组件都是新创建的
 *
 * @param options 各种类型说明如下：
 *      string：modal 的 title
 *      function：modal 的title
 *      object：Modal组件相关配置，具体配置参考antd Modal组件
 *          title: string | ReactNode | function(props)
 *
 * @param options
 * @returns {function(*): {displayName, new(): ModalComponent, prototype: ModalComponent}}
 */
export default (options) => WrappedComponent => {
    const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    return class ModalComponent extends Component {
        static displayName = `withModal(${componentName})`;

        render() {
            const {visible, onCancel} = this.props;

            let title;
            if (typeof options === 'string') title = options;

            if (typeof options === 'function') title = options;

            if (typeof options === 'object') title = options.title;

            if (typeof title === 'function') title = title(this.props);

            return (
                <Modal
                    destroyOnClose
                    width="60%"
                    bodyStyle={{padding: 0}}
                    footer={null}

                    {...options}
                    title={title}

                    onCancel={onCancel}
                    visible={visible}
                >
                    <WrappedComponent {...this.props}/>
                </Modal>
            );
        }
    }
};

import React, {Component} from 'react';
import {Modal} from 'antd';
import './style.less';

/**
 *  modal高级组件，确保每次弹框内部组件都是新创建的
 *  注：modal装饰器要放到所有其他装饰器上面（最外层）
 *
 * @param options 各种类型说明如下：
 *      string：modal 的 title
 *      function：modal 的title
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

        getTitle = () => {
            let title;

            if (typeof options === 'string') title = options;

            if (typeof options === 'function') title = options;

            if (typeof options === 'object') title = options.title;

            if (typeof title === 'function') title = title(this.props);

            return title;
        };

        render() {
            const {visible, onCancel} = this.props;
            const title = this.getTitle();
            const others = typeof options === 'object' ? options : {};

            const {fullScreen} = others;

            let className = 'modal-hoc-root';
            let top = 50;
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
    }
};

import React, {Component} from 'react';
import {Modal} from 'antd';
import './style.less';

/**
 *  modal高级组件，确保每次弹框内部组件都是新创建的
 *  注：modal装饰器要放到最上面（最外层）
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
        static displayName = `withModal(${componentName})`;

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

            let styleName = 'root';
            if (fullScreen) styleName += ' full-screen';

            return (
                <Modal
                    styleName={styleName}
                    destroyOnClose
                    width="60%"
                    bodyStyle={{padding: 0}}
                    footer={null}

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

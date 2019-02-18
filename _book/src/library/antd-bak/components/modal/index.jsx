import React, {Component} from 'react';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style/css';

// 扩展beforeOpen回调

export default class ModalComponent extends Component {

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.beforeOpen && this.props.beforeOpen();
        }
    }

    static info = Modal.info;
    static success = Modal.success;
    static error = Modal.error;
    static warning = Modal.warning;
    static confirm = Modal.confirm;

    render() {
        return (
            <Modal {...this.props}>
                {this.props.children}
            </Modal>
        );
    }
}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, notification} from 'antd';
import uuid from 'uuid/v4';
import ClipboardJS from 'clipboard';
import Highlight from 'react-highlight'
import 'highlight.js/styles/github.css';

export default class PreviewCodeModal extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        code: PropTypes.string.isRequired,
        onCancel: PropTypes.func.isRequired,
        onOk: PropTypes.func.isRequired,
    };

    static defaultProps = {
        visible: false,
        code: '',
        width: '70%',
    };
    state = {};

    contentId = `content-id-${uuid()}`;

    initClipboard = () => {
        if (this.clipboardInit) return;
        setTimeout(() => {
            if (this.btn) {
                this.clipboardInit = true;
                const clipboard = new ClipboardJS(this.btn);
                clipboard.on('success', function (e) {
                    notification.success({
                        message: '成功！',
                        description: '成功复制到粘贴板！',
                    });
                    e.clearSelection();
                });

                clipboard.on('error', function (e) {
                    notification.error({
                        message: '失败！',
                        description: '未能复制到粘贴板！',
                    });
                    console.error('Action:', e.action);
                    console.error('Trigger:', e.trigger);
                });
            }
        });
    };

    render() {
        const {
            visible,
            onCancel,
            onOk,
            code,
            width,
        } = this.props;

        this.initClipboard();

        return (
            <Modal
                style={{marginBottom: '50px'}}
                width={width}
                title="代码预览"
                visible={visible}
                onCancel={onCancel}
                onOk={onOk}
            >
                 <textarea
                     style={{position: 'fixed', right: -1000}}
                     id={this.contentId}
                     defaultValue={code}
                 />

                <div
                    style={{display: 'inline-block'}}
                    ref={node => this.btn = node}
                    data-clipboard-target={`#${this.contentId}`}
                >
                    <Button
                        style={{marginBottom: 8}}
                        className="js-preview-code-btn"
                        data-clipboard-target="#js-code-content"
                        size="small"
                    >复制</Button>
                </div>
                <Highlight>{code}</Highlight>
            </Modal>
        );
    }
}

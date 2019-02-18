import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {notification, Icon} from 'antd';
import uuid from 'uuid/v4';
import ClipboardJS from 'clipboard';
import Highlight from 'react-highlight'
import 'highlight.js/styles/github.css';


export default class Preview extends Component {
    static propTypes = {
        code: PropTypes.string.isRequired,
    };

    static defaultProps = {
        code: '',
    };
    state = {};

    contentId = `content-id-${uuid()}`;

    componentDidMount() {
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
    };

    render() {
        const {
            code,
        } = this.props;

        return (
            <div style={{position: 'relative'}}>
                <textarea
                    style={{position: 'fixed', right: -1000}}
                    id={this.contentId}
                    defaultValue={code}
                />

                <div
                    ref={node => this.btn = node}
                    style={{
                        display: 'inline-block',
                        position: 'absolute',
                        right: '-15px',
                        cursor: 'pointer',
                    }}
                    data-clipboard-target={`#${this.contentId}`}
                >
                    <Icon type="copy"/>
                </div>
                <Highlight>{code}</Highlight>
            </div>
        );
    }
}

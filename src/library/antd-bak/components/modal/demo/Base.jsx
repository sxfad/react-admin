import React, {Component} from 'react';
import {Button} from 'antd';
import {Modal} from '../../../index';

export default class Base extends Component {
    state = {
        visible: false,
    };

    handleClick = () => {
        this.setState({visible: true});
    };

    handleBeforeOpen = () => {
        console.log('打开了');
    };

    handleAfterClose = () => {
        console.log('关闭了');
    };

    render() {
        const {visible} = this.state;

        return (
            <div>
                <Button onClick={this.handleClick}>显示弹框</Button>
                <Modal
                    visible={visible}
                    title="标题"
                    onCancel={() => this.setState({visible: false})}
                    onOk={() => this.setState({visible: false})}
                    beforeOpen={this.handleBeforeOpen}
                    afterClose={this.handleAfterClose}
                >
                    我这里是弹框内容
                </Modal>
            </div>
        )
    }
}

export const title = '基础用法';

export const markdown = `
beforeOpen 每次打开都会被调用
`;

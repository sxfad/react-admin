import React, {Component} from 'react';
import {Button} from 'antd';
import EditModal from './Edit';
import config from '@/commons/config-hoc';

@config({
    path: '/test-modal'
})
export default class index extends Component {
    state = {
        visible: false,
        idForEdit: 0,
    };

    componentDidMount() {

    }

    count = 0;

    handleModify = () => {
        this.setState({visible: true, idForEdit: ++this.count});
    };

    handleAdd = () => {
        this.setState({visible: true, idForEdit: null});
    };

    render() {
        const {
            visible,
            idForEdit,
        } = this.state;

        return (
            <div>
                <Button onClick={this.handleAdd}>添加</Button>
                <Button onClick={this.handleModify}>修改</Button>

                <EditModal
                    visible={visible}
                    idForEdit={idForEdit}
                    onOk={() => this.setState({visible: false})}
                    onCancel={() => this.setState({visible: false})}
                />
            </div>
        );
    }
}

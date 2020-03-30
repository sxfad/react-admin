import React, {Component, Fragment} from 'react';
import {Icon} from 'src/library/components';
import {CloseCircleOutlined} from '@ant-design/icons';
import IconModal from './IconModal';

export default class IconPicker extends Component {
    state = {
        visible: false,
        type: 'user',
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const {value} = nextProps;
        return {type: value};
    }

    handleOk = (type) => {
        const {onChange} = this.props;
        if (onChange) onChange(type);

        this.setState({visible: false});
    };

    handleClear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const {onChange} = this.props;
        if (onChange) onChange();
    };

    render() {
        const {
            type,
            visible,
        } = this.state;

        return (
            <Fragment>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: 28,
                        padding: '0 10px',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                        cursor: 'pointer',
                    }}
                    onClick={() => this.setState({visible: true})}
                >
                    {type ? (
                        <Fragment>
                            <Icon type={type}/>
                            <CloseCircleOutlined onClick={this.handleClear}/>
                        </Fragment>
                    ) : (
                        <span style={{color: '#c7c7c7'}}>请选择图标</span>
                    )}
                </div>
                <IconModal
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({visible: false})}
                />
            </Fragment>
        );
    }
}

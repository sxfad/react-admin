import React from 'react';
import PropTypes from 'prop-types';
import { EditOutlined } from '@ant-design/icons';
import TreeModal from './TreeModal';

export default class TreeEditor extends React.Component {
    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
        options: TreeEditor.prototype.array,
        onAdd: PropTypes.func, // 点击添加节点按钮
        onDelete: PropTypes.func, // 点击删除节点按钮
        onSave: PropTypes.func, // 保存节点事件
    };

    static defaultProps = {
        options: [],
    };

    state = {
        visible: true,
    };

    render() {
        const { style, value, options, onChange, onAdd, onDelete, onSave } = this.props;
        const { visible } = this.state;
        const stl = {
            height: 28,
            border: '1px solid #e8e8e8',
            width: 200,
        };
        let title = '';
        if (value && Array.isArray(value) && value.length) {
            title = options.filter(item => value.includes(item.key))
                .map(item => item.title)
                .join(',');
        }
        return (
            <div style={{ ...stl, ...style }} title={title}>
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8, width: '100%', height: '100%' }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
                    <EditOutlined
                        style={{ flex: 0, padding: '0 8px', cursor: 'pointer' }}
                        onClick={() => this.setState({ visible: true })}
                    />
                </div>
                <TreeModal
                    visible={visible}
                    onOk={value => {
                        onChange(value);
                        this.setState({ visible: false });
                    }}
                    onCancel={() => this.setState({ visible: false })}
                    checkedKeys={value}
                    options={options}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    onSave={onSave}
                />
            </div>
        );
    }
}

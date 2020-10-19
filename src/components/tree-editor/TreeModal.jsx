import React from 'react';
import { Input, Tree, Empty, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import { ModalContent } from 'src/library/components';
import PropTypes from 'prop-types';
import './style.less';

const { TreeNode } = Tree;

@config({
    modal: {
        title: '标签',
        width: 500,
    },
})
export default class TreeModal extends React.Component {
    static propTypes = {
        checkedKeys: PropTypes.array, // 用户选中的节点
        options: PropTypes.array, // 树节点数据
        onOk: PropTypes.func, // 点击确定按钮
        onCancel: PropTypes.func, // 点击取消按钮
        onAdd: PropTypes.func, // 点击添加节点按钮
        onDelete: PropTypes.func, // 点击删除节点按钮
        onSave: PropTypes.func, // 保存节点事件
    };

    static defaultProps = {
        options: [],
        checkedKeys: [],
    };

    state = {
        expandAll: false,
        expandedKeys: [],
        checkedKeysStr: '',
        editKey: null,
        editValue: '',
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const { checkedKeys = [], options } = nextProps;
        const checkedKeysStr = checkedKeys.join(',');

        let nextState = null;

        if (checkedKeysStr !== prevState.checkedKeysStr) {
            nextState = {};

            nextState.checkedKeys = checkedKeys;
            nextState.expandedKeys = checkedKeys;
            nextState.checkedKeysStr = checkedKeysStr;
        }
        if (options?.length) {
            const expandedKeys = nextState?.expandedKeys || [];
            options.forEach(item => {
                const { isNew, parentKey } = item;
                if (isNew && !prevState.expandedKeys.includes(parentKey)) {
                    expandedKeys.push(parentKey);
                }
            });

            if (!nextState) nextState = {};
            nextState.expandedKeys = [ ...expandedKeys, ...prevState.expandedKeys ];
        }

        return nextState;
    }

    handleOk = () => {
        const { onOk } = this.props;
        const { checkedKeys } = this.state;
        onOk && onOk(checkedKeys);
    };

    handleBlur = () => {
        setTimeout(() => {
            this.setState({ editKey: null, editValue: '' });
        }, 100);
    };

    handleSave = () => {
        const { editKey, editValue } = this.state;
        const { onSave } = this.props;
        console.log(editKey, editValue);
        onSave && onSave(editKey, editValue);
    };

    handleDelete = (key) => {
        const { onDelete } = this.props;
        onDelete && onDelete(key);
    };

    handleAdd = (key) => {
        const { onAdd } = this.props;
        onAdd && onAdd(key);
    };

    handleExpandAll = () => {
        const { options } = this.props;
        const { expandAll } = this.state;
        const nextExpandAll = !expandAll;
        const expandedKeys = nextExpandAll ? options.map(item => item.key) : [];

        this.setState({ expandAll: nextExpandAll, expandedKeys });
    };

    renderTreeNodes = () => {
        const { options } = this.props;
        const { editKey } = this.state;

        if (!options?.length) return null;

        const loop = nodes => {
            return nodes.map(node => {
                const {
                    key,
                    title,
                } = node;
                const children = options.filter(item => item.parentKey === key);
                const isEdit = editKey === key;

                let nodeTitle = isEdit ? (
                    <Input
                        id={`input_${key}`}
                        defaultValue={title}
                        autoFocus
                        onBlur={this.handleBlur}
                        onChange={e => this.setState({ editValue: e.target.value })}
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    />
                ) : title;

                nodeTitle = (
                    <div styleName="tree-node-title">
                        <div styleName="title">
                            {nodeTitle}
                        </div>
                        <div styleName="icons" onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}>
                            {isEdit ? (
                                <SaveOutlined
                                    style={{ color: 'green' }}
                                    onClick={() => this.handleSave()}
                                />
                            ) : (
                                <>
                                    <EditOutlined
                                        style={{ color: '#f1882a' }}
                                        onClick={() => this.setState({ editKey: key, editValue: title })}
                                    />
                                    <Popconfirm
                                        title={`您确定删除标签「${title}」吗`}
                                        onConfirm={() => this.handleDelete(key)}
                                    >
                                        <DeleteOutlined
                                            style={{ color: 'red' }}
                                        />
                                    </Popconfirm>
                                    <PlusOutlined
                                        style={{ color: 'green' }}
                                        onClick={() => this.handleAdd(key)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                );

                if (children?.length) {
                    return (
                        <TreeNode
                            key={key}
                            title={nodeTitle}
                        >
                            {loop(children)}
                        </TreeNode>
                    );
                }

                return (
                    <TreeNode key={key} title={nodeTitle}/>
                );
            });
        };

        return loop(options.filter(item => !item.parentKey));
    };

    render() {
        const { onCancel, options } = this.props;
        const { expandedKeys, checkedKeys, expandAll } = this.state;

        return (
            <ModalContent
                surplusSpace
                onOk={this.handleOk}
                onCancel={onCancel}
            >
                {options?.length ? (
                    <div styleName="box">
                        <div styleName="top">
                            <Button
                                styleName="expand-all"
                                size="small"
                                type="primary"
                                onClick={() => this.handleExpandAll()}
                            >
                                {expandAll ? '全部收起' : '全部展开'}
                            </Button>
                        </div>
                        <div styleName="content">
                            <Tree
                                selectable={false}
                                defaultExpandAll
                                expandedKeys={expandedKeys}
                                onExpand={expandedKeys => this.setState({ expandedKeys })}

                                checkStrictly
                                checkable
                                checkedKeys={checkedKeys}
                                onCheck={info => {
                                    const { checked: checkedKeys } = info;
                                    this.setState({ checkedKeys });
                                }}
                            >
                                {this.renderTreeNodes()}
                            </Tree>
                        </div>
                    </div>
                ) : (
                    <div styleName="empty">
                        <Empty
                            description="暂无任何标签"
                        >
                            <Button
                                type="primary"
                                onClick={() => this.handleAdd()}
                            >
                                <PlusOutlined/> 创建标签
                            </Button>
                        </Empty>
                    </div>
                )}
            </ModalContent>
        );
    }
}


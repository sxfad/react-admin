import React, {Component} from 'react';
import {Button} from 'antd';
import config from 'src/commons/config-hoc';
import {
    Table,
    tableEditable,
    tableRowDraggable,
    Operator,
    ModalContent,
} from '@ra-lib/admin';
import styles from './style.less';

const EditTable = tableEditable(tableRowDraggable(Table));

@config({
    modal: '选项编辑',
})
export default class EditorModal extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        deleting: false,    // 删除中loading
        fastEdit: false,   // test area 快速编辑
    };

    columns = [
        {
            title: '选项名', dataIndex: 'label',
            formProps: (record, index) => {
                const tabIndex = index + 1; // index * 2 + 1
                return {
                    required: true,
                    tabIndex,
                    onFocus: this.handleFocus,
                    onBlur: (e) => {
                        record.label = e.target.value;
                        this.handleChange();
                    },
                    onKeyDown: (e) => this.handleKeyDown(e, tabIndex),
                };
            },
        },
        {
            title: '选项值', dataIndex: 'value',
            formProps: (record, index) => {
                const {value: dataSource} = this.props;
                const length = dataSource?.length || 0;

                const tabIndex = index + length + 1; // index * 2 + 2;
                return {
                    required: true,
                    tabIndex,
                    onFocus: this.handleFocus,
                    onBlur: (e) => {
                        record.value = e.target.value;
                        this.handleChange();
                    },
                    onKeyDown: (e) => this.handleKeyDown(e, tabIndex),
                };
            },
        },
        {
            title: '禁用', dataIndex: 'disabled',
            formProps: (record) => {
                return {
                    type: 'switch',
                    onChange: (value) => {
                        record.disabled = value;
                        this.handleChange();
                    },
                };
            },
        },
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (_, record) => {
                const {value, label} = record;
                const items = [
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${label || value}"?`,
                            onConfirm: () => this.handleDelete(value),
                        },
                    },
                ];

                return <Operator items={items}/>;
            },
        },
    ];

    componentDidMount() {
    }

    handleFocus = (e) => {
        e.target.select();
    };

    handleChange = (val) => {
        const {onChange, value} = this.props;
        if (!val) val = value;

        onChange && onChange([...val]);
    };

    handleKeyDown = (e, tabIndex) => {
        const {keyCode, ctrlKey, shiftKey, altKey, metaKey} = e;

        if (ctrlKey || shiftKey || altKey || metaKey) return;

        const {value: dataSource} = this.props;
        const length = dataSource?.length || 0;

        const isUp = keyCode === 38;
        const isRight = keyCode === 39;
        const isDown = keyCode === 40;
        const isLeft = keyCode === 37;
        const isEnter = keyCode === 13;

        let nextTabIndex;

        if (isDown || isEnter) {
            if (tabIndex === length || tabIndex === length * 2) {
                nextTabIndex = undefined;
            } else {
                nextTabIndex = tabIndex + 1;
            }
        }

        if (isUp) nextTabIndex = tabIndex - 1;

        if (isLeft) {
            if (tabIndex <= length) {
                nextTabIndex = tabIndex - 1 <= 0 ? undefined : tabIndex - 1 + length;
            } else {
                nextTabIndex = tabIndex - length;
            }
        }

        if (isRight) {
            if (tabIndex <= length) {
                nextTabIndex = tabIndex + length;
            } else {
                nextTabIndex = tabIndex - length === length ? undefined : tabIndex - length + 1;
            }
        }

        const nextInput = document.querySelector(`input[tabindex='${nextTabIndex}']`);

        if (nextInput) {
            // 确保方向键也可以选中
            setTimeout(() => {
                nextInput.focus();
                nextInput.select();
            });
        } else if (isEnter || isDown || isRight) {
            // 新增一行
            this.handleAdd(true);

            // 等待新增行渲染完成，新增行 input 获取焦点
            setTimeout(() => {
                let ti = tabIndex;

                if (isRight) ti = tabIndex - length;

                if ((isDown || isEnter) && tabIndex === length * 2) ti = tabIndex + 1;

                this.handleKeyDown({keyCode: 13}, ti);
            });
        }
    };

    handleDelete = (value) => {
        let {value: dataSource} = this.props;
        dataSource = dataSource.filter(item => item.value !== value);
        this.handleChange(dataSource);
    };

    handleAdd = (append) => {
        const {value: dataSource, withLabel} = this.props;
        const length = dataSource.length;

        const value = `value${length + 1}`;

        const newRecord = withLabel ? {
            value,
            label: '新增项',
        } : {value};

        append ? dataSource.push(newRecord) : dataSource.unshift(newRecord);
        this.handleChange(dataSource);
    };

    handleSortEnd = ({newIndex, oldIndex}) => {
        let {value: dataSource} = this.props;

        dataSource.splice(newIndex, 0, ...dataSource.splice(oldIndex, 1));
        this.handleChange(dataSource);
    };

    render() {
        const {
            loading,
            deleting,
            fastEdit,
        } = this.state;
        const {
            value: dataSource,
            visible,
            onCancel,
            withLabel,
        } = this.props;

        if (!withLabel) {
            this.columns = this.columns.filter(item => item.dataIndex !== 'label');
        }

        return (
            <ModalContent
                loading={loading || deleting}
                visible={visible}
                onCancel={onCancel}
                footer={<Button onClick={onCancel}>关闭</Button>}
                bodyStyle={{padding: 0}}
            >
                <div style={{margin: 8, display: 'flex', justifyContent: 'space-between'}}>
                    <Button disabled={fastEdit} type="primary" onClick={() => this.handleAdd()}>添加</Button>
                </div>
                <EditTable
                    surplusSpace
                    offsetHeight={100}
                    onSortEnd={this.handleSortEnd}
                    serialNumber
                    columns={this.columns}
                    dataSource={dataSource}
                    helperClass={styles.trDragPreview}
                    rowKey="value"
                />
            </ModalContent>
        );
    }
}

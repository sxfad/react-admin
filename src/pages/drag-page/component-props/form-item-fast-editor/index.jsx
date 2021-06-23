import React, {useState, useRef} from 'react';
import {Button, Modal, Input, Alert} from 'antd';
import {useHeight} from 'ra-lib';
import {v4 as uuid} from 'uuid';
import {findNodesByName} from 'src/pages/drag-page/node-util';
import './style.less';

// 表格快速编辑
export default function FormItemFastEditor(props) {
    const {node, onChange} = props;
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const editRef = useRef(null);
    const [height] = useHeight(editRef, 130);

    function handleClick(e) {
        const itemNodes = findNodesByName(node, 'Form.Item') || [];
        const values = itemNodes.map(item => {
            const {label} = item?.props || {};
            if (label && item?.children?.length === 1) {
                const eleName = item.children[0].componentName;
                return `${label} ${eleName}`;
            }
            return null;
        }).filter(item => !!item);

        setValue(values.join('\n'));
        setVisible(true);
    }

    function handleChange(e) {
        const {value} = e.target;
        setValue(value);
    }

    function handleOk() {
        if (!value) return;
        let values = value.split('\n')
            .map(val => {
                // 多个空格替换成一个
                let v = val.replace(/\s+/g, ' ');
                // 去除前后空格
                v = v.trim();

                return v;
            })
            .filter(val => !!val);

        if (values?.length === 1) {
            values = values[0].split(' ');
        }

        // 有可能是提交按钮
        const otherItems = node.children.filter(item => {
            return item.componentName === 'Form.Item' && !item.props?.label;
        });

        const newItems = values
            .map((v, index) => {
                let [label, elementName = 'Input'] = v.split(' ');
                return {
                    id: uuid(),
                    componentName: 'Form.Item',
                    props: {
                        label,
                        name: 'field' + index,
                    },
                    children: [
                        {
                            id: uuid(),
                            componentName: elementName,
                            props: {
                                placeholder: '请输入',
                            },
                        },
                    ],
                };
            });

        node.children = [
            ...newItems,
            ...otherItems,
        ];
        onChange(Date.now());
        setVisible(false);
    }

    return (
        <div ref={editRef}>
            <Button block onClick={handleClick}>点击编辑</Button>
            <Modal
                title="快速编辑列"
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleOk}
                maskClosable={false}
            >
                <Alert message="说明 表单类型可省略，默认Input" showIcon description={
                    <div>
                        <div>标签名 表单类型</div>
                        <div>标签名 表单类型</div>
                    </div>
                }/>
                <Input.TextArea
                    style={{height, marginTop: 16}}
                    value={value}
                    onChange={handleChange}
                    rows={10}
                />
            </Modal>
        </div>
    );
}

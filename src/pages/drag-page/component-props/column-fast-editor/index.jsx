import React, {useState, useRef} from 'react';
import {Button, Modal, Input, Alert} from 'antd';
import {useHeight} from 'ra-lib';
import {v4 as uuid} from 'uuid';
import './style.less';

// 表格快速编辑
export default function ColumnFastEditor(props) {
    const {node, onChange} = props;
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const editRef = useRef(null);
    const [height] = useHeight(editRef, 170);

    function handleClick(e) {
        const columns = node?.props?.columns || [];
        const iframeDocument = document.getElementById('dnd-iframe').contentDocument;
        const titles = columns.map(item => {
            const {title, className} = item;
            const contents = Array.from(iframeDocument.querySelector('td.' + className)
                .querySelectorAll('a'))
                .map(ele => ele.innerText);
            return `${title} ${contents.join(' ')}`;
        });

        setValue(titles.join('\n'));
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

        node.children = values
            .map((v, index) => {
                let [title, ...content] = v.split(' ');
                let render;
                if (!content?.length) {
                    render = {
                        id: uuid(),
                        componentName: 'Text',
                        props: {
                            text: title,
                        },
                    };
                } else {
                    render = {
                        id: uuid(),
                        componentName: 'div',
                        children: content.map((text, index) => {
                            const result = [
                                {
                                    id: uuid(),
                                    componentName: 'a',
                                    children: [
                                        {
                                            id: uuid(),
                                            componentName: 'Text',
                                            props: {
                                                text,
                                            },
                                        },
                                    ],
                                },
                            ];
                            if (index !== content.length - 1) {
                                result.push({
                                    id: uuid(),
                                    componentName: 'Divider',
                                    props: {
                                        type: 'vertical',
                                    },
                                });
                            }
                            return result;
                        }).flat(),
                    };
                }


                return {
                    componentName: 'Table.Column',
                    id: uuid(),
                    props: {
                        title,
                        dataIndex: 'field' + index,
                        render,
                    },
                };
            });
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
                <Alert message="说明 渲染内容可省略，默认标题" showIcon description={
                    <div style={{display: 'flex'}}>
                        <div>
                            <h4>多行</h4>
                            <div>标题 渲染内容1 渲染内容2 ...</div>
                            <div>标题 渲染内容1 渲染内容2 ...</div>
                        </div>

                        <div style={{marginLeft: 32}}>
                            <h4>单行</h4>
                            <div>标题1 标题2 标题3 ...</div>
                        </div>
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
};

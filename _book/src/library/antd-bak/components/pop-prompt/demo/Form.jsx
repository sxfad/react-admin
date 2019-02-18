import React, {Component} from 'react';
import {PopPrompt} from '../../../index';

export default class Base extends Component {
    state = {
        visible: false,
    };

    render() {
        return (
            <div style={{paddingLeft: 300}}>
                <PopPrompt
                    visible={this.state.visible}
                    onConfirm={(values) => {
                        console.log(values);
                        this.setState({visible: false});
                    }}
                    onCancel={() => this.setState({visible: false})}
                    items={[
                        {
                            label: '姓名', field: 'name', type: 'input',
                            decorator: {
                                rules: [
                                    {required: true, message: '请输入姓名'},
                                ],
                            },
                        },
                        {label: '年龄', field: 'age', type: 'number'},
                        {label: '生日', field: 'birthday', type: 'date'},
                    ]}
                >
                    <a onClick={() => this.setState({visible: true})}>demo</a>
                </PopPrompt>
            </div>
        );
    }
}

export const title = '自定义表单';

export const markdown = `
带有日期这种弹框组件时，需要通过visible控制PopPrompt显示隐藏，否则，点击选择日期时，PopPrompt会隐藏。
`;

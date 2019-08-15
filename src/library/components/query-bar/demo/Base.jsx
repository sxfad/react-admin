import React, {Component} from 'react';
import {Row, Col, Form} from 'antd';
import {QueryBar, FormElement} from '../../../index';

@Form.create()
export default class Base extends Component {
    state = {
        collapsed: true
    };

    handleCollapsedChange = (collapsed) => this.setState({collapsed});

    render() {
        const {form} = this.props;
        const {collapsed} = this.state;
        const labelWidth = 80;
        return (
            <div>
                <QueryBar
                    showCollapsed
                    collapsed={collapsed}
                    onCollapsedChange={this.handleCollapsedChange}
                >
                    <Row>
                        <Col span={8}>
                            <FormElement
                                form={form}
                                type="input"
                                field="userName"
                                label="用户名"
                                labelWidth={labelWidth}
                            />
                        </Col>
                        <Col span={8}>
                            <FormElement
                                form={form}
                                type="input"
                                field="loginName"
                                label="登录名"
                                labelWidth={labelWidth}
                            />
                        </Col>
                        <Col span={8}>
                            <FormElement
                                form={form}
                                type="input"
                                field="job"
                                label="工作"
                                labelWidth={labelWidth}
                            />
                        </Col>
                    </Row>
                    <Row style={{display: collapsed ? 'none' : 'block'}}>
                        <Col span={8}>
                            <FormElement
                                form={form}
                                type="input"
                                field="age"
                                label="年龄"
                                labelWidth={labelWidth}
                            />
                        </Col>
                        <Col span={8}>
                            <FormElement
                                form={form}
                                type="input"
                                field="position"
                                label="职位"
                                labelWidth={labelWidth}
                            />
                        </Col>
                        <Col span={8}>
                            <FormElement
                                form={form}
                                type="input"
                                field="enjoy"
                                label="爱好"
                                labelWidth={labelWidth}
                            />
                        </Col>
                    </Row>
                </QueryBar>
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
基础用法
`;

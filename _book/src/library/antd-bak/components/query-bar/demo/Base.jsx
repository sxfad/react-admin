import React, {Component} from 'react';
import {Input, Row, Col} from 'antd';
import {QueryBar, FormItemLayout} from '../../../index';

export default class Base extends Component {
    state = {
        collapsed: true
    };

    handleCollapsedChange = (collapsed) => this.setState({collapsed});

    render() {
        const {collapsed} = this.state;
        return (
            <div>
                <QueryBar
                    showCollapsed
                    collapsed={collapsed}
                    onCollapsedChange={this.handleCollapsedChange}
                >
                    <Row>
                        <Col span={8}>
                            <FormItemLayout label="用户名">
                                <Input/>
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout label="登录名">
                                <Input/>
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout label="工作">
                                <Input/>
                            </FormItemLayout>
                        </Col>
                    </Row>
                    <Row style={{display: collapsed ? 'none' : 'block'}}>
                        <Col span={8}>
                            <FormItemLayout label="年龄">
                                <Input/>
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout label="职位">
                                <Input/>
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout label="爱好">
                                <Input/>
                            </FormItemLayout>
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

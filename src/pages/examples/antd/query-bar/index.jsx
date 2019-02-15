import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Base from '@/library/antd/components/query-bar/demo/Base';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Base.default,
        title: Base.title,
        markdown: Base.markdown,
        code: `
import React, {Component} from 'react';
import {Row, Col, Form} from 'antd';
import {QueryBar, FormElement} from '../sx-antd';

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


        `,
    },
];
const readme = `# 查询条

有展开收起功能，ant-form-item添加了\`margin-bottom: 16px;\`样式

## 何时使用
可以作为列表页，查询条件的容器，查询条件较多时，可以使用展开收起功能

`;
const api = `## API


参数|说明|类型|默认值
---|---|---|---
showCollapsed | 是否显示展开/收起按钮 | bool | false
collapsed | 展开/收起 状态 | bool | true
onCollapsedChange | 展开/收起 改变时触发 | function(collapsed) {} | -`;

@config({
    path: '/example/antd/query-bar',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};

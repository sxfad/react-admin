import React, {Component} from 'react';
import {Form, Button} from 'antd';
import config from '@/commons/config-hoc';
import {FormElement} from "@/library/antd";
import PageContent from '@/layouts/page-content';

@config({
    path: '/users/_/UserEdit/:id',
    keepAlive: true,
    query: true,
    ajax: true,
    title: (props) => {
        const {query, match: {params}} = props;
        if (params.id && params.id !== ':id') {
            return {text: `用户编辑-${query.name}`, icon: 'edit'};
        }

        return {text: '添加用户', icon: 'user-add'};

    },
    breadcrumbs: (props) => {
        const {query, match: {params}} = props;
        const breadcrumbs = [
            {key: 'home', local: 'home', text: '首页', icon: 'home', path: '/'},
            {key: 'users', local: 'users', text: '用户列表', icon: 'user', path: '/users'},
        ];

        if (params.id && params.id !== ':id') {
            return breadcrumbs.concat([
                {key: 0, local: 'userEdit', icon: 'edit', text: '编辑用户'},
                {key: 2, text: query.name},
            ]);
        }

        return breadcrumbs.concat([
            {key: 'userAdd', local: 'userAdd', icon: 'user-add', text: '添加用户'},
        ]);
    },
})
@Form.create()
export default class UserEdit extends Component {
    constructor(...props) {
        super(...props);

        this.props.onComponentWillShow(() => {
            console.log('UserEdit onComponentShow');
        });
        this.props.onComponentWillHide(() => {
            console.log('UserEdit onComponentWillHide');
        });
    }

    state = {
        loading: false,
        data: {},
    };

    componentDidMount() {
        console.log('UserEdit.js componentDidMount');
        this.fetchData();
    }

    fetchData = () => {
        const {match: {params: {id}}, query: {name}} = this.props;

        if (id && id !== ':id') {
            // 修改

            // TODO 根据id获取用户

            this.setState({loading: true});
            setTimeout(() => {
                this.setState({data: {id, name, age: 23}});

                this.setState({loading: false});
            }, 500);
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {id} = values;
                const ajax = id ? this.props.ajax.put : this.props.ajax.post;

                this.setState({loading: true});
                ajax('/users', values)
                    .then(() => {

                    })
                    .finally(() => this.setState({loading: false}))
            }
        });
    };

    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
    };

    render() {
        console.log('render UserEdit.jsx');
        const {
            query,
            form,
        } = this.props;

        const {loading, data} = this.state;

        const labelWidth = 100;

        return (
            <PageContent loading={loading} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h2>{data.id ? `编辑用户-${query.name}` : '添加用户'}</h2>
                <Form style={{width: 300}} onSubmit={this.handleSubmit}>
                    {data.id ? <FormElement form={form} type="hidden" field="id" decorator={{initialValue: data.id}}/> : null}
                    <FormElement
                        form={form}
                        label="姓名"
                        labelWidth={labelWidth}
                        placeholder="请输入姓名"
                        type="input"
                        field="name"
                        decorator={{
                            initialValue: data.name,
                            rules: [
                                {required: true, message: '请输入姓名！'},
                            ],
                        }}
                    />
                    <FormElement
                        form={form}
                        label="年龄"
                        type="input"
                        field="number"
                        min={0}
                        step={1}
                        labelWidth={labelWidth}
                        placeholder="请输入年龄"
                        decorator={{
                            initialValue: data.age,
                            rules: [
                                {required: true, message: '请输入年龄！'},
                            ],
                        }}
                    />
                    <div style={{paddingLeft: labelWidth}}>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                    </div>
                </Form>
            </PageContent>
        );
    }
}


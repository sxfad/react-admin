import React, {Component} from 'react';
import {Table} from 'antd';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import './style.less';
import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';


let BodyRow = SortableElement((props) => {
    return props.children;
});


let Container = SortableContainer(props => {
    const {
        children,
        ...others
    } = props;

    return (
        <tbody {...others}>{children.map((item, index) => {
            const {key} = item;

            return (
                <BodyRow
                    key={key}
                    index={index}
                >
                    {item}
                </BodyRow>
            );
        })}</tbody>
    );
});


@config({
    path: '/about',
    title: '我特么是自定义title',
    // noAuth: true,
    // noFrame: true,
    ajax: true,
    query: true,
    event: true,
    connect: (state) => {
        return {
            loading: state.system.loading,
        };
    },
})
export default class Home extends Component {
    constructor(...props) {
        super(...props);
        const {components} = this.props;


        let BodyWrapper = (props) => {
            const injectProps = {
                onSortEnd: this.onSortEnd,
                onSortStart: this.onSortStart,
                helperContainer: () => document.querySelector('table'),
            };
            return <Container {...injectProps} {...props}/>
        };

        this.components = {
            body: {
                wrapper: BodyWrapper,
            },
        };

        if (components && components.body) {
            this.components.body = {
                ...components.body,
                cell: BodyRow,
            };
        }

        if (components) {
            this.components = {...components, ...this.components};
        }

    }

    onSortEnd = (...args) => {
        console.log(args);
    };

    onSortStart = (...args) => {
        console.log(args);
    };

    state = {
        dataSource: [
            {id: '11', name: '1', age: 12},
            {id: '22', name: '2', age: 12},
            {id: '33', name: '3', age: 12},
            {id: '44', name: '4', age: 12},
            {id: '55', name: '5', age: 12},
            {id: '66', name: '6', age: 12},
            {id: '77', name: '7', age: 12},
            {id: '88', name: '8', age: 12},
            {id: '99', name: '9', age: 12},
            {id: '10', name: '10', age: 12},
            {id: '111', name: '11', age: 12},
            {id: '112', name: '12', age: 12},
        ],
    };

    render() {
        console.log('about render');
        const {dataSource} = this.state;
        return (
            <PageContent styleName="root">
                <Table
                    components={this.components}
                    columns={[
                        {title: '姓名', dataIndex: 'name', key: 'name'},
                        {title: '年龄', dataIndex: 'age', key: 'age'},
                    ]}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey="id"
                />
            </PageContent>
        );
    }
}

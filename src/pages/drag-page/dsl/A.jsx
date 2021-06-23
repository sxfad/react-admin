import React, {useState} from 'react';
import config from 'src/commons/config-hoc';
import {PageContent, QueryBar, ToolBar} from 'ra-lib';
import {
    Form,
    Input,
    InputNumber,
    Button,
    Table,
    Divider,
    Popconfirm,
} from 'antd';

const Item = Form.Item;

export default config({
    path: '/route2',
})(function Index(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState();

    return (
        <PageContent>
            <QueryBar>
                <Form
                    layout="inline"
                    name="formName_68bfd9cd-18ec-4dd2-baf2-ebc99b897b31"
                    onFinish={(values) => alert(JSON.stringify(values))}
                >
                    <Item label="身份证编号" name="name" labelCol={{flex: '110px'}}>
                        <Input placeholder="请输入姓名" style={{width: '208px'}}/>
                    </Item>
                    <Item shouldUpdate noStyle>
                        {({getFieldValue}) => {
                            const name = getFieldValue('name');
                            if (name === '123') {
                                return (
                                    <div>
                                        姓名「${name}」
                                    </div>
                                );
                            }
                            return null;
                        }}
                    </Item>
                    <Item label="身份证名称" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '208px'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="Mcc" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '208px'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="地域码" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '208px'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="身份状态" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="停用原因" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="创建日期" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="更新时间" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="身份省" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="身份市" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="黑名单银行" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="关联身份" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="前置身份" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="支持的交易类型" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="身份类型" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="支持金额段" name="age" labelCol={{flex: '110px'}}>
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                </Form>
            </QueryBar>
            <ToolBar>
                <Button type="primary">查询</Button>
                <Button>重置</Button>
                <Button>批量导出</Button>
                <Button type="primary">批量导入</Button>
                <Button>批量启用</Button>
                <Button type="primary" danger={true}>
                    批量停用
                </Button>
                <Button type="primary" danger={true}>
                    批量删除
                </Button>
            </ToolBar>
            <Table
                pagination={false}
                dataSource={[
                    {name: '张三', age: 25, operator: '修改'},
                    {name: '李四', age: 26, operator: '修改'},
                ]}
                columns={[
                    {title: '身份编号', dataIndex: 'name'},
                    {title: '身份名称', dataIndex: 'age'},
                    {title: '地域码', dataIndex: 'age'},
                    {title: 'MCC', dataIndex: 'age'},
                    {title: '身份状态', dataIndex: 'age'},
                    {title: '停用原因', dataIndex: 'age'},
                    {title: '停用原因补充', dataIndex: 'age'},
                    {title: '创建时间', dataIndex: 'age'},
                    {title: '更新时间', dataIndex: 'age'},
                    {title: '更新人', dataIndex: 'age'},
                    {
                        title: '操作',
                        dataIndex: 'operator',
                        render: () => (
                            <div>
                                <a>查看</a>
                                <Divider type="vertical"/>
                                <a>修改</a>
                                <Divider type="vertical"/>
                                <a>启用</a>
                                <Divider type="vertical"/>
                                <Popconfirm title="您确定删除吗？">
                                    <a style={{color: 'red'}}>停用</a>
                                </Popconfirm>
                            </div>
                        ),
                    },
                ]}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
                }}
            />
        </PageContent>
    );
});

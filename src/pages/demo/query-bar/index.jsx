import {Form, Button, Space} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent, QueryBar, FormItem} from '@ra-lib/components';

export default config({
    path: '/demo/query-bar',
})(function TestQueryBar(props) {
    const formLayout = {
        wrapperCol: {style: {width: 200}},
    };
    return (
        <PageContent>
            <QueryBar>
                <Form layout="inline" name="form1">
                    <FormItem
                        {...formLayout}
                        label="用户名"
                        name="name"
                    />
                    <FormItem
                        {...formLayout}
                        type="number"
                        label="年龄"
                        name="age"
                    />
                    <FormItem
                        {...formLayout}
                        type="select"
                        label="工作"
                        name="job"
                        options={[{value: '11', label: '前端'}]}
                    />

                    <FormItem
                        {...formLayout}
                        label="地址"
                        name="address"
                    />
                    <FormItem>
                        <Space>
                            <Button type="primary">查询</Button>
                            <Button>重置</Button>
                            <Button danger>删除</Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <QueryBar>
                {collapsed => (
                    <Form layout="inline" name="form2">
                        <FormItem
                            {...formLayout}
                            label="用户名"
                            name="name"
                        />
                        <FormItem
                            {...formLayout}
                            type="number"
                            label="年龄"
                            name="age"
                        />
                        <FormItem
                            {...formLayout}
                            hidden={collapsed}
                            type="select"
                            label="工作"
                            name="job"
                            options={[{value: '11', label: '前端'}]}
                        />

                        <FormItem
                            {...formLayout}
                            hidden={collapsed}
                            label="地址"
                            name="address"
                        />
                        <FormItem>
                            <Space>
                                <Button type="primary">查询</Button>
                                <Button>重置</Button>
                                <Button danger>删除</Button>
                            </Space>
                        </FormItem>
                    </Form>
                )}
            </QueryBar>
        </PageContent>
    );
});

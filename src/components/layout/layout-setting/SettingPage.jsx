import { useState } from 'react';
import { Form, Row, Col, Alert } from 'antd';
import json5 from 'json5';
import { FormItem, LAYOUT_TYPE, PageContent, storage } from '@ra-lib/admin';
import { CONFIG_HOC_STORAGE_KEY, CONFIG_HOC } from 'src/config';
import { layoutRef } from 'src/components/layout';

const options = [
    { value: true, label: '是' },
    { value: false, label: '否' },
];

const themeOptions = [
    { value: 'default', label: '亮' },
    { value: 'dark', label: '暗' },
];

export default function LayoutSetting(props) {
    const [code, setCode] = useState('');

    function handleChange(changedValues, values) {
        storage.local.setItem(CONFIG_HOC_STORAGE_KEY, values);

        Object.entries(values).forEach(([key, value]) => (CONFIG_HOC[key] = value));

        layoutRef.current?.refresh && layoutRef.current.refresh();
        let code = json5.stringify(values, null, 4) || '';
        code = code.replace(`layoutType: 'side-menu'`, `layoutType: LAYOUT_TYPE.SIDE_MENU`);
        code = code.replace(`layoutType: 'top-menu'`, `layoutType: LAYOUT_TYPE.TOP_MENU`);
        code = code.replace(`layoutType: 'top-side-menu'`, `layoutType: LAYOUT_TYPE.TOP_SIDE_MENU`);
        setCode(code);

        // 延迟触发window 的 resize事件调整布局
        // setTimeout(() => window.dispatchEvent(new Event('resize')));
    }

    const layout = {
        labelCol: { flex: '100px' },
    };

    return (
        <PageContent fitHeight style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 0 }}>
                <Alert
                    style={{ marginBottom: 24 }}
                    type="warning"
                    message={
                        <div style={{ color: 'red' }}>
                            不推荐将设置开放给用户，选择好了之后，复制代码到项目配置文件 src/config/index.js 中
                        </div>
                    }
                />
                <Form initialValues={CONFIG_HOC} onValuesChange={handleChange}>
                    <FormItem
                        {...layout}
                        type="radio-button"
                        label="布局方式"
                        name="layoutType"
                        options={[
                            { value: LAYOUT_TYPE.SIDE_MENU, label: '左侧菜单' },
                            { value: LAYOUT_TYPE.TOP_MENU, label: '头部菜单' },
                            { value: LAYOUT_TYPE.TOP_SIDE_MENU, label: '头部 + 左侧菜单' },
                        ]}
                    />
                    <FormItem
                        {...layout}
                        type="radio-button"
                        label="Logo主题"
                        name="logoTheme"
                        options={themeOptions}
                    />
                    <Row>
                        <Col span={6}>
                            <FormItem {...layout} type="radio-button" label="左侧" name="side" options={options} />
                        </Col>
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const side = getFieldValue('side');
                                if (!side) return null;
                                return (
                                    <>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="菜单保持打开"
                                                name="keepMenuOpen"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="左侧主题"
                                                name="sideTheme"
                                                options={themeOptions}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="菜单搜索"
                                                name="searchMenu"
                                                options={options}
                                            />
                                        </Col>
                                    </>
                                );
                            }}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...layout} type="radio-button" label="头部" name="header" options={options} />
                        </Col>
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const header = getFieldValue('header');
                                if (!header) return null;
                                return (
                                    <>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="头部收起菜单"
                                                name="headerSideToggle"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="头部主题"
                                                name="headerTheme"
                                                options={themeOptions}
                                            />
                                        </Col>
                                    </>
                                );
                            }}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...layout} type="radio-button" label="Tab页" name="tab" options={options} />
                        </Col>
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const tab = getFieldValue('tab');
                                if (!tab) return null;
                                return (
                                    <>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Tab持久化"
                                                name="persistTab"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Tab收起菜单"
                                                name="tabSideToggle"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Tab额外头部"
                                                name="tabHeaderExtra"
                                                options={options}
                                            />
                                        </Col>
                                    </>
                                );
                            }}
                        </FormItem>
                    </Row>
                    <FormItem {...layout} type="radio-button" label="页面头部" name="pageHeader" options={options} />
                </Form>
            </div>
            <code
                style={{
                    flex: 1,
                    overflow: 'auto',
                    borderTop: '1px solid #e8e8e8',
                    padding: 16,
                    background: '#000',
                }}
            >
                <pre style={{ color: '#fff' }}>{code}</pre>
            </code>
        </PageContent>
    );
}

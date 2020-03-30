import React, {Component} from 'react';
import {Radio, Card, Checkbox} from 'antd';
import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';

@config({
    path: '/settings',
    title: {text: '设置', icon: 'setting'},
    breadcrumbs: [
        {
            key: '1',
            path: '/',
            text: '首页',
            icon: 'home',
        },
        {
            key: '2',
            path: '/settings',
            text: '设置',
            icon: 'setting',
        },
    ],
    connect(state) {
        const {pageFrameLayout, pageHeadFixed, pageHeadShow, tabsShow} = state.settings;
        const {keepOtherOpen} = state.menu;
        const {keepAlive} = state.system;
        return {
            pageFrameLayout,
            pageHeadFixed,
            pageHeadShow,
            keepOtherMenuOpen: keepOtherOpen,
            tabsShow,
            keepAlive,
        };
    },
})
export default class Settings extends Component {
    handlePageFrameLayoutChange = (e) => {
        const {value} = e.target;
        const {action} = this.props;
        if (value === 'top-menu') {
            action.side.initWidth();
            action.side.setCollapsed(false);
        }
        action.settings.setPageFrameLayout(value);
    };

    handlePageHeadFixedChange = (e) => {
        const {checked} = e.target;
        this.props.action.settings.setPageHeadFixed(checked);
    };

    handlePageHeadShowChange = (e) => {
        const {checked} = e.target;
        const {action} = this.props;
        action.settings.showPageHead(checked);
        checked ? action.page.showHead() : action.page.hideHead();
    };

    handleKeepOtherMenuOpenChange = (e) => {
        const {checked} = e.target;
        this.props.action.menu.setKeepOtherOpen(checked);
    };

    handleTabShowChange = (e) => {
        const {checked} = e.target;
        this.props.action.settings.showTabs(checked);
    };

    handleKeepPageChange = (e) => {
        const {checked} = e.target;
        this.props.action.system.setKeepPage(checked);
    };

    render() {
        const {
            pageFrameLayout,
            pageHeadFixed,
            pageHeadShow,
            keepOtherMenuOpen,
            tabsShow,
            keepAlive,
        } = this.props;

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };


        return (
            <PageContent style={{display: 'flex', paddingTop: 50, justifyContent: 'center'}}>
                <div style={{width: 500}}>
                    <Card title="设置" style={{marginBottom: 16}}>
                        <div style={{display: 'none'}}> {/*暂时先隐藏*/}
                            <Checkbox
                                onChange={this.handlePageHeadShowChange}
                                checked={pageHeadShow}
                            >显示头部</Checkbox>

                            {pageHeadShow ? (
                                <Checkbox
                                    onChange={this.handlePageHeadFixedChange}
                                    checked={pageHeadFixed}
                                >头部固定</Checkbox>
                            ) : null}
                        </div>

                        <div style={{marginTop: 8}}>
                            <Checkbox
                                onChange={this.handleKeepPageChange}
                                checked={keepAlive}
                            >
                                页面保持
                                <span style={{color: 'red'}}>(Beta)</span>
                            </Checkbox>
                        </div>

                        <div style={{marginTop: 8}}>
                            <Checkbox
                                onChange={this.handleTabShowChange}
                                checked={tabsShow}
                            >
                                显示Tab页
                            </Checkbox>
                        </div>
                    </Card>
                    <Card title="菜单设置">
                        <div style={{borderBottom: '1px solid #d9d9d9', paddingBottom: 8, marginBottom: 8}}>
                            <Checkbox
                                onChange={this.handleKeepOtherMenuOpenChange}
                                checked={keepOtherMenuOpen}
                            >保持菜单展开</Checkbox>
                        </div>
                        <div>
                            <Radio.Group onChange={this.handlePageFrameLayoutChange} value={pageFrameLayout}>
                                <Radio style={radioStyle} value="top-side-menu">头部左侧菜单</Radio>
                                <Radio style={radioStyle} value="top-menu">头部菜单</Radio>
                                <Radio style={radioStyle} value="side-menu">左侧菜单</Radio>
                            </Radio.Group>
                        </div>
                    </Card>
                </div>
            </PageContent>
        );
    }
}

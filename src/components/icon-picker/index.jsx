import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Icon, Row, Col, Button, Input} from 'antd';


const icons = [
    {
        title: '方向性图标',
        types: ["step-backward", "step-forward", "fast-backward", "fast-forward", "shrink", "arrows-alt", "down", "up", "left", "right", "caret-up", "caret-down", "caret-left", "caret-right", "up-circle", "down-circle", "left-circle", "right-circle", "double-right", "double-left", "vertical-left", "vertical-right", "forward", "backward", "rollback", "enter", "retweet", "swap", "swap-left", "swap-right", "arrow-up", "arrow-down", "arrow-left", "arrow-right", "play-circle", "up-square", "down-square", "left-square", "right-square", "login", "logout", "menu-fold", "menu-unfold", "border-bottom", "border-horizontal", "border-inner", "border-left", "border-right", "border-top", "border-verticle", "pic-center", "pic-left", "pic-right", "radius-bottomleft", "radius-bottomright", "radius-upleft", "fullscreen", "fullscreen-exit"],
    },
    {
        title: '提示建议性图标',
        types: ["question", "question-circle", "plus", "plus-circle", "pause", "pause-circle", "minus", "minus-circle", "plus-square", "minus-square", "info", "info-circle", "exclamation", "exclamation-circle", "close", "close-circle", "close-square", "check", "check-circle", "check-square", "clock-circle", "warning", "issues-close", "stop"],
    },
    {
        title: '编辑类图标',
        types: ["edit", "form", "copy", "scissor", "delete", "snippets", "diff", "highlight", "align-center", "align-left", "align-right", "bg-colors", "bold", "italic", "underline", "strikethrough", "redo", "undo", "zoom-in", "zoom-out", "font-colors", "font-size", "line-height", "colum-height", "dash", "small-dash", "sort-ascending", "sort-descending", "drag", "ordered-list", "radius-setting"],
    },
    {
        title: '数据类图标',
        types: ["area-chart", "pie-chart", "bar-chart", "dot-chart", "line-chart", "radar-chart", "heat-map", "fall", "rise", "stock", "box-plot", "fund", "sliders"],
    },
    {
        title: '网站通用图标',
        types: ["lock", "unlock", "bars", "book", "calendar", "cloud", "cloud-download", "code", "copy", "credit-card", "delete", "desktop", "download", "ellipsis", "file", "file-text", "file-unknown", "file-pdf", "file-word", "file-excel", "file-jpg", "file-ppt", "file-markdown", "file-add", "folder", "folder-open", "folder-add", "hdd", "frown", "meh", "smile", "inbox", "laptop", "appstore", "link", "mail", "mobile", "notification", "paper-clip", "picture", "poweroff", "reload", "search", "setting", "share-alt", "shopping-cart", "tablet", "tag", "tags", "to-top", "upload", "user", "video-camera", "home", "loading", "loading-3-quarters", "cloud-upload", "star", "heart", "environment", "eye", "eye-invisible", "camera", "save", "team", "solution", "phone", "filter", "exception", "export", "customer-service", "qrcode", "scan", "like", "dislike", "message", "pay-circle", "calculator", "pushpin", "bulb", "select", "switcher", "rocket", "bell", "disconnect", "database", "compass", "barcode", "hourglass", "key", "flag", "layout", "printer", "sound", "usb", "skin", "tool", "sync", "wifi", "car", "schedule", "user-add", "user-delete", "usergroup-add", "usergroup-delete", "man", "woman", "shop", "gift", "idcard", "medicine-box", "red-envelope", "coffee", "copyright", "trademark", "safety", "wallet", "bank", "trophy", "contacts", "global", "shake", "api", "fork", "dashboard", "table", "profile", "alert", "audit", "branches", "build", "border", "crown", "experiment", "fire", "money-collect", "property-safety", "read", "reconciliation", "rest", "security-scan", "insurance", "interation", "safety-certificate", "project", "thunderbolt", "block", "cluster", "deployment-unit", "dollar", "euro", "pound", "file-done", "file-exclamation", "file-protect", "file-search", "file-sync", "gateway", "gold", "robot", "shopping"],
    },
    {
        title: '品牌和标识',
        types: ["android", "apple", "windows", "ie", "chrome", "github", "aliwangwang", "dingding", "weibo-square", "weibo-circle", "taobao-circle", "html5", "weibo", "twitter", "wechat", "youtube", "alipay-circle", "taobao", "skype", "qq", "medium-workmark", "gitlab", "medium", "linkedin", "google-plus", "dropbox", "facebook", "codepen", "code-sandbox", "amazon", "google", "codepen-circle", "alipay", "ant-design", "aliyun", "zhihu", "slack", "slack-square", "behance", "behance-square", "dribbble", "dribbble-square", "instagram", "yuque", "alibaba", "yahoo"],
    },
];

export default class IconPicker extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        title: PropTypes.any,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
    };

    state = {
        selectedIcon: '',
        dataSource: icons,
    };

    componentDidUpdate(prevProps) {
        const {visible} = this.props;

        // 打开弹框
        if (!prevProps.visible && visible) {
            this.handleBeforeOpen();
        }
    }

    handleBeforeOpen = () => {
        // TODO
    };

    handleOk = () => {
        const {onOk} = this.props;
        const {selectedIcon} = this.state;

        if (onOk) onOk(selectedIcon);
    };

    handleCancel = () => {
        const {onCancel} = this.props;
        if (onCancel) onCancel();
    };

    handleClick = (selectedIcon) => {
        this.setState({selectedIcon});
    };

    handleInputChange = (e) => {
        const {value} = e.target;
        const dataSource = icons.map(item => {
            const types = item.types.filter(it => it.indexOf(value) !== -1);
            return {...item, types};
        });

        this.setState({dataSource});
    };

    render() {

        const {
            visible,
            title = 'Ant Design Icon',
            onOk,
            onCancel,
            ...others
        } = this.props;

        const {dataSource, selectedIcon} = this.state;


        return (
            <Modal
                width={600}
                {...others}
                title={title}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div style={{marginBottom: 16}}>
                    <Input.Search placeholder="Search" onChange={this.handleInputChange}/>
                </div>
                <div style={{height: document.body.clientHeight - 390, overflow: 'auto'}}>
                    {dataSource.map(item => {
                        const {title, types} = item;

                        if (!types?.length) return null;

                        return (
                            <div key={title}>
                                <h3>{title}</h3>
                                <Row>
                                    {types.map(type => {
                                        return (
                                            <Col style={{marginBottom: 16}} key={type} span={3}>

                                                <Button
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: 50,
                                                        height: 50,
                                                        cursor: 'pointer',
                                                    }}
                                                    type={selectedIcon === type ? 'primary' : 'default'}
                                                    onClick={() => this.handleClick(type)}
                                                >
                                                    <Icon style={{fontSize: 20}} type={type}/>
                                                </Button>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                        );
                    })}
                </div>
            </Modal>
        );
    }
}

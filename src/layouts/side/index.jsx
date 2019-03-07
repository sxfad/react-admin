import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getScrollBarWidth} from '@/library/utils';
import SideMenu from '../side-menu';
import {connect} from '../../models/index';
import {PAGE_FRAME_LAYOUT} from '@/models/settings';
import DragBar from './DragBar';
import './style.less';

const scrollBarWidth = getScrollBarWidth();

@connect(state => {
    const {menus, openKeys, topMenu, selectedMenu} = state.menu;
    const {show: showSide, width, collapsed, collapsedWidth, dragging} = state.side;
    return {
        menus,
        openKeys,
        topMenu,
        selectedMenu,

        showSide,
        sideWidth: width,
        sideCollapsed: collapsed,
        sideCollapsedWidth: collapsedWidth,
        sideDragging: dragging,
    };
})
export default class Side extends Component {
    static propTypes = {
        layout: PropTypes.string,
        theme: PropTypes.string,
    };

    static defaultProps = {
        layout: PAGE_FRAME_LAYOUT.SIDE_MENU, // top-menu side-menu
    };

    componentDidMount() {
        this.scrollMenu();
    }

    componentDidUpdate(prevProps) {
        this.scrollMenu(prevProps);
    }

    scrollMenu = (prevProps = {}) => {
        // 等待当前菜单选中
        setTimeout(() => {
            const {selectedMenu} = this.props;
            const {selectedMenu: prevSelectedMenu} = prevProps;
            if (selectedMenu && prevSelectedMenu && selectedMenu.key === prevSelectedMenu.key) {
                return;
            }
            const selectedMenuNode = this.inner?.querySelector('.ant-menu-item-selected');
            if (!selectedMenuNode) return;

            const innerHeight = this.inner.clientHeight;
            const innerScrollTop = this.inner.scrollTop;
            const selectedMenuTop = selectedMenuNode.offsetTop;
            const selectedMenuHeight = selectedMenuNode.offsetHeight;

            // 选中的菜单在非可视范围内，滚动到中间位置
            if (selectedMenuTop < innerScrollTop || (selectedMenuTop + selectedMenuHeight) > (innerScrollTop + innerHeight)) {
                this.inner.scrollTop = selectedMenuTop - selectedMenuHeight - (innerHeight - selectedMenuHeight) / 2;
            }
        }, 300);
    };


    handleMenuOpenChange = (openKeys) => {
        const {sideCollapsed} = this.props;
        if (!sideCollapsed) this.props.action.menu.setOpenKeys(openKeys);
    };

    handleSideResizeStart = () => {
        this.props.action.side.setDragging(true);
    };

    handleSideResize = ({clientX}) => {
        this.props.action.side.setWidth(clientX + 5);
    };

    handleSideResizeStop = () => {
        this.props.action.side.setDragging(false);
    };

    render() {
        let {
            theme,
            layout,

            menus,          // 所有的菜单数据
            openKeys,       // 当前菜单打开keys
            topMenu,        // 当前页面选中菜单的顶级菜单
            selectedMenu,   // 当前选中菜单

            showSide,
            sideCollapsed,
            sideCollapsedWidth,
            sideWidth,
            sideDragging,
            style,
        } = this.props;

        sideWidth = sideCollapsed ? sideCollapsedWidth : sideWidth;
        const sideInnerWidth = sideWidth + scrollBarWidth;
        const outerOverFlow = sideCollapsed ? 'visible' : 'hidden';
        const innerOverFlow = sideCollapsed ? 'visible' : '';
        let transitionDuration = sideDragging ? '0ms' : `300ms`;

        const isTopSideMenu = layout === PAGE_FRAME_LAYOUT.TOP_SIDE_MENU;
        const isSideMenu = layout === PAGE_FRAME_LAYOUT.SIDE_MENU;
        const hasSide = isTopSideMenu || isSideMenu;

        // 左侧菜单数据，与顶部菜单配合显示顶部菜单的子菜单；
        let sideMenus = menus;
        if (isTopSideMenu) {
            sideMenus = topMenu && topMenu.children;
        }
        if (isSideMenu) {
            sideMenus = menus;
        }

        if (hasSide) return (
            <div styleName="side" style={{width: sideWidth, display: showSide ? 'block' : 'none', transitionDuration, ...style}}>
                {sideCollapsed ? null : (
                    <DragBar
                        styleName="drag-bar"
                        onDragStart={this.handleSideResizeStart}
                        onDragging={this.handleSideResize}
                        onDragEnd={this.handleSideResizeStop}
                    />
                )}

                <div styleName="outer" style={{overflow: outerOverFlow, transitionDuration}}>
                    <div styleName="inner" ref={node => this.inner = node} style={{width: sideInnerWidth, overflow: innerOverFlow, transitionDuration}}>
                        <SideMenu
                            theme={theme}
                            dataSource={sideMenus}
                            collapsed={sideCollapsed}
                            openKeys={openKeys}
                            selectedKeys={[selectedMenu && selectedMenu.key]}
                            onOpenChange={this.handleMenuOpenChange}
                        />
                    </div>
                </div>
            </div>
        );
        return null;
    }
}

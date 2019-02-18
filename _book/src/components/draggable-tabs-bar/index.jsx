import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';
import classNames from 'classnames';
import './style.css';


const SortableItem = SortableElement((props) => {
    const {children} = props;
    return (
        <div
            className={classNames('draggable-tabs-bar-horizontal-item', props.className)}
            style={props.style}
        >
            {children}
        </div>
    );
});

const SortableContainerList = SortableContainer(props => {
    const {
        className,
        dataSource,
        activeKey,
        itemClass,
        onClose,
        onClick,
        itemWrapper,
        isSorting,
        ...others
    } = props;

    return (
        <div className={classNames('draggable-tabs-bar-root', className, {sorting: isSorting})} {...others}>
            {dataSource.map((item, index) => {
                const {key, title, closable} = item;
                const isActive = activeKey === key;
                let itemJsx = [
                    (
                        <div key="item" className="item-inner" onClick={(e) => onClick && onClick(item, e)}>
                            {title}
                        </div>
                    ),
                    (
                        closable ? (
                            <div key="close" className="close-wrapper" onClick={(e) => onClose && onClose(item, e)}>
                                <Icon type="close"/>
                            </div>
                        ) : null
                    )
                ];

                if (itemWrapper) {
                    itemJsx = itemWrapper(itemJsx, item, 'draggable-tabs-bar-wrapper');
                } else {
                    itemJsx = <div className="draggable-tabs-bar-wrapper">{itemJsx}</div>;
                }
                return (
                    <SortableItem
                        key={key}
                        className={classNames(itemClass, {'active': isActive})}
                        index={index}
                    >
                        <div className="draggable-tabs-bar-horizontal-item-inner">{itemJsx}</div>
                    </SortableItem>
                );
            })}
        </div>
    );
});

export default class DraggableTabsBar extends Component {
    state = {
        itemLength: 0,
        isSorting: false,
        mouseIn: false,
    };

    static propTypes = {
        dataSource: PropTypes.array,
        className: PropTypes.string,
        activeKey: PropTypes.any,
        onSortStart: PropTypes.func,
        onSortEnd: PropTypes.func,
        onClose: PropTypes.func,
        onClick: PropTypes.func,
        itemWrapper: PropTypes.func,
    };

    static defaultProps = {
        className: classNames('list', 'stylizedList'),
    };

    componentDidMount() {
        this.setTabsWidth();
    };

    componentDidUpdate(prevProps) {
        const {dataSource} = this.props;
        const {dataSource: prevDataSource} = prevProps;

        // tabs 个数有变，调整宽度
        if (prevDataSource.length !== dataSource.length) {
            this.setTabsWidth();
        }
    }

    setTabsWidth = () => {
        const {mouseIn} = this.state;
        const maxWidth = 150;
        const items = this.container.querySelectorAll('.draggable-tabs-bar-horizontal-item-inner');
        const rootContainer = this.container.querySelector('.draggable-tabs-bar-root');
        const itemCount = items.length;
        const rootContainerWidth = rootContainer.clientWidth;
        const maxCount = Math.floor(rootContainerWidth / maxWidth);

        if (!mouseIn) {
            if (itemCount <= maxCount) {
                // 宽度足够所有的tab使用最大宽度，都使用最大宽度
                items.forEach(itemNode => {
                    itemNode.style.width = `${maxWidth}px`;
                });
            } else {
                // 宽度不够使用最大宽度，平均分配
                items.forEach(itemNode => {
                    itemNode.style.width = `${rootContainerWidth / itemCount}px`;
                });
            }
        }
    };

    onSortStart = (info, event) => {
        this.setState({isSorting: true});

        const {onSortStart} = this.props;

        if (onSortStart) {
            onSortStart(info, event);
        }
    };

    onSortEnd = (info, event) => {
        this.setState({isSorting: false});

        const {onSortEnd} = this.props;

        if (onSortEnd) {
            onSortEnd(info, event);
        }
    };

    handleMouseEnter = () => {
        this.setState({mouseIn: true});
    };

    handleMouseLeave = () => {
        this.setState({mouseIn: false}, this.setTabsWidth);
    };


    render() {
        const {
            dataSource,
            activeKey,
            onClose,
            onClick,
            itemWrapper,
        } = this.props;
        const {isSorting} = this.state;
        const props = {
            isSorting,
            dataSource,
            activeKey,
            onSortEnd: this.onSortEnd,
            onSortStart: this.onSortStart,
            axis: 'x',
            distance: 1,
            ref: 'component',
            onClose,
            onClick,
            itemWrapper,
        };

        return (
            <div
                style={{width: '100%'}}
                ref={node => this.container = node}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <SortableContainerList {...props}/>
            </div>
        );
    }
}

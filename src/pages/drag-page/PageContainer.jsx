import React, {Component} from 'react';
import {Input, Form} from 'antd';
import DropBox from './DropBox'
import DragBox from './DragBox'
import config from '@/commons/config-hoc';
import {findNodeById, findParentById} from './utils';
import {renderNode, canDrop} from './render-utils';
import './style.less';

const GUIDE_PADDING = 10;
@config({
    event: true,
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            currentId: state.dragPage.currentId,
            showGuideLine: state.dragPage.showGuideLine,
        }
    },
})
@Form.create()
export default class Dnd extends Component {
    state = {
        dragging: false,
        isTextArea: false,
        inputStyle: {display: 'none'},
        inputValue: void 0,
        inputPlaceholder: void 0,
        currentInputId: null,

        currentHoverId: null,
    };

    componentDidMount() {
        this.props.addEventListener(document, 'keydown', e => {
            const {keyCode} = e;
            // Delete
            if (keyCode === 46) {
                const {currentId} = this.props;
                if (currentId) {
                    this.props.action.dragPage.deleteNodeAndSelectOther(currentId);
                }
            }
        });
    }


    handleBeginDrag = () => {
        this.setState({dragging: true});
    };

    handleEndDrag = (dragId, result) => {
        this.setState({dragging: false});

        if (!result) return;

        const dropId = result.id;
        if (dropId === 'delete-node') {
            this.props.action.dragPage.deleteNode(dragId);
        }
    };

    handleClick = (e, __id) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.action.dragPage.setCurrentId(__id);
    };

    handleDoubleClick = (e, __id) => {
        e.preventDefault();
        e.stopPropagation();

        const {showGuideLine, pageConfig} = this.props;
        const dom = e.currentTarget;
        const {x, y, width, height} = dom.getBoundingClientRect();

        const inputStyle = {
            position: 'fixed',
            top: y,
            left: x,
            height,
            width,
            padding: showGuideLine ? GUIDE_PADDING : 0,
        };

        const node = findNodeById(pageConfig, __id);
        const nodeChildren = (node && node.children) || [];
        const nodeTextChildren = nodeChildren.filter(item => item.__type === 'text');

        // 子节点中只存在一个
        if (nodeTextChildren && nodeTextChildren.length === 1) {
            const content = nodeTextChildren[0].content || '';

            this.setState({
                isTextArea: height > 100 || content.length > 30,
                currentInputId: __id,
                inputStyle,
                inputValue: void 0,
                inputPlaceholder: content,
            }, () => this.input.focus());
        }
    };

    handleInputChange = (e) => {
        const inputValue = e.target.value;

        this.setState({inputValue});
    };

    handleInputBlur = () => {
        const {currentInputId, inputValue} = this.state;

        this.setState({inputStyle: {display: 'none'}});

        if (!inputValue) return;

        this.props.action.dragPage.setContent({targetId: currentInputId, content: inputValue});
    };

    handleMove = (dragId, hoverId) => {
        this.props.action.dragPage.sort({dragId, hoverId});
    };

    handleCanDrop = (dropType, monitor) => {
        const {id: dragType} = monitor.getItem();

        return canDrop(dragType, dropType);
    };

    handleEnter = (e, __id) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({currentHoverId: __id});
    };

    handleLeave = (e, __id) => {
        e.preventDefault();
        e.stopPropagation();

        const {pageConfig} = this.props;
        const parentNode = findParentById(pageConfig, __id) || {};
        this.setState({currentHoverId: parentNode.__id});

    };

    renderPage = (node) => {
        return renderNode(node, (resultCom, {
            __id,
            __type,
            __parentId,
            __parentDirection,
            level,
            tagName,
            container,
            display,

            Component,
            componentProps,
            componentChildren,
            innerWrapper,
        }) => {
            const {currentId, showGuideLine} = this.props;
            const {dragging, currentHoverId} = this.state;
            const sortType = __parentId;
            // types如果是数组，拖拽排序是会报错：Uncaught Invariant Violation: Expected to find a valid target
            // 通过dragging变量来切换，避免报错
            const containerSortType = (container && !dragging) ? ['component', __parentId] : __parentId;
            const activeStyle = {background: '#aff3b5', transform: 'scale(1.01)',};
            const canDropStyle = {background: '#f9ecc5'};
            const dropBoxStyle = {
                display,
                transition: '300ms',
            };

            if (showGuideLine) {
                dropBoxStyle.border = '1px dashed #d9d9d9';
                dropBoxStyle.padding = GUIDE_PADDING;

                if (currentId === __id) {
                    dropBoxStyle.border = '1px dashed #64F36A';
                    dropBoxStyle.background = '#e7ffee';
                }

                if (currentHoverId === __id) {
                    dropBoxStyle.border = '1px dashed #B8CEDC';
                    dropBoxStyle.background = '#d6eeff';
                }
            }

            if (tagName === 'FormElement') resultCom = <Component form={this.props.form} {...componentProps} field={__id}>{componentChildren}</Component>;

            if (innerWrapper) resultCom = componentChildren;

            resultCom = (
                <DropBox
                    types={containerSortType}
                    id={__id}
                    level={level}
                    style={dropBoxStyle}
                    activeStyle={activeStyle}
                    canDropStyle={canDropStyle}
                    direction={__parentDirection}
                    onMouseEnter={e => this.handleEnter(e, __id)}
                    onMouseLeave={e => this.handleLeave(e, __id)}
                    onMove={this.handleMove}
                    canDrop={(monitor) => this.handleCanDrop(__type, monitor)}
                >
                    {resultCom}
                </DropBox>
            );

            // const draggingStyle = {width: 0, height: 0, padding: 0, margin: 0, overflow: 'hidden'};
            const draggingStyle = {opacity: 0};
            const dragBoxStyle = {
                display,
                boxSizing: 'border-box',
                cursor: 'move',
            };


            resultCom = (
                <DragBox
                    type={sortType}
                    key={__id}
                    id={__id}
                    level={level}
                    style={dragBoxStyle}
                    draggingStyle={draggingStyle}
                    onClick={(e) => this.handleClick(e, __id)}
                    onDoubleClick={(e) => this.handleDoubleClick(e, __id)}
                    beginDrag={this.handleBeginDrag}
                    endDrag={result => this.handleEndDrag(__id, result)}
                >
                    {resultCom}
                    {/*###{__id}###*/}
                    {/****{level}****/}
                </DragBox>
            );

            if (innerWrapper) return <Component key={__id} {...componentProps}>{resultCom}</Component>;

            return resultCom;
        });

    };

    render() {
        const {
            inputStyle,
            inputValue,
            inputPlaceholder,
            isTextArea,
        } = this.state;
        const {pageConfig} = this.props;

        const inputProps = {
            ref: node => this.input = node,
            value: inputValue,
            onChange: this.handleInputChange,
            onBlur: this.handleInputBlur,
            placeholder: inputPlaceholder,
            style: {
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 59, 1)',
            },
        };

        return (
            <div styleName="root">
                <div styleName="content">
                    {this.renderPage(pageConfig)}
                </div>
                <div style={inputStyle}>
                    {isTextArea ? <Input.TextArea {...inputProps}/> : <Input {...inputProps}/>}
                </div>
            </div>
        );
    }
}

import React, {Component} from 'react';
import {Input} from 'antd';
import DropBox from './DropBox'
import DragBox from './DragBox'
import config from '@/commons/config-hoc';
import {findNodeById} from './utils';
import {renderNode} from './render-utils';
import './style.less';

const GUIDE_PADDING = 10;
@config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            currentId: state.dragPage.currentId,
            showGuideLine: state.dragPage.showGuideLine,
        }
    },
})
export default class Dnd extends Component {
    state = {
        dragging: false,
        isTextArea: false,
        inputStyle: {display: 'none'},
        inputValue: void 0,
        inputPlaceholder: void 0,
        currentInputId: null,
    };

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
        if (node && node.children && node.children.length === 1 && node.children[0].__type === 'text') {
            const content = node.children[0].content || '';

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

    renderPage = (node) => {
        return renderNode(node, (resultCom, {__id, __parentId, level, container, __parentDirection, display}) => {
            const {currentId, showGuideLine} = this.props;
            const {dragging} = this.state;
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

            resultCom = (
                <DropBox
                    types={containerSortType}
                    id={__id}
                    level={level}
                    style={dropBoxStyle}
                    activeStyle={activeStyle}
                    canDropStyle={canDropStyle}
                    direction={__parentDirection}
                    onMove={this.handleMove}
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

            if (showGuideLine) {
                dragBoxStyle.border = '1px dashed #d9d9d9';
                dragBoxStyle.padding = GUIDE_PADDING;

                if (currentId === __id) {
                    dragBoxStyle.border = '1px dashed #64F36A';
                    dragBoxStyle.background = '#aff3b5';
                }
            }

            return (
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

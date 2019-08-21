import React, {Component} from 'react';
import {Icon, Tooltip, Switch} from 'antd';
import config from '@/commons/config-hoc';
import DropBox from "./DropBox";
import ComponentSettingsForm from './ComponentSettingsForm';

@config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            currentNode: state.dragPage.currentNode,
            showGuideLine: state.dragPage.showGuideLine,
        }
    },
})
export default class ComponentSettings extends Component {
    state = {};

    handleToggleGuideLine = () => {
        const {showGuideLine} = this.props;

        this.props.action.dragPage.setGuideLine(!showGuideLine);
    };

    render() {
        let {
            showGuideLine,
            pageConfig,
            currentNode,
        } = this.props;

        const allIds = ['0'];
        const loop = node => {
            const {__id, children} = node;
            allIds.push(__id);

            if (children && children.length) {
                children.forEach(loop);
            }
        };
        loop(pageConfig);

        if (!currentNode) currentNode = {};

        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div style={{
                    display: 'flex',
                    flex: '0 0 50px',
                    borderBottom: '1px solid #d9d9d9',
                    alignItems: 'center',
                }}>
                    <div style={{width: 50, textAlign: 'center', borderRight: '1px solid #d9d9d9',}}>
                        <DropBox
                            types={allIds}
                            id="delete-node"
                            style={{transition: '300ms', padding: 10,}}
                            activeStyle={{transform: 'scale(1.5)'}}
                        >
                            <Tooltip title="拖拽元素到垃圾箱上进行删除">
                                <Icon style={{fontSize: 30, color: 'red'}} type="delete"/>
                            </Tooltip>
                        </DropBox>
                    </div>

                    <div style={{marginLeft: 10}}>
                        辅助：
                        <Switch
                            checkedChildren="开"
                            unCheckedChildren="关"
                            checked={showGuideLine}
                            onChange={this.handleToggleGuideLine}
                        />
                    </div>
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: 10,
                    }}>
                    <ComponentSettingsForm key={currentNode.__id}/>
                </div>
            </div>
        );
    }
}

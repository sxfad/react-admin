import React, {Component} from 'react';
import DropBox from './DropBox'
import DragBox from './DragBox'
import components from './components';
import config from '@/commons/config-hoc';
import './style.less';

function render(node) {
    const {__type, __id, children, content, ...others} = node;
    const com = components[__type];

    if (!com) return null; // fixme 更多提示？

    const {component: Component} = components[__type];

    if (children && children.length) {
        const renderChildren = children.map(item => render(item));

        if (Component === 'div') {
            return <div key={__id} {...others}>{renderChildren}</div>
        }

        return <Component key={__id} {...others}>{renderChildren}</Component>
    } else {
        if (Component === 'div') return <div key={__id} {...others}/>;

        if (Component === 'text') return content;

        return <Component key={__id} {...others}/>
    }
}

@config({
    connect: state => {
        return {
            pageConfig: state.pageConfig.pageConfigs['demo-page'],
        }
    },
})
export default class Dnd extends Component {
    handleDropped = (componentKey, targetId) => {
        console.log(componentKey, targetId);
    };

    render() {
        const {pageConfig} = this.props;

        return (
            <div styleName="root">
                <div styleName="component-container">
                    {Object.keys(components).map(key => {
                        const {demonstration, component: Com, props = []} = components[key];

                        let children = demonstration;

                        if (!children) {
                            const comProps = {};

                            props.forEach(item => {
                                let {attribute, defaultValue, valueType} = item;

                                if (valueType === 'this.function') defaultValue = () => void 0;

                                comProps[attribute] = defaultValue;
                            });

                            children = <Com {...comProps}/>
                        }

                        return (
                            <DragBox
                                style={{
                                    display: 'inline-block',
                                    margin: 4,
                                }}
                                key={key}
                                id={key}
                                type="box"
                                onDropped={result => this.handleDropped(key, result.id)}
                            >
                                {children}
                            </DragBox>
                        );
                    })}
                </div>
                <div styleName="content">
                    {render(pageConfig)}
                    <DropBox type="box" id="DropBox"/>
                    <DropBox type="box" id="DropBox2"/>
                </div>
            </div>
        );
    }
}

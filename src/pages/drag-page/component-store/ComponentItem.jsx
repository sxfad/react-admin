import React from 'react';
import {cloneDeep} from 'lodash';
import config from 'src/commons/config-hoc';
import NodeRender from '../iframe-render/node-render/NodeRender';
import Draggable from './Draggable';

import './ComponentItem.less';

export default config({})(function DraggableComponent(props) {
    const {data} = props;

    function _renderPreview() {
        const {
            renderPreview,
            previewProps,
            previewZoom,
            previewStyle,
            previewWrapperStyle,
            config,
        } = data;

        if (!renderPreview) return null;

        const componentConfig = cloneDeep(config);
        if (!componentConfig.props) componentConfig.props = {};

        if (previewProps) {
            componentConfig.props = {
                ...componentConfig.props,
                ...previewProps,
            };
        }

        if (previewStyle) {
            if (!componentConfig.props.style) componentConfig.props.style = {};

            componentConfig.props.style = {
                ...componentConfig.props.style,
                ...previewStyle,
            };
        }

        let preview = renderPreview === true ? (
            <NodeRender config={componentConfig}/>
        ) : renderPreview;

        if (typeof preview === 'function') {
            preview = preview(config);
        }

        return (
            <div styleName="preview" style={previewWrapperStyle}>
                {previewZoom ? (
                    <div styleName="previewZoom" style={{zoom: previewZoom || 1}}>
                        {preview}
                    </div>
                ) : preview}
            </div>
        );
    }

    const {icon, title, image} = data;

    return (
        <Draggable data={data}>
            <div styleName="root">
                <div styleName="title">
                    {icon} {title}
                </div>

                {image ? (
                    <div styleName="preview">
                        <img
                            draggable={false}
                            styleName="img"
                            src={image}
                            alt="组件预览图"
                        />
                    </div>
                ) : _renderPreview()}
            </div>
        </Draggable>
    );
});


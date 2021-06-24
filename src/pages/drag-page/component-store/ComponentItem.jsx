import React from 'react';
import {cloneDeep} from 'lodash';
import NodeRender from '../iframe-render/node-render/NodeRender';
import Draggable from './Draggable';
import styles from './ComponentItem.less';
import {setNodeId} from 'src/pages/drag-page/node-util';

export default function DraggableComponent(props) {
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

        setNodeId(componentConfig);

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
            <div className={styles.preview} style={previewWrapperStyle}>
                {previewZoom ? (
                    <div className={styles.previewZoom} style={{zoom: previewZoom || 1}}>
                        {preview}
                    </div>
                ) : preview}
            </div>
        );
    }

    const {icon, title, image} = data;

    return (
        <Draggable data={data}>
            <div className={styles.root}>
                <div className={styles.title}>
                    {icon} {title}
                </div>

                {image ? (
                    <div className={styles.preview}>
                        <img
                            draggable={false}
                            className={styles.img}
                            src={image}
                            alt="组件预览图"
                        />
                    </div>
                ) : _renderPreview()}
            </div>
        </Draggable>
    );
};


import {useEffect} from 'react';
import {notification} from 'antd';

export default function Notification(props) {
    let {children, type, ...others} = props;
    if (!type) type = 'success';

    const id = children?.props?.config?.id;
    const nodeSelectType = children?.props?.nodeSelectType;
    const iframeDocument = children?.props?.iframeDocument;
    const dragPageAction = children?.props?.dragPageAction;

    const modalId = others['data-component-id'];

    function handleClick(e) {
        if (nodeSelectType === 'meta' && (e.metaKey || e.ctrlKey)) return;

        notification[type]({
            getContainer: () => iframeDocument?.body,
            ...others,
        });

        // 不渲染，标题和内容无法编辑
        setTimeout(() => dragPageAction.render());
    }

    useEffect(() => {
        if (id && iframeDocument) {
            const elements = iframeDocument.querySelectorAll(`.id_${id}`);
            if (elements?.length) {
                elements.forEach(element => {
                    if (element.getAttribute(`data-notification-id-${modalId}`) !== 'true') {
                        element.addEventListener('click', handleClick);
                        element.setAttribute(`data-notification-id-${modalId}`, true);
                    }
                });

                return () => {
                    elements.forEach(element => {
                        element.removeEventListener('click', handleClick);
                        element.setAttribute(`data-notification-id-${modalId}`, false);
                    });
                };
            }
        }
    }, [id, iframeDocument]);


    return children;
}

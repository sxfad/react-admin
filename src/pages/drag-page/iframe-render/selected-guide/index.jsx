import {useEffect} from 'react';
import config from 'src/commons/config-hoc';
import styles from './style.less';
import {getComponentDisplayName} from 'src/pages/drag-page/component-config';

export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
            iframeDocument: state.dragPage.iframeDocument,
        };
    },
})(function SelectedGuide(props) {
    const {selectedNode, iframeDocument} = props;

    useEffect(() => {
        if (!iframeDocument) return;

        // 清除选中指引
        const oldSelectedEle = iframeDocument.querySelector(`[data-fix-position-relative]`);
        if (oldSelectedEle) {
            oldSelectedEle.removeAttribute('data-fix-position-relative');
            oldSelectedEle.removeAttribute('data-after-tag');
            oldSelectedEle.removeAttribute('data-before-tag');
        }
        const tagEle = iframeDocument.querySelector(`.${styles.tag}`);
        if (tagEle) tagEle.remove();

        if (!selectedNode) return;

        const {id} = selectedNode;

        let target = iframeDocument.querySelector(`[data-component-id="${id}"]`);
        if (target) target = iframeDocument.querySelector(`.id_${id}`);

        if (!target) return;

        // 判断是否有定位，没有添加相对定位，tag定位会用到
        const targetStyle = window.getComputedStyle(target);
        if (targetStyle.position === 'static') {
            target.setAttribute('data-fix-position-relative', 'true');
        }

        // 太小就不显示tag
        const rect = target.getBoundingClientRect();
        if (rect.width < 50) return;

        // 部分元素 before after 会被延迟加入，导致判断有误，添加 timeout
        setTimeout(() => {
            // 添加额外标签显示 tab，占用 before 或 after 可能跟原有元素有冲突
            const before = window.getComputedStyle(target, '::before');
            const after = window.getComputedStyle(target, '::after');

            if (before.content === 'none') {
                // before 没有被占用
                target.setAttribute('data-before-tag', true);
            } else if (after.content === 'none') {
                // after 没有被占用
                target.setAttribute('data-after-tag', true);
            } else {
                // before after 都被占用了，使用额外标签
                const tag = iframeDocument.createElement('div');
                tag.classList.add(styles.tag);
                tag.innerHTML = getComponentDisplayName(selectedNode);
                target.appendChild(tag);
            }
        });
    }, [selectedNode, iframeDocument]);

    return null;
});

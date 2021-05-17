import config from 'src/commons/config-hoc';
import {ModalContent} from '@ra-lib/components';

export default config({
    // modal: '测试',
    modal: (props) => {
        console.log(props);
        // return '测试22'
        return {
            title: '哈哈',
            // title: () => '哈哈2'
            // fullScreen: true,
        }
    },
})(function TestModal(props) {
    const {onOk, onCancel} = props;

    function handleOk() {
        console.log('handleOk');
        onOk();
    }

    function handleCancel() {
        console.log('handleCancel');
        onCancel();
    }

    return (
        <ModalContent
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <div style={{width: 200, height: 2000, background: 'red'}}>
                弹框内容
            </div>
        </ModalContent>
    );
})

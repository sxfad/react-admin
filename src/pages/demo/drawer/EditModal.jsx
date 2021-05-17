import config from 'src/commons/config-hoc';
import {DrawerContent} from '@ra-lib/components';

export default config({
    drawer: '抽屉标题',
})(function TestModal(props) {
    console.log('drawer', props);
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
        <DrawerContent
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <div style={{width: 200, height: 2000, background: 'red'}}>
                弹框内容
            </div>
        </DrawerContent>
    );
})

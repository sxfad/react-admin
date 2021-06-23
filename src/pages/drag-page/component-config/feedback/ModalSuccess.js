import ModalConfirmOption from './ModalConfirm';
import {cloneDeep} from 'lodash';

const options = cloneDeep(ModalConfirmOption);
options.fields = options.fields.filter(item => item.field !== 'cancelText');
options.fields.forEach(item => {
    if (item.field === 'okText') item.defaultValue = '知道了';
});
export default options;

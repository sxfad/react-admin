import {buttonTypeOptions} from '../options';
import inputConfig from 'src/pages/drag-page/component-config/data-input/Input';

export default {
    componentType: '@ra-lib/admin',
    fields: [
        {label: '倒计时', field: 'time', type: 'number', defaultValue: 60},
        {
            label: '按钮类型', field: 'buttonType', type: 'radio-group', options: buttonTypeOptions, defaultValue: 'default',
        },
        ...inputConfig.fields,
    ],
};

import {Button, Input} from 'antd';
import uuid from "uuid/v4";

export const category = 'Ant Design 组件库';

export default {
    ButtonPrimary: {
        tagName: 'Button',
        component: Button,
        title: '主按钮',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            type: 'primary',
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '主按钮',
                }
            ],
        },
    },
    Button: {
        component: Button,
        title: '次按钮',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '次按钮',
                }
            ],
        },
    },
    ButtonDanger: {
        tagName: 'Button',
        component: Button,
        title: '危险按钮',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            type: 'danger',
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '危险按钮',
                }
            ],
        },
    },
    Input: {
        tagName: 'Input',
        component: Input,
        title: '输入框',
        dependence: 'antd',
        import: 'import {Input} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            placeholder: '请输入',
        },
    },
};

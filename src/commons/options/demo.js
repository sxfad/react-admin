import {Button} from 'antd';
import {PageContent} from '@ra-lib/components';
import options, {useOptions} from 'src/commons/options';

export default function UseOptionsDemo(props) {
    // 直接获取
    const {yesNo: yesNoOptions, sex: sexOptions} = options;

    // 发请求获取
    const [menuOptions] = useOptions(options.menu);
    const [actionOptions] = useOptions(options.action);

    // 多个按顺序对应
    const [
        menuOptions1,
        actionOptions1,
    ] = useOptions(
        options.menu,
        options.action,
    );

    console.log(options.menu.getLabel('1').then(console.log));
    console.log(options.sex.getLabel('1'));

    return (
        <PageContent>
            <Button
                onClick={() => options.menu.getLabel('1').then(console.log)}
            >测试缓存</Button>
            <pre>
            {JSON.stringify({
                menuOptions,
                yesNoOptions,
                sexOptions,
                actionOptions,
                menuOptions1,
                actionOptions1,
            }, null, 4)}
            </pre>
        </PageContent>
    );
}

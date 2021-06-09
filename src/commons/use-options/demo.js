import {PageContent} from '@ra-lib/components';
import useOptions from 'src/commons/use-options';

export default function UseOptionsDemo(props) {

    // 直接获取
    const {yesNo: yesNoOptions, sex: sexOptions} = useOptions;

    // 发请求获取
    const [menuOptions] = useOptions(useOptions.menu);
    const [actionOptions] = useOptions(useOptions.action);

    // 多个按顺序对应
    const [
        menuOptions1,
        actionOptions1,
    ] = useOptions(
        useOptions.menu,
        useOptions.action,
    );

    return (
        <PageContent>
            <pre>
            {JSON.stringify({
                yesNoOptions,
                sexOptions,
                menuOptions,
                actionOptions,
                menuOptions1,
                actionOptions1,
            }, null, 4)}
            </pre>
        </PageContent>
    );
}

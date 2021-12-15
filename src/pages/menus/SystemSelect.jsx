import { Select } from 'antd';
import { useGet } from 'src/commons/ajax';

export default function SystemSelect(props) {
    const { placeholder = '请选择系统', ...others } = props;
    const { data: options } = useGet('/menu/queryTopMenus', { pageNum: 1, pageSize: 100000 }, [], {
        formatResult: (res) => {
            return (res.content || []).map((item) => {
                return {
                    meta: item,
                    value: item.id,
                    label: item.name,
                };
            });
        },
    });

    return <Select {...others} placeholder={placeholder} options={options} />;
}

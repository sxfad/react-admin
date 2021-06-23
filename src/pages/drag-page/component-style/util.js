export function handleSyncFields(options) {
    const {event, form, field, fields, enter, onChange} = options;

    // 需要是 上 右 下 左 的顺序
    const topBottomFields = [fields[0], fields[2]];
    const leftRightFields = [fields[1], fields[3]];

    const {ctrlKey, metaKey, shiftKey, key} = event;

    const enterKey = key === 'Enter';

    if (enter && !enterKey) return;

    if (ctrlKey || metaKey) {
        let value = form.getFieldValue(field);
        if (value === '') value = undefined;

        const syncFields = keys => {
            const fields = keys.reduce((prev, field) => {
                prev[field] = value;
                return prev;
            }, {});

            form.setFieldsValue(fields);
            onChange && onChange({}, form.getFieldsValue());
        };

        if (shiftKey) {
            // 同步所有
            syncFields(fields);

        } else {
            // 同步 上下
            if (topBottomFields.includes(field)) syncFields(topBottomFields);

            // 同步左右
            if (leftRightFields.includes(field)) syncFields(leftRightFields);
        }
    }
}

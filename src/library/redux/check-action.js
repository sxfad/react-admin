export default function checkActions(acs) {
    const actionsFunctions = {};
    for (let key of Object.keys(acs)) {
        const action = acs[key];
        for (let k of Object.keys(action)) {
            if (actionsFunctions[k]) {
                throw Error(`不予许定义同名的action方法：${key}.${k} 与 ${actionsFunctions[k]._module}.${k} 方法冲突！`);
            } else {
                actionsFunctions[k] = action[k];
                actionsFunctions[k]._module = key;
            }
        }
    }
    return actionsFunctions;
}

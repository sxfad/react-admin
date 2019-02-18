/**
 * promise异步reducer参数说明
 * 每个函数的参数都是 (state, action)，每个函数的state都是上游函数处理过的最新state
 * 调用顺序：pending -> resolve(reject)->complete
 *
 * @param always = (state) => ({...state}),     // 每个状态之前都会触发，pending、resolve、reject、complete之前都会触发
 * @param pending = (state) => ({...state}),    // 请求开始之前
 * @param resolve = (state) => ({...state}),    // 成功
 * @param reject = (state) => ({...state}),     // 失败
 * @param complete = (state) => ({...state}),   // 完成，无论成功失败，都会触发
 * @returns {function(*=, *=)}
 */
export default function handleAsyncReducer({
                                               always = (state) => ({...state}),
                                               pending = (state) => ({...state}),
                                               resolve = (state) => ({...state}),
                                               reject = (state) => ({...state}),
                                               complete = (state) => ({...state}),
                                           }) {
    return (state, action) => {
        const {meta = {}, error} = action;
        const {sequence = {}} = meta;

        function getReturnState(preState, method) {
            const newState = method(preState, action) || {};
            // if (!newState) {
            //     throw Error(`handleAsyncReducer's ${method} method must return an object to compose a new state`);
            // }
            return {...preState, ...newState};
        }

        const alwaysState = getReturnState(state, always);

        if (sequence.type === 'start') {
            return getReturnState(alwaysState, pending);
        }

        if (sequence.type === 'next' && error) {
            const rejectState = getReturnState(alwaysState, reject);
            return getReturnState(rejectState, complete);
        }

        if (sequence.type === 'next' && !error) {
            const resolveState = getReturnState(alwaysState, resolve);
            return getReturnState(resolveState, complete);
        }
    };
}

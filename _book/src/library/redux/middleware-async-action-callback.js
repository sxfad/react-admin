export default function asyncActionCallbackMiddleware() {
    return next => action => {
        const {meta = {}, error, payload} = action;
        const {sequence = {}, onResolve, onReject, onComplete} = meta;
        if (sequence.type !== 'next') return next(action);

        // do callback
        if (error) { // error 为标记是否出错 payload为error对象
            onReject && onReject(payload);
            onComplete && onComplete(payload);
        } else {
            onResolve && onResolve(payload);
            onComplete && onComplete(null, payload);
        }

        next(action);
    };
}

import {isFSA} from 'flux-standard-action';
import _ from 'lodash';

function isPromise(val) {
    return val && typeof val.then === 'function';
}

export default function promiseMiddleware({dispatch}) {
    return next => action => {
        if (!isFSA(action)) {
            return isPromise(action)
                ? action.then(dispatch)
                : next(action);
        }
        const {meta = {}, payload} = action;

        const id = _.uniqueId();

        if (isPromise(payload)) {
            dispatch({ // 先调用reducer，通知reducer异步开始
                ...action,
                payload: undefined,
                meta: {
                    ...meta,
                    sequence: {
                        type: 'start',
                        id,
                    },
                },
            });

            return payload.then( // 异步结束时，再次调用reducer，分为成功或失败
                result => dispatch({
                    ...action,
                    payload: result,
                    meta: {
                        ...meta,
                        sequence: {
                            type: 'next',
                            id,
                        },
                    },
                }),
                error => dispatch({
                    ...action,
                    payload: error,
                    error: true,
                    meta: {
                        ...meta,
                        sequence: {
                            type: 'next',
                            id,
                        },
                    },
                })
            );
        }

        return next(action);
    };
}

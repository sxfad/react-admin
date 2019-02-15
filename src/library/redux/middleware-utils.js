import {getHandleError, getHandleSuccess} from './index';

export default function utilsMiddleware() {
    return next => action => {
        const handleError = getHandleError();
        const handleSuccess = getHandleSuccess();
        const {payload, error, meta = {}} = action;
        const {sequence = {}, successTip, errorTip} = meta;
        // error handle
        if (error) {
            handleError({
                error: payload,
                errorTip,
            });
        }
        if (sequence.type === 'next' && !error) {
            handleSuccess({successTip});
        }
        next(action);
    };
}

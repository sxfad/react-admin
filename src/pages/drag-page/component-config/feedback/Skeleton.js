import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [],
};

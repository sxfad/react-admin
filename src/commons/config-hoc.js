import { connect } from 'src/models';
import { ajaxHoc } from 'src/commons/ajax';
import { getLoginUser } from 'src/commons';
import { createConfigHoc } from 'ra-lib';

/**
 * 页面配置高阶组件，整合了多个高阶组件
 * @param options
 * @returns {function(*): WithConfig}
 */
export default createConfigHoc({
    connect,
    getLoginUser,
    ajaxHoc,
});

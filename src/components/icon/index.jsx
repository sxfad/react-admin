import {createFromIconfontCN} from '@ant-design/icons';
// import * as antdIcons from '@ant-design/icons';
import PropTypes from 'prop-types';

/*
* antd icon 全量引入，缺点是文件太大（Gzipped 多出150k），但是可以通过字符串方式引用，(主要是给菜单使用)
* <Icon type="AccountBookFilled"/>
*
* font icon使用方法：
* <Icon type="icon-kafka"/>
* 参考：
* https://ant.design/components/icon-cn/#components-icon-demo-iconfont
* https://www.iconfont.cn/
* */
const IconFont = createFromIconfontCN({
    // 具体项目自己在 iconfont.cn 上创建 scriptUrl
    scriptUrl: '//at.alicdn.com/t/font_2363884_0xyjyu18wny.js',
});

function Icon(props) {
    // const {type} = props;

    // const AntdIcon = antdIcons[type];
    // if (AntdIcon) return <AntdIcon {...props}/>

    return <IconFont {...props}/>;
}

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    rotate: PropTypes.number,
    spin: PropTypes.bool,
    twoToneColor: PropTypes.string,
};

export default Icon;

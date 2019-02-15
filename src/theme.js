/*
* 主题定制
* 方案：https':'//ant-design.gitee.io/docs/react/customize-theme-cn
* 这里利用了 less-loader 的 modifyVars 来进行主题配置
* 此文件会被 /config/webpack.config.js引用
*
* 注：此文件修改之后，需要重新启动webpack才能生效：yarn start
* */
module.exports = {
    '@primary-color': '#1890ff',                          // 全局主色
    '@link-color': '#1890ff',                            // 链接色
    '@success-color': '#52c41a',                         // 成功色
    '@warning-color': '#faad14',                         // 警告色
    '@error-color': '#f5222d',                           // 错误色
    '@font-size-base': '14px',                           // 主字号
    '@heading-color': 'rgba(0, 0, 0, .85)',              // 标题色
    '@text-color': 'rgba(0, 0, 0, .65)',                 // 主文本色
    '@text-color-secondary ': 'rgba(0, 0, 0, .45)',      // 次文本色
    '@disabled-color ': 'rgba(0, 0, 0, .25)',            // 失效色
    '@border-radius-base': '4px',                        // 组件/浮层圆角
    '@border-color-base': '#d9d9d9',                     // 边框色
    '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)',  // 浮层阴影

    // '@layout-header-background': '#001529',                 // 深色主题样式
    '@layout-header-background': '#000',                 // 深色主题样式
    '@menu-dark-submenu-bg': 'lighten(@layout-header-background, 5%)',
};

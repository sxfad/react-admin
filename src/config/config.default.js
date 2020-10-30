const {
    AJAX_PREFIX,
    BASE_NAME,
    MOCK,
    NODE_ENV,
    PUBLIC_URL,
} = process.env;

export default {
    // 默认ajax url前缀
    ajaxPrefix: AJAX_PREFIX || '/api',
    // 默认ajax超时时间
    ajaxTimeout: 1000 * 60,

    // 页面路由前缀
    baseName: BASE_NAME || '',

    // 是否启用mock
    mock: MOCK || (NODE_ENV === 'development'),

    // 静态文件前缀
    publicUrl: PUBLIC_URL || '',

    // 运行环境
    nodeEnv: NODE_ENV || 'development',

};

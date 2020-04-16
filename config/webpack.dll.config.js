const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        vendor: [
            'axios',
            'axios-mock-adapter',
            'classnames',
            'mockjs',
            'moment',
            'nprogress',
            'redux',
            'uuid',
            'pubsub-js',
            'lodash',
            'qs',
        ],
        reactVendor: [
            'react',
            'react-router',
            'react-dom',
            'react-helmet',
            'react-redux',
            'react-router-dom',
            'react-sortable-hoc',
            'redux-actions',
            'redux-thunk',
            'prop-types',
            '@loadable/component',
            'antd',
            '@ant-design/icons',
        ],
    },
    // devtool: '#source-map',
    output: {
        path: path.join(__dirname, 'dll'),
        filename: '[name]_[hash].dll.js',
        library: '[name]_[hash]',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dll', '[name]-manifest.json'),
            name: '[name]_[hash]',
        }),
    ],
};

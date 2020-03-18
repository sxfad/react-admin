const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        vendor: [
            'antd',
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
            'react-color',
            'react-countup',
            'react-dnd',
            'react-dnd-html5-backend',
            'react-dom',
            'react-helmet',
            'react-highlight',
            'react-loadable',
            'react-markdown',
            'react-redux',
            'react-router-dom',
            'react-sortable-hoc',
            'redux-actions',
            'redux-thunk',
            'prop-types',
        ],
    },
    devtool: '#source-map',
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

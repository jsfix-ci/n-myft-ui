'use strict';

const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	withBabelPolyfills: false,
	withHeadCss: false,
	entry: {
		'./public/main-without-n-ui.js': './test/main.js',
		'./public/main.css': './test/main.scss'
	},
	includes: [
		__dirname
	],
	exclude: [/node_modules/]
});

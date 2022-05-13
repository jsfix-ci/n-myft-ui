const path = require('path');
const { PageKitJsPlugin } = require('@financial-times/dotcom-build-js');
const { PageKitSassPlugin } = require('@financial-times/dotcom-build-sass');
const { PageKitBowerResolvePlugin } = require('@financial-times/dotcom-build-bower-resolve');

module.exports = {
	plugins: [
		new PageKitJsPlugin(),
		new PageKitSassPlugin(),
		new PageKitBowerResolvePlugin()
	],
	entry: {
		scripts:  [
			'./myft/index.js',
			'./myft-common/index.js'
		],

		styles: './myft/test.scss'
	},
	output: {
		path: path.resolve(__dirname, 'public')
	},
};

const path = require('path');
const { PageKitJsPlugin } = require('@financial-times/dotcom-build-js');
const { PageKitSassPlugin } = require('@financial-times/dotcom-build-sass');

module.exports = {
	plugins: [
		new PageKitJsPlugin(),
		new PageKitSassPlugin({
			includePaths: [path.resolve('./node_modules/@financial-times')],
		}),
	],
	entry: {
		scripts: ['./myft/index.js', './myft-common/index.js'],
		styles: './myft/test.scss',
	},
	output: {
		path: path.resolve(__dirname, 'public')
	},
};

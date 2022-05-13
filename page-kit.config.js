const path = require('path');
const { PageKitJsPlugin } = require('@financial-times/dotcom-build-js');

module.exports = {
	plugins: [
		new PageKitJsPlugin(),
		require('@financial-times/dotcom-build-sass').plugin(),
		require('@financial-times/dotcom-build-bower-resolve').plugin()
	],
	settings: {
		build: {
			entry: {
				scripts:  [
					'./myft/index.js',
					'./myft-common/index.js'
				],
				styles: './myft/test.scss'
			},
			outputPath: path.resolve('./public')
		}
	}
};

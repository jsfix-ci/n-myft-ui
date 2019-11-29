const path = require('path');

module.exports = {
	plugins: [
		require('@financial-times/dotcom-build-js').plugin(),
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
				styles: './myft/main.scss'
			},
			outputPath: path.resolve('./public')
		}
	}
};

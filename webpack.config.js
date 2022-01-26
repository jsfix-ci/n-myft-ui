const path = require('path');

module.exports = {
	entry: './components/index.js',
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-react'
							]
						}
					}
				]
			}
		]
	},
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'dist/bundles'),
		filename: 'bundle.js',
		libraryTarget: 'umd',
		library: '@financial-times/n-myft-ui'
	}
};

import resolve from 'rollup-plugin-node-resolve';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';



export default {
	input: 'components/index.js',
	output: [
		{
			file: 'dist/bundles/bundle.js',
			format: 'es'
		},
		{
			file: 'dist/bundles/bundle.esm.js',
			format: 'esm',
			plugins: [
				getBabelOutputPlugin({
					presets: [
						[
							'@babel/preset-env',
							{
								targets: { node: '12' },
								exclude: ['transform-regenerator', 'transform-async-to-generator']
							}
						]
					]
				})
			]
		},
		{
			file: 'dist/bundles/bundle.cjs.js',
			format: 'cjs',
			plugins: [
				getBabelOutputPlugin({
					presets: [
						[
							'@babel/preset-env',
							{
								targets: { ie: '11', node: '12' },
								exclude: ['transform-regenerator', 'transform-async-to-generator']
							}
						]
					]
				})
			]
		},
		{
			file: 'dist/bundles/bundle.es5.js',
			format: 'esm'
		}
	],
	external: [
		'react',
		'react-dom',
	],
	plugins: [
		resolve({ extensions: ['.jsx', '.js'] }),
		commonjs(),
		babel({
			extensions: ['.jsx', '.js'],
			exclude: 'node_modules/**',
			presets: [
				'@babel/preset-env',
				'@babel/preset-react'
			],
			babelHelpers: 'runtime',
			plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-syntax-dynamic-import']
		})
	]
};

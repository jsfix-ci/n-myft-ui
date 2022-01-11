module.exports = {
	transform: {
		'.(js|jsx)': '@sucrase/jest-plugin',
	},
	testEnvironment: 'jest-environment-jsdom',
	modulePathIgnorePatterns: ['node_modules', 'bower_components'],
	testMatch: ['<rootDir>/components/**/*.test.js']
};

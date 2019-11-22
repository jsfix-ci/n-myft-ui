'use strict';

const {dependencies = {}} = require('../package');

if (Object.keys(dependencies).length > 0) {
	global.console.error('NPM dependencies included in bower only js project, please remove');
	process.exit(1);
}

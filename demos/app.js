require('sucrase/register')
const express = require('@financial-times/n-internal-tool');
const chalk = require('chalk');
const errorHighlight = chalk.bold.red;
const highlight = chalk.bold.green;
const { PageKitReactJSX } = require('@financial-times/dotcom-server-react-jsx');
var fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const demoJSX = require('./templates/demo').default;
const demoLayoutSource = fs.readFileSync(path.join(__dirname, './templates/demo-layout.html'),'utf8').toString();

const fixtures = {
	followButton: require('./fixtures/follow-button'),
	saveButton: require('./fixtures/save-button'),
	collections: require('./fixtures/collections'),
	conceptList: require('./fixtures/concept-list'),
	pinButton: require('./fixtures/pin-button'),
	instantAlert: require('./fixtures/instant-alert')
};

const app = module.exports = nExpress({
	name: 'public',
	systemCode: 'n-myft-ui-demo',
	withFlags: true,
	withConsent: false,
	withServiceMetrics: false,
	withAnonMiddleware: false,
	hasHeadCss: false,
	partialsDirectory: process.cwd(),
	directory: process.cwd(),
	demo: true,
	s3o: false,
	helpers: {
		x: xHandlebars()
	},
});

app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', '.html');

app.engine('.html', new PageKitHandlebars({
	cache: false,
	handlebars,
	helpers: {
		...helpers
	}
}).engine);

app.use('/public', nExpress.static(path.join(__dirname, '../public'), { redirect: false }));

const jsxRenderer = (new PageKitReactJSX({ includeDoctype: false }));

app.get('/', (req, res) => {
	res.render('demo', Object.assign({
		title: 'n-myft-ui demo',
		flags: {
			myFtApi: true,
			myFtApiWrite: true
		}
	}, fixtures));
});

app.get('/demo-jsx', async (req, res) => {
	let demo = await jsxRenderer.render(demoJSX, Object.assign({
		title: 'n-myft-ui demo',
		flags: {
			myFtApi: true,
			myFtApiWrite: true
		}
	}, fixtures));

	var template = handlebars.compile(demoLayoutSource);
	var result = template({body: demo});

	res.send(result);
});


function runPa11yTests () {
	const spawn = require('child_process').spawn;
	const pa11y = spawn('pa11y-ci');

	pa11y.stdout.on('data', (data) => {
		console.log(highlight(`${data}`)); //eslint-disable-line
	});

	pa11y.stderr.on('data', (error) => {
		console.log(errorHighlight(`${error}`)); //eslint-disable-line
	});

	pa11y.on('close', (code) => {
		process.exit(code);
	});
}

const listen = app.listen(5005);

if (process.env.PA11Y === 'true') {
	listen.then(runPa11yTests);
}

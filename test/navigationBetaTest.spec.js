/* global expect */

const navigationBetaTest = require('../myft/ui/navigationBetaTest');
import { uuid } from 'n-ui-foundations';

describe('navigationBetaTest', () => {

	const betaFrontPageUrl = 'https://www.ft.com/page/home';

	const createAnchorElement = (href) => {
		const anchor = document.createElement('a');
		const linkText = document.createTextNode('linkText');
		anchor.appendChild(linkText);
		anchor.title = 'title';
		anchor.href = href;
		anchor.id = `betaFrontPage-${uuid()}`;
		document.body.appendChild(anchor);

		return anchor;
	};

	const removeElements = (ids) => {
		ids.forEach(id => {
			const element = document.getElementById(id);
			element.parentNode.removeChild(element);
		});
	};

	const optsFactory = (includeFrontPageBetaFlag = true, accessViaFlags = true) => {
		if (accessViaFlags) {
			return includeFrontPageBetaFlag ?
				{
					flags:
						{
							get: () => { return 'on'; }
						}
				} :
				{
					flags :
						{
							get: () => { return undefined; }
						}
				};
		}

		return includeFrontPageBetaFlag ?
			{
				flags:
					{
						betaHomePage : true
					}
			} :
			{
				flags : {}
			};
	};

	const baseOverrideTest = (url, expectedUrl = betaFrontPageUrl) => {
		// Arrange
		const anchor = createAnchorElement(url);

		const opts = optsFactory();

		// Act
		navigationBetaTest(opts);

		// Assert
		expect(document.getElementById(anchor.id).href).to.equal(expectedUrl);

		// Clean-up
		removeElements([anchor.id]);
	};

	it('Should override secure absolute links to the FT homepage', () => {
		baseOverrideTest('https://www.ft.com/');
		baseOverrideTest('https://www.ft.com');
	});

	it('Should override insecure absolute links to the FT homepage', () => {
		baseOverrideTest('http://www.ft.com/');
		baseOverrideTest('http://www.ft.com');
	});

	it('Should not override links to FT pages', () => {
		baseOverrideTest('http://www.ft.com/myaccount', 'http://www.ft.com/myaccount');
		baseOverrideTest('https://www.ft.com/tour/myft','https://www.ft.com/tour/myft');
	});

	it('Should override relative links', () => {
		baseOverrideTest('/');
	});

	it('Should override absolute links with search param', () => {
		baseOverrideTest('https://www.ft.com/?edition=uk', `${betaFrontPageUrl}?edition=uk`);
		baseOverrideTest('https://www.ft.com?edition=uk', `${betaFrontPageUrl}?edition=uk`);
		baseOverrideTest('http://www.ft.com/?edition=uk', `${betaFrontPageUrl}?edition=uk`);
		baseOverrideTest('http://www.ft.com?edition=uk', `${betaFrontPageUrl}?edition=uk`);
	});

	const baseOverrideAllLinksTest = (opts) => {
		// Arrange
		const relativeLink = createAnchorElement('/');
		const absoluteSecureLink = createAnchorElement('https://www.ft.com/');
		const absoluteInsecureLink = createAnchorElement('http://www.ft.com/');
		const searchParamLink = createAnchorElement('https://www.ft.com/?edition=uk');

		// Act
		navigationBetaTest(opts);

		// Assert
		expect(document.getElementById(relativeLink.id).href).to.equal(betaFrontPageUrl);
		expect(document.getElementById(absoluteSecureLink.id).href).to.equal(betaFrontPageUrl);
		expect(document.getElementById(absoluteInsecureLink.id).href).to.equal(betaFrontPageUrl);
		expect(document.getElementById(searchParamLink.id).href).to.equal(`${betaFrontPageUrl}?edition=uk`);

		// Clean-up
		removeElements([relativeLink.id, absoluteSecureLink.id, absoluteInsecureLink.id, searchParamLink.id]);
		;};

	it('Should override all types of expected links', () => {
		const opts = optsFactory();

		baseOverrideAllLinksTest(opts);
	});

	it('Should override all types of expected links when accessing flag through property', () => {
		const opts = optsFactory(true, false);

		baseOverrideAllLinksTest(opts);
	});

	const baseShouldNotOverrideTest = (opts) => {
		// Arrange
		const anchor = createAnchorElement('/');
		const initialHref = anchor.href;

		// Act
		navigationBetaTest(opts);

		// Assert
		expect(document.getElementById(anchor.id).href).to.equal(initialHref);

		// Clean-up
		removeElements([anchor.id]);
	};

	it('Should not override links if betaHomePage flag not set', () => {
		const opts = optsFactory(false);

		baseShouldNotOverrideTest(opts);
	});
});

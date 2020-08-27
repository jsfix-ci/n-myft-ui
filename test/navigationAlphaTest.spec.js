/* global expect */

const navigationAlphaTest = require('../myft/ui/navigationAlphaTest');
import { uuid } from 'n-ui-foundations';

describe('navigationAlphaTest', () => {

	const alphaFrontPageUrl = 'https://ft-next-alpha-front-page-eu.herokuapp.com/next-alpha-front-page';

	const createAnchorElement = (href) => {
		const anchor = document.createElement('a');
		const linkText = document.createTextNode('linkText');
		anchor.appendChild(linkText);
		anchor.title = 'title';
		anchor.href = href;
		anchor.id = `alphaFrontPage-${uuid()}`;
		document.body.appendChild(anchor);

		return anchor;
	};

	const removeElements = (ids) => {
		ids.forEach(id => {
			const element = document.getElementById(id);
			element.parentNode.removeChild(element);
		});
	};

	const optsFactory = (includeFrontPageAlphaFlag = true) => {
		return includeFrontPageAlphaFlag ?
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
	};

	const baseOverrideTest = (url, expectedUrl = alphaFrontPageUrl) => {
		// Arrange
		const anchor = createAnchorElement(url);

		const opts = optsFactory();

		// Act
		navigationAlphaTest(opts);

		// Assert
		expect(document.getElementById(anchor.id).href).to.equal(expectedUrl);

		// Clean-up
		removeElements([anchor.id]);
	};

	it('Should override secure absolute links', () => {
		baseOverrideTest('https://www.ft.com/content/a5676e20-5c92-47f3-a76c-11f9761121f5');
	});

	it('Should override insecure absolute links', () => {
		baseOverrideTest('http://www.ft.com/content/a5676e20-5c92-47f3-a76c-11f9761121f5');
	});

	it('Should override relative links', () => {
		baseOverrideTest('/');
	});

	it('Should override absolute links with search param', () => {
		baseOverrideTest('https://www.ft.com/?edition=uk', `${alphaFrontPageUrl}?edition=uk`);
	});

	it('Should override all types of expected links', () => {
		// Arrange
		const relativeLink = createAnchorElement('/');
		const absoluteSecureLink = createAnchorElement('https://www.ft.com/content/a5676e20-5c92-47f3-a76c-11f9761121f5');
		const absoluteInsecureLink = createAnchorElement('http://www.ft.com/content/a5676e20-5c92-47f3-a76c-11f9761121f5');
		const searchParamLink = createAnchorElement('https://www.ft.com/?edition=uk');

		const opts = optsFactory();

		// Act
		navigationAlphaTest(opts);

		// Assert
		expect(document.getElementById(relativeLink.id).href).to.equal(alphaFrontPageUrl);
		expect(document.getElementById(absoluteSecureLink.id).href).to.equal(alphaFrontPageUrl);
		expect(document.getElementById(absoluteInsecureLink.id).href).to.equal(alphaFrontPageUrl);
		expect(document.getElementById(searchParamLink.id).href).to.equal(`${alphaFrontPageUrl}?edition=uk`);

		// Clean-up
		removeElements([relativeLink.id, absoluteSecureLink.id, absoluteInsecureLink.id, searchParamLink.id]);
	});

	const baseShouldNotOverrideTest = (opts) => {
		// Arrange
		const anchor = createAnchorElement('/');
		const initialHref = anchor.href;

		// Act
		navigationAlphaTest(opts);

		// Assert
		expect(document.getElementById(anchor.id).href).to.equal(initialHref);

		// Clean-up
		removeElements([anchor.id]);
	};

	it('Should override not override links if frontPageAlpha flag not set', () => {
		const opts = optsFactory(false);

		baseShouldNotOverrideTest(opts);
	});
});

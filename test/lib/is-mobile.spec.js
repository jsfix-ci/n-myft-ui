const expect = require('chai').expect;
const isMobile = require('../../myft/ui/lib/is-mobile');

/* global viewport */

describe('IsMobile', function () {
	afterEach(() => {
		viewport.reset();
	});

	it('detects a desktop device', () => {
		viewport.set(981, 800);
		expect(isMobile()).to.be.false;
	});

	it('detects a mobile device', () => {
		viewport.set(979, 800);
		expect(isMobile()).to.be.true;
	});
});

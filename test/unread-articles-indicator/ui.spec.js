/* global expect */
import sinon from 'sinon';
import * as ui from '../../components/unread-articles-indicator/ui';

describe('unread stories indicator - ui', () => {

	describe('createIndicators', () => {
		let containers;
		let options;
		const mockContainer = document.createElement('div');

		mockContainer.classList.add('o-header__top-link--myft');

		beforeEach(() => {
			containers = [0, 1].map(() => {
				const cont = mockContainer.cloneNode(false);

				document.body.appendChild(cont);

				return cont;
			});
		});

		afterEach(() => {
			containers.forEach(container => container.remove());
		});

		describe('createIndicators', () => {
			beforeEach(() => {
				ui.createIndicators(containers);
			});

			it('should set a class on each container', () => {
				containers.forEach(container => {
					expect(container.classList.contains('myft__indicator-container')).to.equal(true);
				});
			});

			it('should add a count element to each container', () => {
				containers.forEach(container => {
					const els = container.querySelectorAll('.myft__indicator');

					expect(els.length).to.equal(1);
				});
			});
		});

		describe('setCount', () => {
			beforeEach(() => {
				ui.createIndicators(containers);
				ui.setCount(3);
			});

			it('should show the count in the count element', () => {
				containers.forEach(container => {
					const el = container.querySelector('.myft__indicator');

					expect(el.innerText).to.equal('3');
				});
			});

			it('should hide the indicator when count is zero', () => {
				ui.setCount(0);
				containers.forEach(container => {
					const el = container.querySelector('.myft__indicator');

					expect(el.classList.contains('myft__indicator--hidden')).to.equal(true);
				});
			});

			it('should set a single digit class when count is less than 10', () => {
				ui.setCount(9);
				containers.forEach(container => {
					const el = container.querySelector('.myft__indicator');

					expect(el.classList.contains('myft__indicator--hidden')).to.equal(false);
					expect(el.classList.contains('myft__indicator--single-digit')).to.equal(true);
				});
			});

			it('should remove a single digit class when count is more than 10', () => {
				ui.setCount(10);
				containers.forEach(container => {
					const el = container.querySelector('.myft__indicator');

					expect(el.classList.contains('myft__indicator--hidden')).to.equal(false);
					expect(el.classList.contains('myft__indicator--single-digit')).to.equal(false);
				});
			});

			it('should not display number when count is more than 200', () => {
				ui.setCount(200);
				containers.forEach(container => {
					const el = container.querySelector('.myft__indicator');

					expect(el.classList.contains('myft__indicator--hidden')).to.equal(false);
					expect(el.classList.contains('myft__indicator--single-digit')).to.equal(false);
					expect(el.innerText).to.equal('');
				});
			});
		});

		describe('click handling', () => {
			beforeEach(() => {
				options = {
					onClick: sinon.stub()
				};
				ui.createIndicators(containers, options);
				ui.setCount(3);
			});

			describe('given an indicator is clicked', () => {
				beforeEach(() => {
					containers[0].click();
				});

				it('should set the indicator dismissed time', () => {
					expect(options.onClick.called).to.equal(true);
				});
			});
		});
	});
});

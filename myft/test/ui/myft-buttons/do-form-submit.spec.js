/* global expect sinon*/

describe.skip('Do form submit', () => {

	let doFormSubmit;
	let container;

	const stubs = {
		myFtClientAddStub: sinon.stub(),
		myFtClientRemoveStub: sinon.stub(),
	}

	beforeEach(() => {
		doFormSubmit = require('inject-loader!../../../ui/myft-buttons/do-form-submit')({
			'next-myft-client': {
				add: stubs.myFtClientAddStub,
				add: stubs.myFtClientRemoveStub
			}
		})

		container = document.createElement('div');
	})

	it('should not do anything if the button is disabled', () => {
		container.innerHTML = `
			<form>
				<button disabled>
				</button>
			</form>
		`;

		doFormSubmit(container.querySelector('form'));

		expect(stubs.myFtClientAddStub).to.have.not.been.called;
		expect(stubs.myFtClientRemoveStub).to.have.not.been.called;
	});

	it('should set the button to be disabled (until later when the operation completes)', () => {
		container.innerHTML = `
			<form>
				<button>
				</button>
			</form>
		`;

		doFormSubmit(container.querySelector('form'));

		const theButton = container.querySelector('button');
		expect(theButton.hasAttribute('disabled')).to.be.true;
	});

	it.skip('should do an add if the button is not already pressed', () => {
		throw new Error('todo');
	});

	it.skip('should do a remove if the button is already pressed', () => {
		throw new Error('todo');
	});
});

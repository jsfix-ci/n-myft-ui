import { broadcast } from 'n-ui-foundations';

class Feedback {
	constructor (element, options = {}) {
		this.options = options;

		this.element = element;
		if (!this.element) {
			throw new Error('No element passed to Feedback');
		}

		this.featureName = element.dataset.feedbackFeature;
		if (!this.featureName) {
			throw new Error('Feedback element does not have a feedback-feature attribute');
		}

		this.responders = this.element.querySelectorAll('.js-feedback__responder');
		if (this.responders.length) {
			this.addResponderListeners();
		} else {
			throw new Error('Feedback element does not have any responders');
		}
	}

	addResponderListeners () {
		this.responders.forEach(responder => {
			responder.addEventListener('click', () => {
				const data = {
					category: this.featureName,
					action: 'feedback',
					question: responder.dataset.question,
					answer: responder.dataset.answer
				};

				broadcast('oTracking.event', data);

				if (typeof this.options.onRespond === 'function') {
					this.options.onRespond(responder);
				}
			});
		});
	}
}

module.exports = Feedback;

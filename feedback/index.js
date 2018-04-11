import { broadcast } from 'n-ui-foundations';

class Feedback {
	constructor (element) {
		this.element = element;
		if (!this.element) {
			throw new Error('No element passed to Feedback');
		}
		this.featureName = element.dataset.feedbackFeature;
		if (!this.featureName) {
			throw new Error('Feedback element does not have a feedback-feature attribute');
		}

		this.addResponderListeners();
	}

	addResponderListeners () {
		const responders = this.element.querySelectorAll('.js-feedback__responder');

		responders.forEach(responder => {
			responder.addEventListener('click', () => {
				const data = {
					category: this.featureName,
					action: 'feedback',
					question: responder.dataset.question,
					answer: responder.dataset.answer
				};

				broadcast('oTracking.event', data);
			});
		});
	}
}

module.exports = Feedback;

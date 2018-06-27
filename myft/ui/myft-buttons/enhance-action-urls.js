

export default function (context = document) {
	['follow', 'save', 'instant']
		.forEach(type => {
			Array.from(context.querySelectorAll(`form.n-myft-ui-form--${type}`))
				.forEach(form => {
					form.setAttribute('method', 'POST');
					form.setAttribute('action', form.getAttribute('data-js-action'));
				});
		});
}

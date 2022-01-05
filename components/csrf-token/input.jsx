import React from 'react';

export default function CsrfToken ({ cacheablePersonalisedUrl, csrfToken }) {

	let inputProps = {};

	if (cacheablePersonalisedUrl) {
		inputProps = {
			...inputProps,
			'data-myft-csrf-token': csrfToken
		};
	}

	if(csrfToken) {
		inputProps.value = csrfToken;
	}

	return (
		<input
			{...inputProps}
			type="hidden"
			name="token"
		/>
	);

}

import React from 'react';

export default function CsrfToken ({ cacheablePersonalisedUrl, csrfToken }) {

	let inputProps = {};

	if (cacheablePersonalisedUrl) {
		inputProps.value = csrfToken;
	}

	return (
		<input
			data-myft-csrf-token
			{...inputProps}
			type="hidden"
			name="token"
		/>
	);

}

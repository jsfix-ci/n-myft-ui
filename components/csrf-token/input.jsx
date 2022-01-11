import React from 'react';

function CsrfToken ({ cacheablePersonalisedUrl, csrfToken }) {

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

export {
	CsrfToken
};
export default CsrfToken;
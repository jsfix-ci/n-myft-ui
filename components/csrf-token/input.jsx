import React from 'react';


export default function Csrf_Token({ cacheablePersonalisedUrl, csrfToken }) {

	let inputProps = {};

	if (cacheablePersonalisedUrl) {
		inputProps = {
			...inputProps,
			csrfToken
		};
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

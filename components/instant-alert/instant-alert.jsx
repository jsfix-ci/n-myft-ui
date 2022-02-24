import React, { Fragment } from 'react';
import CsrfToken from '../csrf-token/input';

/**
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {Object} props.flags
 * @param {booelan} props.hideButtonText
 * @param {string} props.conceptId
 * @param {string} props.name
 * @param {string} props.extraClasses
 * @param {boolean} props.directType
 * @param {string} props.cacheablePersonalisedUrl
 * @param {string} props.hasInstantAlert
 * @param {string} props.buttonText
 * @param {string} props.alternateText
 * @param {string} props.variant
 * @param {string} props.size
 */
export default function InstantAlert (props) {

	const {
		hasInstantAlert,
		cacheablePersonalisedUrl,
		name,
		alternateText,
		buttonText,
		conceptId,
		variant,
		size,
		flags,
		hideButtonText,
		directType,
		extraClasses
	} = props;

	const generateButtonProps = () => {

		let buttonProps = {
			'aria-pressed': `${Boolean(hasInstantAlert) && Boolean(cacheablePersonalisedUrl)}`,
			'aria-label': `Get instant alerts for ${name}`,
			'data-alternate-label': `Stop instant alerts for ${name}`,
			'data-alternate-text': alternateText? alternateText: (buttonText ? buttonText : 'Instant alerts'),
			'data-concept-id': conceptId, // duplicated here for tracking
			'data-trackable': 'instant',
			title: `Get instant alerts for ${name}`,
			value: hasInstantAlert ? false : true,
			type: 'submit',
			name: '_rel.instant',
			className: `n-myft-ui__button n-myft-ui__button--instant n-myft-ui__button--instant-light${variant ? ` n-myft-ui__button--${variant}` : ''}${size ? ` n-myft-ui__button--${size}` : ''}`
		};
		return buttonProps;
	}

	return (
		<Fragment>
			{flags.myFtApiWrite &&
				<form className={`n-myft-ui n-myft-ui--instant${hideButtonText ? ' n-myft-ui--instant--hide-text' : ''}${extraClasses ? ` ${extraClasses}` : ''}`}
					method="GET"
					data-myft-ui="instant"
					data-concept-id={conceptId}
					action={`/myft/add/${conceptId}?instant=true`}
					data-js-action={`/__myft/api/core/followed/concept/${conceptId}?method=put`}>
					<CsrfToken />
					<input type="hidden" value={name} name="name" />
					<input type="hidden" value={directType || 'http://www.ft.com/ontology/concept/Concept'} name="directType" />
					<button {...generateButtonProps()}>{buttonText ? buttonText : 'Instant alerts'}</button>
				</form>}
		</Fragment>
	);

}

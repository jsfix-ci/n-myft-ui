import React from 'react';
import Csrf_Token from '../csrf-token/input';


function generateFormProps (props) {
	let generatedProps = {};

	const {
		collectionName,
		followPlusDigestEmail,
		conceptId,
		setFollowButtonStateToSelected,
		cacheablePersonalisedUrl
	} = props;

	if (collectionName) {
		generatedProps['data-myft-tracking'] = `collectionName=${collectionName}`;
	}

	if(followPlusDigestEmail) {
		generatedProps['action'] = `/__myft/api/core/follow-plus-digest-email/${conceptId}?method=put`;
		generatedProps['data-myft-ui-variant'] = 'followPlusDigestEmail';
	} else {
		if(setFollowButtonStateToSelected && cacheablePersonalisedUrl) {
			generatedProps['action'] = `/myft/remove/${conceptId}`;
			generatedProps['data-js-action'] = `/__myft/api/core/followed/concept/${conceptId}?method=delete`;
		} else {
			generatedProps['action'] = `/myft/add/${conceptId}`;
			generatedProps['data-js-action'] = `/__myft/api/core/followed/concept/${conceptId}?method=put`;
		}
	}

	return generatedProps;

}

function generateButtonProps (props) {

	const {
		cacheablePersonalisedUrl,
		setFollowButtonStateToSelected,
		name,
		buttonText,
		variant,
		conceptId,
		alternateText,
		followPlusDigestEmail
	} = props;

	let generatedProps = {
		'data-concept-id': conceptId,
		'n-myft-follow-button': true,
		'data-trackable': 'follow',
		type: 'submit'
	};

	if (cacheablePersonalisedUrl && setFollowButtonStateToSelected) {
		generatedProps['aria-label'] = `Remove ${name} from myFT`;
		generatedProps['title'] = `Remove ${name} from myFT`
		generatedProps['data-alternate-label'] = `Add ${name} to myFT`;
		generatedProps['aria-pressed'] = true;

		if(alternateText) {
			generatedProps['data-alternate-text'] = alternateText;
		} else {
			if(buttonText) {
				generatedProps['data-alternate-text'] = buttonText;
			} else {
				generatedProps['data-alternate-text'] = 'Add to myFT';
			}
		}
	} else {
		generatedProps['aria-pressed'] = false;
		generatedProps['aria-label'] = `Add ${name} to myFT`;
		generatedProps['title'] = `Add ${name} to myFT`;
		generatedProps['data-alternate-label'] = `Remove ${name} from myFT`;
		if (alternateText) {
			generatedProps['data-alternate-text'] = alternateText;
		} else {
			if (buttonText) {
				generatedProps['data-alternate-text'] = buttonText;
			} else {
				generatedProps['data-alternate-text'] = "Added";
			}
		}
	}

	if(variant) {
		generatedProps[`n-myft-follow-button--${variant}`] = true;
	}

	if(followPlusDigestEmail) {
		generatedProps['data-trackable-context-messaging'] = 'add-to-myft-plus-digest-button';
	}

	return generatedProps;
}

function getButtonText (props) {

	const {
		buttonText,
		setFollowButtonStateToSelected,
		cacheablePersonalisedUrl
	} = props;
	let outputText;

	if(buttonText) {
		outputText = buttonText;
	} else {
		if(setFollowButtonStateToSelected && cacheablePersonalisedUrl) {
			outputText = 'Added';
		} else {
			outputText = 'Add to myFT';
		}
	}

	return outputText;
}


/**
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {Object} props.flags
 * @param {string} props.extraClasses
 * @param {string} props.conceptId
 * @param {string} props.variant
 * @param {string} props.buttonText
 * @param {*} props.setFollowButtonStateToSelected
 * @param {string} props.cacheablePersonalisedUrl
 * @param {string} props.alternateText
 * @param {*} props.followPlusDigestEmail
 * @param {string} props.collectionName
 */
export default function FollowButton (props) {

	const {
		name,
		flags,
		extraClasses,
		conceptId,
		variant,
	} = props;

	const formProps = generateFormProps(props);
	const buttonProps = generateButtonProps(props);

	return (
		<>
			{flags.myFtApiWrite && <form
				className={`n-myft-ui n-myft-ui--follow ${extraClasses || ''}`}
				method="GET"
				data-myft-ui="follow"
				data-concept-id={conceptId}
				{...formProps}>
				<Csrf_Token cacheablePersonalisedUrl={props.cacheablePersonalisedUrl} csrfToken={props.csrfToken} />
				<div
					className="n-myft-ui__announcement o-normalise-visually-hidden"
					aria-live="assertive"
					data-pressed-text={`Now following ${name}.`}
					data-unpressed-text={`No longer following ${name}.`}
				></div>
				<button
					{...buttonProps}
					className={[`n-myft-follow-button ${variant? `n-myft-follow-button--${variant}`: ''}`]}>
					{getButtonText(props)}
				</button>
			</form>}
		</>
	);

}

import React, { Fragment } from 'react';
import CsrfToken from '../csrf-token/input';

const ButtonContent = ({ saveButtonWithIcon, buttonText, isSaved, appIsStreamPage }) => {

	return (<Fragment>
		{
			saveButtonWithIcon &&
			<span className="save-button-with-icon-copy" data-variant-label>
				{buttonText && buttonText}
				{!buttonText && (isSaved ? 'Saved' : 'Save')}
			</span>
		}

		{
			!saveButtonWithIcon &&
			<Fragment>
				{buttonText && buttonText}
				{!buttonText &&
					<Fragment>
						{
							appIsStreamPage !== true &&
							<Fragment>
								<span className="save-button-longer-copy" data-variant-label>
									{isSaved ? 'Saved ' : 'Save '}
								</span>
								<span className="n-myft-ui__button--viewport-large" aria-hidden="true">to myFT</span>
							</Fragment>
						}

						{
							appIsStreamPage === true && <span>{isSaved ? 'Saved' : 'Save'}</span>
						}
					</Fragment>
				}
			</Fragment>
		}
	</Fragment>);
}
export default function SaveForLater ({ flags, contentId, title, variant, trackableId, isSaved, appIsStreamPage, alternateText, saveButtonWithIcon, buttonText, csrfToken, cacheablePersonalisedUrl }) {

	const { myFtApiWrite } = flags;

	const generateSubmitButtonProps = () => {
		let props = {
			type: 'submit',
			'data-trackable': trackableId ? trackableId : 'save-for-later',
			'data-text-variant': appIsStreamPage !== true ? 'save-button-with-icon-copy' : 'save-button-longer-copy',
			'data-content-id': contentId,
			className: saveButtonWithIcon ? 'n-myft-ui__save-button-with-icon' : `n-myft-ui__button ${variant ? `n-myft-ui__button--${variant}` : ''}`
		};

		if (isSaved) {
			let titleText = `${title ? `${title} is` : ''} saved to myFT`;
			props['title'] = title;
			props['aria-label'] = titleText;
			props['data-alternate-label'] = title ? `Save ${title} to myFT for later` : 'Save this article to myFT for later';
			props['aria-pressed'] = true;
		} else {
			let titleText = title ? `Save ${title} to myFT for later` : 'Save this article to myFT for later';
			props['title'] = titleText;
			props['aria-label'] = titleText;
			props['data-alternate-label'] = `${title ? `${title} is` : ''} saved to myFT`;
			props['aria-pressed'] = false;
		}

		if (alternateText) {
			props['data-alternate-text'] = alternateText;
		} else if (isSaved) {
			props['data-alternate-text'] = 'Save ';
		} else {
			props['data-alternate-text'] = 'Saved ';
		}

		return props;
	}


	return (
		<Fragment>
			{myFtApiWrite &&
				<form className="n-myft-ui n-myft-ui--save" method="GET"
					data-content-id={contentId}
					data-myft-ui="saved"
					action={`/myft/save/${contentId}`}
					data-js-action={`/__myft/api/core/saved/content/${contentId}?method=put`}>
					<CsrfToken csrfToken={csrfToken} cacheablePersonalisedUrl={cacheablePersonalisedUrl} />

					<div
						className="n-myft-ui__announcement o-normalise-visually-hidden"
						aria-live="assertive"
						data-pressed-text="Article saved in My FT."
						data-unpressed-text="Removed article from My FT."
					></div>
					<button {...generateSubmitButtonProps()}>
						<ButtonContent buttonText={buttonText} saveButtonWithIcon={saveButtonWithIcon} isSaved={isSaved} appIsStreamPage={appIsStreamPage}/>
					</button>
				</form>
			}
		</Fragment>

	)
}

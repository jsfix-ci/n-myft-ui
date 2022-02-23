import React, { Fragment } from 'react';
import FollowButton from '../follow-button/follow-button';

export default function ConceptList ({ flags, concepts, contentType, conceptListTitle, trackable, csrfToken, cacheablePersonalisedUrl }) {

	const {
		myFtApi,
		myFtApiWrite
	} = flags;

	const generateTrackableProps = (primary, secondary) => {
		return {
			'data-trackable': primary ? primary : secondary
		}
	}

	const shouldDisplay = () => {
		if(myFtApi && myFtApiWrite && Array.isArray(concepts) && concepts.length) {
			return true
		}

		return false;
	}


	return (

		<Fragment>
			{shouldDisplay() &&
				<div
					className='concept-list'
					{...generateTrackableProps(trackable, 'concept-list')}>
					{
						(contentType || conceptListTitle) &&
						<h2 className='concept-list__title'>
							{conceptListTitle ? conceptListTitle : `Follow the topics in this ${contentType}`}
						</h2>
					}
					<ul className='concept-list__list'>
						{concepts.map((concept, index) => {
							const {
								relativeUrl,
								url,
								conceptTrackable,
								prefLabel,
								id
							} = concept;
							return (
								<li key={index} className='concept-list__list-item'>
									{/* The relativeUrl and url point to the same resource. The url is the base path + the relative url.
									Example: browser_path = https://ft.com, relativeUrl = /capital-markets then url = https://www.ft.com/capital-markets.

									Note: we don't need to compute these urls in the business logic of these components as they're passed in as props.

									This note is just an explanation for why relativeUrl has preference over url.*/}
									<a
										href={relativeUrl || url}
										{...generateTrackableProps(conceptTrackable, 'concept')}
										className='concept-list__concept'>
										{prefLabel}
									</a>
									<FollowButton csrfToken={csrfToken} cacheablePersonalisedUrl={cacheablePersonalisedUrl} conceptId={id} name={prefLabel} flags={flags} />
								</li>
							)
						})}
					</ul>
				</div>}
		</Fragment>)
}

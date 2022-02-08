import React, { Fragment } from 'react';
import FollowButton from '../follow-button/follow-button';

export default function ConceptList ({ flags, concepts, contentType, conceptListTitle, trackable }) {

	const {
		myFtApi,
		myFtApiWrite
	} = flags;

	const generateTrackableProps = (primary, seconday) => {
		return {
			'data-trackable': primary ? primary : seconday
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
									<a
										href={relativeUrl || url}
										{...generateTrackableProps(conceptTrackable, 'concept')}
										className='concept-list__concept'>
										{prefLabel}
									</a>
									<FollowButton conceptId={id} name={prefLabel} flags={flags} />
								</li>
							)
						})}
					</ul>
				</div>}
		</Fragment>)
}

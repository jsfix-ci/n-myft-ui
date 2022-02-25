import React from 'react';
import CsrfToken from '../csrf-token/input';
import FollowButton from '../follow-button/follow-button';

export default function Collections ({ title, liteStyle, flags, collectionName, trackable, concepts = [], csrfToken, cacheablePersonalisedUrl }) {
	const getLiteStyleModifier = () => liteStyle ? 'lite' : 'regular';
	let formProps = {
		method: 'POST',
		action: '#',
		'data-myft-ui': 'follow',
		'data-concept-id': concepts.map(concept => concept.id).join(',')
	};

	if (collectionName) {
		formProps['data-myft-tracking'] = collectionName;
	}

	return (
		<section
			className={`collection collection--${getLiteStyleModifier()}`}
			data-trackable={trackable ? trackable : 'collection'}>
			<header className={`collection__header collection__header--${getLiteStyleModifier()}`}>
				<h2 className={`collection__title collection__title--${getLiteStyleModifier()}`}>
					{title}
				</h2>
			</header>
			<ul className="collection__concepts">
				{concepts && concepts.map((concept, index) =>
					<li className="collection__concept" key={index}>
						<FollowButton cacheablePersonalisedUrl={cacheablePersonalisedUrl} csrfToken={csrfToken} variant={liteStyle ? 'primary' : 'inverse'} buttonText={concept.name} flags={flags} collectionName={collectionName} />
					</li>)
				}
			</ul>

			<div className="collection__meta">
				<form
					{...formProps}
					className="n-myft-ui n-myft-ui--follow n-ui-hide-core collection-follow-all">
					<input
						type="hidden"
						name="directType"
						value={concepts.map(concept => concept.directType).join(',')}
					/>
					<CsrfToken csrfToken={csrfToken} cacheablePersonalisedUrl={cacheablePersonalisedUrl} />
					<input
						type="hidden"
						name="name"
						value={concepts.map(concept => concept.name).join(',')}
					/>
					<button
						type="submit"
						aria-pressed="false"
						className={`collection-follow-all__button collection-follow-all__button--${getLiteStyleModifier()}`}
						data-trackable="follow all"
						data-concept-id={concepts.map(concept => concept.id).join(',')}
						aria-label={`Add all topics in the ${title} collection to my F T`}
						data-alternate-label={`Remove all topics in the ${title} collection from my F T`}
						data-alternate-text="Added"
						title={`Add all topics in the ${title} collection to my F T`}>
						Add all to myFT
					</button>
				</form>
			</div>
		</section>

	)

}

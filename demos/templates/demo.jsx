import React from 'react';
import FollowButton from '../../components/follow-button/follow-button';
import ConceptList from '../../components/concept-list/concept-list';

export default function Demo (props) {

	const {
		title,
		flags,
		followButton,
		conceptList
	} = props;

	const followButtonProps = { ...followButton, flags };

	return (
		<div className="o-grid-container o-grid-container--snappy demo-container">
			<h1>{title}</h1>

			<section
				id="follow-button"
				className="demo-section">
				<div className="o-grid-row">
					<div data-o-grid-colspan="12">
						<h2
							className="demo-section__title">
							Follow button
						</h2>
						<FollowButton {...followButtonProps} />


						<h2
							className="demo-section__title">
							x-dash follow button
						</h2>

						<FollowButton {...followButtonProps} buttonText={followButton.name} />

					</div>
				</div>
			</section>

			<section
				id="topic-list"
				className="demo-section">
				<div className="o-grid-row">
					<div data-o-grid-colspan="12">
						<h2 className="demo-section__title">
							Topic list
						</h2>

						<p className="demo-section__description">
							A list of topics to follow
						</p>
					</div>

					{
						conceptList && conceptList.map((list, index) =>
							<div key={index} data-o-grid-colspan="3">
								<ConceptList {...list} flags={flags} />
							</div>)
					}

				</div>
			</section>
		</div>
	)
}
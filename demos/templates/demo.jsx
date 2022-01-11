import React from 'react';
import FollowButton from '../../components/follow-button/follow-button';

export default function Demo (props) {

	const {
		title,
		flags,
		followButton,
	} = props;

	const followButtonProps = {...followButton, flags};

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
					</div>
				</div>
			</section>
		</div>
	)
}
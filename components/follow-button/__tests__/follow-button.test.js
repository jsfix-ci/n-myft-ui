import React from 'react';
import FollowButton from '../follow-button';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const props = {
	flags: {
		myFtApi: true,
		myFtApiWrite: true
	},
	conceptId: '0000-000000-00000-0000',
	name: 'Follow button'
};

describe('Follow button', () => {

	test('It renders default button', async () => {
		render(<FollowButton {...props} />);
		expect(await screen.findByText('Add to myFT')).toBeTruthy();
	});

	test('It renders a variant', async () => {
		const { container } = render(<FollowButton {...props} variant={'standard'} />);
		expect(container.getElementsByClassName('n-myft-follow-button--standard')).toHaveLength(1);
	});

	test('It renders follow button form', async () => {
		const { container } = render(<FollowButton {...props} variant={'standard'} />);
		expect(container.querySelector(`form[action='/myft/add/${props.conceptId}']`)).toBeTruthy();
	});

	test('Button state changes when attributes change', async () => {
		render(<FollowButton {...props}
			variant={'standard'}
			setFollowButtonStateToSelected={true}
			cacheablePersonalisedUrl={true} />);
		expect(await screen.findByText('Added')).toBeTruthy();
	});

});

import React from 'react';
import InstantAlert from './instant-alert';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const props = {
	flags: {
		myFtApi: true,
		myFtApiWrite: true
	},
	conceptId: '0000-000000-00000-0000',
	name: 'Instant Alert',
	buttonText: 'Instant Alert'
};

describe('InstantAlert', () => {

	test('It renders', async () => {
		render(<InstantAlert {...props} />);
		expect(await screen.findByText('Instant Alert')).toBeInTheDocument();
	});

	test('It renders form attributes', () => {
		const { container } = render(<InstantAlert {...props} />);
		expect(container.querySelector('form[method="GET"]')).toBeInTheDocument();
		expect(container.querySelector(`form[action='/myft/add/${props.conceptId}?instant=true']`)).toBeInTheDocument();
		expect(container.querySelector('form[data-myft-ui="instant"]')).toBeInTheDocument();
		expect(container.querySelector(`form[data-concept-id="${props.conceptId}"]`)).toBeInTheDocument();
		expect(container.querySelector(`form[data-js-action="/__myft/api/core/followed/concept/${props.conceptId}?method=put"]`)).toBeInTheDocument();
	});

	test('It renders extraClasses in form', () => {
		const { container } = render(<InstantAlert {...props} extraClasses={'extra'} />);
		expect(container.querySelector('form[class="n-myft-ui n-myft-ui--instant extra"]')).toBeInTheDocument();
	});

	test('It renders hide button class in form', () => {
		const { container } = render(<InstantAlert {...props} hideButtonText={true} />);
		expect(container.querySelector('form[class="n-myft-ui n-myft-ui--instant n-myft-ui--instant--hide-text"]')).toBeInTheDocument();
	});

	test('It renders csrftoken input', () => {
		const { container } = render(<InstantAlert {...props} />);
		expect(container.querySelector('input[data-myft-csrf-token]')).toBeInTheDocument();
	});

	test('It renders input name as value attribute', () => {
		const { container } = render(<InstantAlert {...props} />);
		expect(container.querySelector('input[value="Instant Alert"]')).toBeInTheDocument();
	});

	test('It renders input directType as value attribute', () => {
		const { container } = render(<InstantAlert {...props} directType={'http://www.ft.com/ontology/test/Test'} />);
		expect(container.querySelector('input[value="http://www.ft.com/ontology/test/Test"]')).toBeInTheDocument();
	});

	test('It renders button props', () => {
		const { container } = render(<InstantAlert {...props} alternateText={'Sample alternate text'} variant={'blue'} size={'small'} />);
		expect(container.querySelector(`button[aria-label="Get instant alerts for ${props.name}"]`)).toBeInTheDocument();
		expect(container.querySelector('button[data-alternate-text="Sample alternate text"]')).toBeInTheDocument();
		expect(container.querySelector(`button[data-concept-id="${props.conceptId}"]`)).toBeInTheDocument();
		expect(container.querySelector('button[data-trackable="instant"]')).toBeInTheDocument();
		expect(container.querySelector(`button[title="Get instant alerts for ${props.name}"]`)).toBeInTheDocument();
		expect(container.querySelector('button[value="true"]')).toBeInTheDocument();
		expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
		expect(container.querySelector('button[name="_rel.instant"]')).toBeInTheDocument();
		expect(container.getElementsByClassName('n-myft-ui__button--blue')).toHaveLength(1);
		expect(container.getElementsByClassName('n-myft-ui__button--small')).toHaveLength(1);
	});

	test('It renders buttonText as data-alternate-text attribute when alternateText prop is not provided', () => {
		const { container } = render(<InstantAlert {...props} buttonText={'Sample button text'} variant={'blue'} size={'small'} />);
		expect(container.querySelector('button[data-alternate-text="Sample button text"]')).toBeInTheDocument();
	});

	test('It renders button aria-pressed=false attribute when hasInstantAlert=false or cacheablePersonalisedUrl props is not provided', () => {
		render(<InstantAlert {...props} buttonText={'Sample button text'} hasInstantAlert={false} cacheablePersonalisedUrl={'https://ft.com'} />);
		expect(screen.getByRole('button', {pressed: false})).toBeInTheDocument();
	});

	test('It renders button aria-pressed=true attribute when hasInstantAlert=true and cacheablePersonalisedUrl provided', () => {
		render(<InstantAlert {...props} buttonText={'Sample button text'} hasInstantAlert={true} cacheablePersonalisedUrl={'https://ft.com'} />);
		expect(screen.getByRole('button', {pressed: true})).toBeInTheDocument();
	});

});

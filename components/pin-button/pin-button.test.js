import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PinButton from './pin-button';

const flags = {
	myFtApi: true,
	myFtApiWrite: true
};

const fixtures = [
	{
		id: '00000000-0000-0000-0000-000000000022',
		name: 'myFT Enterprises',
		directType: 'http://www.ft.com/ontology/Topic',
		showPrioritiseButton: true
	},
	{
		id: '00000000-0000-0000-0000-000000000023',
		name: 'myFT Enterprises',
		directType: 'http://www.ft.com/ontology/Topic',
		showPrioritiseButton: false
	}
];


describe('Pin Button', () => {

	test('It renders', () => {
		const { container } = render(<PinButton flags={flags} {...fixtures[0]} />);
		expect(container.querySelector(`button[id="myft-pin-button__${fixtures[0].id}"]`)).toBeTruthy();
		expect(container.querySelector('button[data-trackable="prioritised"]')).toBeTruthy();
	});

	test('It renders unprioritised', () => {
		const { container } = render(<PinButton flags={flags} {...fixtures[0]} />);
		expect(container.querySelector('button[aria-label="Pin myFT Enterprises in my F T"]')).toBeTruthy();
		expect(container.querySelector('button[title="Pin myFT Enterprises"]')).toBeTruthy();
		expect(container.querySelector('button[data-prioritised=false]')).toBeTruthy();
		expect(container.querySelector(`button[data-concept-id="${fixtures[0].id}"]`)).toBeTruthy();
	});

	test('It renders with prioritised', () => {
		const { container } = render(<PinButton flags={flags} prioritised={true} {...fixtures[0]} />);
		expect(container.querySelector('button[aria-label="Unpin myFT Enterprises from my F T"]')).toBeTruthy();
		expect(container.querySelector('button[title="Unpin myFT Enterprises"]')).toBeTruthy();
		expect(container.querySelector('button[data-prioritised=true]')).toBeTruthy();
		expect(container.querySelector(`button[data-concept-id="${fixtures[0].id}"]`)).toBeTruthy();
	});

	test('It renders the form element', () => {
		const { container } = render(<PinButton flags={flags} {...fixtures[0]} />);
		expect(container.querySelector('form[method="post"]')).toBeTruthy();
		expect(container.querySelector(`form[action="/__myft/api/core/prioritised/concept/${fixtures[0].id}?method=put"]`)).toBeTruthy();
	});

});

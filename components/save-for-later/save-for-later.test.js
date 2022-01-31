import React from 'react';
import SaveForLater from './save-for-later';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const flags = {
	myFtApi: true,
	myFtApiWrite: true
};

const fixture = {
	contentId: '00000000-0000-0000-0000-000000000033',
	title: 'myFT Enterprises'
};

describe('SaveForLater component', () => {

	test('It renders', async () => {
		render(<SaveForLater flags={flags} {...fixture}/>);
		expect(await screen.findByText('Save')).toBeTruthy();
	});

	test('It renders button text wen provided', async () => {
		render(<SaveForLater flags={flags} {...fixture} buttonText={'Globetrotter'}/>);
		expect(await screen.findByText('Globetrotter')).toBeTruthy();
	});

	test('It renders the correct form action attribute', () => {
		const { container } = render(<SaveForLater flags={flags} {...fixture} buttonText={'Globetrotter'}/>);
		const formElement = container.querySelector(`form[action="/myft/save/${fixture.contentId}"]`);
		expect(formElement).toBeTruthy();
	});

	test('It renders the correct form data-js-action attribute', () => {
		const { container } = render(<SaveForLater flags={flags} {...fixture} buttonText={'Globetrotter'}/>);
		const formElement = container.querySelector(`form[data-js-action="/__myft/api/core/saved/content/${fixture.contentId}?method=put"]`);
		expect(formElement).toBeTruthy();
	});

	test('It renders the correct form method attribute', () => {
		const { container } = render(<SaveForLater flags={flags} {...fixture} buttonText={'Globetrotter'}/>);
		const formElement = container.querySelector('form[method="GET"]');
		expect(formElement).toBeTruthy();
	});

	test('It renders the correct button data-text-variant attribute when appIsStreamPage=true', () => {
		const { container } = render(<SaveForLater appIsStreamPage={true} flags={flags} {...fixture} buttonText={'Globetrotter'}/>);
		const buttonElement = container.querySelector('button[data-text-variant="save-button-with-icon-copy"]');
		expect(buttonElement).toBeTruthy();
	});

	describe('Saved', () => {
		test('It renders saved item', async () => {
			render(<SaveForLater isSaved={true} flags={flags} {...fixture}/>);
			expect(await screen.findByText('Saved')).toBeTruthy();
		});
	});

});
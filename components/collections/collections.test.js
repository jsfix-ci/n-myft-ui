import React from 'react';
import Collections from './collections';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const fixtures = {
	'title': 'European Union',
	'concepts': [
		{
			'id': '00000000-0000-0000-0000-000000000000',
			'prefLabel': 'EU immigration',
			'directType': 'http://www.ft.com/ontology/Topic',
			'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000000',
			'name': 'EU immigration'
		},
		{
			'id': '00000000-0000-0000-0000-000000000001',
			'prefLabel': 'Europe Quantitative Easing',
			'directType': 'http://www.ft.com/ontology/Topic',
			'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000000',
			'name': 'Europe Quantitative Easing'
		},
		{
			'id': '00000000-0000-0000-0000-000000000002',
			'prefLabel': 'EU financial regulation',
			'directType': 'http://www.ft.com/ontology/Topic',
			'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000000',
			'name': 'EU financial regulation'
		},
		{
			'id': '00000000-0000-0000-0000-000000000003',
			'prefLabel': 'EU nothing',
			'directType': 'http://www.ft.com/ontology/Topic',
			'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000000',
			'name': 'EU nothing'
		},
		{
			'id': '00000000-0000-0000-0000-000000000004',
			'prefLabel': 'EU trade',
			'directType': 'http://www.ft.com/ontology/Topic',
			'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000000',
			'name': 'EU trade'
		}
	]
};
const joinedDirectTypes = 'http://www.ft.com/ontology/Topic,http://www.ft.com/ontology/Topic,http://www.ft.com/ontology/Topic,http://www.ft.com/ontology/Topic,http://www.ft.com/ontology/Topic';

const flags = {
	myFtApi: true,
	myFtApiWrite: true
};

describe('Concept List', () => {

	test('It renders the title of the collection', async () => {
		render(<Collections {...fixtures} flags={flags} />);
		expect(await screen.findByText('European Union')).toBeTruthy();
	});

	test('It renders label for the concept button', async () => {
		render(<Collections {...fixtures} flags={flags} />);
		expect(await screen.findByText('EU immigration')).toBeTruthy();
		expect(await screen.findByText('Europe Quantitative Easing')).toBeTruthy();
		expect(await screen.findByText('EU financial regulation')).toBeTruthy();
		expect(await screen.findByText('EU nothing')).toBeTruthy();
		expect(await screen.findByText('EU trade')).toBeTruthy();
	});

	test('It renders form "Add all to my FT" from', () => {
		const { container} = render(<Collections {...fixtures} flags={flags} />);
		const formElement = container.querySelector('form[action="#"]');
		expect(formElement).toBeTruthy();
		expect(formElement.method).toEqual('post');
	});

	test('It renders directType input with value of types joined', () => {
		const { container} = render(<Collections {...fixtures} flags={flags} />);
		const directTypeElement = container.querySelector('input[name="directType"]');
		expect(directTypeElement).toBeTruthy();
		expect(directTypeElement.value).toEqual(joinedDirectTypes);
	});

});

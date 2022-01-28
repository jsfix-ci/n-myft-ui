import React from 'react';
import ConceptList from './concept-list';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const fixtures = [
	{
		'conceptListTitle': 'Follow european union things',
		'concepts': [
			{
				'id': '00000000-0000-0000-0000-000000000161',
				'prefLabel': 'EU immigration',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000161',
				'name': 'EU immigration'
			},
			{
				'id': '00000000-0000-0000-0000-000000000162',
				'prefLabel': 'Europe Quantitative Easing',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000162',
				'name': 'Europe Quantitative Easing'
			},
			{
				'id': '00000000-0000-0000-0000-000000000163',
				'prefLabel': 'EU financial regulation',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000163',
				'name': 'EU financial regulation'
			},
			{
				'id': '00000000-0000-0000-0000-000000000164',
				'prefLabel': 'EU nothing',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000164',
				'name': 'EU nothing'
			},
			{
				'id': '00000000-0000-0000-0000-000000000165',
				'prefLabel': 'EU trade',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000165',
				'name': 'EU trade'
			}
		]
	},
	{
		'contentType': 'search',
		'concepts': [
			{
				'id': '00000000-0000-0000-0000-000000000166',
				'prefLabel': 'Noodle',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000166',
				'name': 'Noodle'
			},
			{
				'id': '00000000-0000-0000-0000-000000000167',
				'prefLabel': 'Green apples',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000167',
				'name': 'Green apples'
			},
			{
				'id': '00000000-0000-0000-0000-000000000168',
				'prefLabel': 'Fox blood',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000168',
				'name': 'Fox blood'
			},
			{
				'id': '00000000-0000-0000-0000-000000000169',
				'prefLabel': 'Dog party',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000169',
				'name': 'Dog party'
			},
			{
				'id': '00000000-0000-0000-0000-000000000170',
				'prefLabel': 'Fifth thing',
				'directType': 'http://www.ft.com/ontology/Topic',
				'url': 'https://www.ft.com/stream/00000000-0000-0000-0000-000000000170',
				'name': 'Fifth thing'
			}
		]
	},
];


const flags = {
	myFtApi: true,
	myFtApiWrite: true
};

describe('Concept List', () => {

	test('It renders conceptListTitle value as title when conceptListTitle is provided', async () => {
		render(<ConceptList {...fixtures[0]} flags={flags} />);
		expect(await screen.findByText('Follow european union things')).toBeTruthy();
	});

	test('It renders "Follow the topics in this {conceptType}" value as title when conceptType is provided', async () => {
		render(<ConceptList {...fixtures[1]} flags={flags} />);
		expect(await screen.findByText('Follow the topics in this search')).toBeTruthy();
	});

	test('It renders label for the concept button', async () => {
		render(<ConceptList {...fixtures[0]} flags={flags} />);
		expect(await screen.findByText('EU immigration')).toBeTruthy();
		expect(await screen.findByText('Europe Quantitative Easing')).toBeTruthy();
		expect(await screen.findByText('EU financial regulation')).toBeTruthy();
		expect(await screen.findByText('EU nothing')).toBeTruthy();
		expect(await screen.findByText('EU trade')).toBeTruthy();
	});

});

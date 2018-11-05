/* global expect */

import fetchMock from 'fetch-mock';
import sinon from 'sinon';

const SINCE = '2018-06-05T06:48:26.635Z';

const ARTICLE_PUBLISH_BEFORE_SINCE = '2018-06-04T06:48:26.635Z';
const ARTICLE_PUBLISH_AFTER_SINCE = '2018-06-05T07:48:26.635Z';

const READ_ARTICLE_AFTER_SINCE = 'read-followed-article-after-since';
const UNREAD_ARTICLE_AFTER_SINCE = 'unread-followed-article-after-since';
const READ_ARTICLE_BEFORE_SINCE = 'read-followed-article-before-since';
const UNREAD_ARTICLE_BEFORE_SINCE = 'unread-followed-article-before-since';
const mockReadingHistoryData = {
	data: {
		user: {
			articlesFromReadingHistory: {
				articles: [
					{ id: READ_ARTICLE_AFTER_SINCE },
					{ id: READ_ARTICLE_BEFORE_SINCE }
				]
			}
		}
	}
};
const mockPersonalisedFeedData = {
	results: [
		{
			id: READ_ARTICLE_AFTER_SINCE,
			contentTimeStamp: ARTICLE_PUBLISH_AFTER_SINCE
		},
		{
			id: UNREAD_ARTICLE_AFTER_SINCE,
			contentTimeStamp: ARTICLE_PUBLISH_AFTER_SINCE
		},
		{
			id: READ_ARTICLE_BEFORE_SINCE,
			contentTimeStamp: ARTICLE_PUBLISH_BEFORE_SINCE
		},
		{
			id: UNREAD_ARTICLE_BEFORE_SINCE,
			contentTimeStamp: ARTICLE_PUBLISH_BEFORE_SINCE
		}
	]
};

describe('fetch-new-articles', () => {
	let data;

	beforeEach(() => {
		const subjectInjector = require('inject-loader!../../components/unread-articles-indicator/fetch-new-articles');
		const subject = subjectInjector({
			'next-session-client': {
				uuid: sinon.stub().resolves({ uuid: '3a499586-b2e0-11e4-a058-00144feab7de'})
			}
		});

		data = null;
		fetchMock.get('begin:https://next-api.ft.com/v2/', mockReadingHistoryData);
		fetchMock.get('begin:/__myft/api/onsite/feed/', mockPersonalisedFeedData);

		return subject(SINCE)
			.then(resolvedValue => {
				data = resolvedValue;
			});
	});

	afterEach(fetchMock.reset);

	it('should fetch', () => {
		expect(fetchMock.calls().matched.length).to.equal(2);
	});

	it('should return an array of articles', () => {
		expect(data).to.be.an('array');
	});

	it('should return only the articles after the since date', () => {
		expect(data.length).to.equal(2);
		expect(data.some(article => article.id === READ_ARTICLE_AFTER_SINCE)).to.equal(true);
		expect(data.some(article => article.id === UNREAD_ARTICLE_AFTER_SINCE)).to.equal(true);
	});

	it('should decorate read articles with hasBeenRead = true', () => {
		expect(data.find(article => article.id === READ_ARTICLE_AFTER_SINCE).hasBeenRead).to.equal(true);
		expect(data.find(article => article.id === UNREAD_ARTICLE_AFTER_SINCE).hasBeenRead).not.to.equal(true);
	});
});

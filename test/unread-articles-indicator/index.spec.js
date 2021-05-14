/* global expect */
import sinon from 'sinon';

const FEED_START_TIME = '2018-06-05T10:00:00.000Z';

describe('unread stories indicator', () => {
	let unreadArticlesComponent;
	let mockInitialiseFeedStartTime;
	let mockStorage;
	let isStorageAvailable;

	beforeEach(() => {
		mockStorage = {
			getFeedStartTime: sinon.stub().returns(FEED_START_TIME),
			setFeedStartTime: sinon.stub(),
			isAvailable: sinon.stub().callsFake(() => isStorageAvailable)
		};

		mockInitialiseFeedStartTime = sinon.stub().resolves();

		unreadArticlesComponent = require('inject-loader!../../components/unread-articles-indicator')({
			'next-session-client': {
				uuid: sinon.stub().resolves({uuid: '00000000-0000-0000-0000-000000000000'})
			},
			'./storage': mockStorage,
			'./initialise-feed-start-time': mockInitialiseFeedStartTime
		});
	});

	describe('getNewsArticlesSinceTime', () => {
		it('should not do anything if storage is not available', () => {
			isStorageAvailable = false;
			unreadArticlesComponent.getNewArticlesSinceTime();
			expect(mockInitialiseFeedStartTime).to.not.have.been.called;
		});

		it('should initialise feed start time', () => {
			isStorageAvailable = true;
			return unreadArticlesComponent.getNewArticlesSinceTime();
			expect(mockInitialiseFeedStartTime).to.have.been.calledOnce;
		});
	});
});

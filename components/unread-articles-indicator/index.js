import {startOfDay} from 'date-fns';
import * as storage from './storage';
import * as ui from './ui';
import updateCount from './update-count';
import initialiseFeedStartTime from './initialise-feed-start-time';
import sessionClient from 'next-session-client';
import {UPDATE_INTERVAL} from './constants';

let initialFeedStartTime;
let userId;

const assertValidSession = async () => {
	const {uuid} = await sessionClient.uuid();
	userId = uuid;
	if (!userId) throw new Error('No userId');
	return userId;
};

async function updater () {
	await updateCount(new Date());
	window.setTimeout(() => assertValidSession().then(updater), UPDATE_INTERVAL);
}
const uiOnClick = () => {
	storage.updateLastUpdate({count: 0, time: new Date()});
	storage.setIndicatorDismissedTime(new Date());
};

const onVisibilityChange = () => {
	if (document.visibilityState !== 'visible') return;
	assertValidSession()
		.then(getNewArticlesSinceTime)
		.then(() => updateCount(userId, new Date()));
};

// Export used in next-myft -page to determine whether to add "New" label to articles in feed
export async function getNewArticlesSinceTime (userId) {
	const dayStart = startOfDay(new Date());

	if (!initialFeedStartTime && storage.isAvailable()) {
		try {
			initialFeedStartTime = await initialiseFeedStartTime(userId, new Date());
		} catch(e) {}
	}

	return initialFeedStartTime || dayStart;
}

export default async (options = {}) => {
	if (!storage.isAvailable()) return;

	const myftHeaderLink = document.querySelectorAll('.o-header__top-link--myft');
	const uiOpts = Object.assign({onClick: uiOnClick, flags: {}}, options);
	const {myftNewUnreadIndicatorPolling} = uiOpts;
	userId = await assertValidSession();

	await getNewArticlesSinceTime(userId);
	const {count = 0} = storage.getLastUpdate() || {};
	ui.createIndicators(myftHeaderLink,uiOpts);
	ui.setCount(count);
	storage.addCountChangeListeners(newCount => ui.setCount(newCount));
	if (myftNewUnreadIndicatorPolling) {
		return updater(userId);
	} else {
		await updateCount(userId, new Date());
		document.addEventListener('visibilitychange', onVisibilityChange);
	}
};

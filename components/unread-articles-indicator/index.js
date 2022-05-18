import { startOfDay } from 'date-fns';
import * as storage from './storage';
import initialiseFeedStartTime from './initialise-feed-start-time';
import sessionClient from 'next-session-client';

let initialFeedStartTime;
let userId;

async function getValidSession () {
	if (!userId) {
		const { uuid } = await sessionClient.uuid();
		if (!uuid) throw new Error('No userId');
		userId = uuid;
	}
	return userId;
}

// Export used in next-myft -page to determine whether to add "New" label to articles in feed
//KEEP: This function is in use in next-myft-page do not delete!
export async function getNewArticlesSinceTime () {
	const user = await getValidSession();
	const dayStart = startOfDay(new Date());

	if (!initialFeedStartTime && storage.isAvailable()) {
		try {
			initialFeedStartTime = await initialiseFeedStartTime(user, new Date());
		} catch (e) {}
	}

	return initialFeedStartTime || dayStart;
}

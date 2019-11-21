import {isAfter, parseISO} from 'date-fns';
import * as storage from './storage';
import countUnreadArticles from './count-unread-articles';
import * as tracking from './tracking';
import {
	UPDATE_INTERVAL,
	UPDATE_TIMEOUT
} from './constants';


function latest ( a, b ) {
	if( !a ) {
		return b;
	}
	if( !b ) {
		return a;
	}
	return isAfter(parseISO(a),parseISO(b)) ? a : b;
}

export default function updateCount (userId, now) {
	const lastUpdate = storage.getLastUpdate();

	const readyToUpdate =
		// Always update if there has never been an update before.
		!lastUpdate || (
			// Update if an update is overdue, and
			(!lastUpdate.time || now.getTime() - lastUpdate.time.getTime() > UPDATE_INTERVAL) &&
			// there is no update underway, or
			// the update started so long ago that it must have failed or completed by now.
			(!lastUpdate.updateStarted || now.getTime() - lastUpdate.updateStarted.getTime() > UPDATE_TIMEOUT)
		);

	if (readyToUpdate) {

		storage.updateLastUpdate({updateStarted: now});

		const startTime = latest(storage.getFeedStartTime(), storage.getIndicatorDismissedTime());
		return countUnreadArticles(userId, startTime)
			.then((count) => {
				if (!lastUpdate || count !== lastUpdate.count) {
					tracking.onCountChange(count, startTime);
				}
				storage.setLastUpdate({time: now, count, updateStarted: false});
			})
			.catch(() => storage.updateLastUpdate({updateStarted: false}));

	} else {
		return Promise.resolve();
	}
};

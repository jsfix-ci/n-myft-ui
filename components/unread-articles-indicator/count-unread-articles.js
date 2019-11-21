import {json as fetchJson} from 'fetchres';
import {isAfter, parseISO} from 'date-fns';

export default async (userId, startTime) => {
	if (typeof startTime === 'string') startTime = parseISO(startTime);

	const articles = await fetchContentFromPersonalisedFeed(userId);
	const unreadArticlesSinceLastVisit = articles
		.filter(({userCompletion = -1}) => userCompletion < 1) // only include unread articles
		.filter(({contentTimeStamp}) => isAfter(parseISO(contentTimeStamp), startTime)); // only include articles published since last visit

	return unreadArticlesSinceLastVisit.length;
};

async function fetchContentFromPersonalisedFeed (userId) {

	const searchParams = new URLSearchParams({
		originatingSignals: 'followed',
		from: '-1d',
		source: 'myft-ui'
	});

	const res = await fetch(`/__myft/api/onsite/feed/${userId}?${searchParams.toString()}`, {
		credentials: 'include'
	});
	const {results = []} = res.statusCode === 401 ? {} : await fetchJson(res);
	return results;
}

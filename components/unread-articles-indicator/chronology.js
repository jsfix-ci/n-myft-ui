import { differenceInMinutes, isAfter, isToday, startOfDay } from 'date-fns';
import { fetchUserLastVisitedAt } from './api';

const SAME_VISIT_THRESHOLD_MINUTES = 30;
const dateIsWithinSameVisitThreshold = date => differenceInMinutes(new Date(), date) <= SAME_VISIT_THRESHOLD_MINUTES;

/**
 * @param {string} userNewArticlesSince  ISO date representing the time we last used to determine if articles are new for the user
 * @param {string} uuid  User uuid
 * @return {string} ISO date when we now determine articles to be 'new' for the user
 */
export const determineNewArticlesSinceTime = (userNewArticlesSince, uuid) => {
	if (isToday(userNewArticlesSince) && dateIsWithinSameVisitThreshold(userNewArticlesSince)) {
		return Promise.resolve(userNewArticlesSince);
	}

	const earliestNewArticlesSince = startOfDay(new Date()).toISOString();

	return fetchUserLastVisitedAt(uuid)
		.then(userLastVisitedAt => {
			return isToday(userLastVisitedAt) ? userLastVisitedAt : earliestNewArticlesSince;
		})
		.catch(() => {
			return earliestNewArticlesSince;
		});

};

export const filterArticlesToNewSinceTime = (articles, publishedAfterTime) => {
	return articles.filter(article => {
		return article.hasBeenRead !== true && isAfter(article.contentTimeStamp, publishedAfterTime);
	});
};

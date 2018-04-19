import { json as fetchJson } from 'fetchres';
import { fragments as teaserFragments } from '@financial-times/n-teaser/main';
import slimQuery from './slim-query';

const notificationDismissTime = 'timeUserClickedMyftNotification';
const myftNotificationsEnabled = 'myftNotificationsEnabled';

const hasBeenRead = (targetArticle, readArticles) => readArticles.find(readArticle => readArticle.id === targetArticle.id);

const checkDigestDataExist = ({ data = {} } = {}) => {
	if (!data || !data.user ||
		!data.user.digest ||
		!data.user.digest.concepts ||
		data.user.digest.concepts.length === 0 ||
		data.user.digest.concepts.every(concept => !concept.articles || !concept.articles.length)) {
		return Promise.reject(new Error('myFT Digest data is not provided'));
	}
	return data;
};

const flattenDigestSections = data => {
	let articles = [];
	data.user.digest.concepts.forEach(concept => {
		articles = articles.concat(concept.articles);
	});
	data.user.digest.articles = articles;
	return data;
};

const orderByUnreadFirst = (data) => {
	const digestData = data.user.digest;
	const result = digestData;

	// reading history for past 7 days
	const articlesUserRead = data.user.articlesFromReadingHistory ? data.user.articlesFromReadingHistory.articles : [];
	if (articlesUserRead.length > 0) {
		const readArticles = [];
		const unreadArticles = [];
		digestData.articles.forEach(article => {
			hasBeenRead(article, articlesUserRead) ? readArticles.push(article) : unreadArticles.push(article);
		});
		result.articles = unreadArticles.concat(readArticles);
	}

	return result;
};

export default class DigestData {
	constructor (uuid) {
		this.uuid = uuid;
	}

	fetch () {
		const digestQuery = `
			${teaserFragments.teaserExtraLight}

			query MyFT($uuid: String!) {
					user(uuid: $uuid) {
						articlesFromReadingHistory {
							articles {
								...TeaserExtraLight
							}
						}
						digest {
							type
							publishedDate
							concepts {
								id
								prefLabel
								url
								articles {
									...TeaserExtraLight
								}
							}
						}
					}
				}
			`;
		const variables = { uuid: this.uuid };
		const url = `https://next-api.ft.com/v2/query?query=${slimQuery(digestQuery)}&variables=${JSON.stringify(variables)}&source=next-front-page-myft`;
		const options = { credentials: 'include', timeout: 5000 };

		return fetch(url, options)
			.then(fetchJson)
			.then(checkDigestDataExist)
			.then(flattenDigestSections)
			.then(orderByUnreadFirst)
			.then(data => {
				this.data = data;
				return this.data;
			});
	}

	dismissNotification () {
		window.localStorage.setItem(notificationDismissTime, Date.now());
	}

	disableNotifications () {
		window.localStorage.setItem(myftNotificationsEnabled, 'false');
	}

	enableNotifications () {
		window.localStorage.removeItem(myftNotificationsEnabled);
	}

	hasNotifiableContent () {
		const notificationsEnabled = window.localStorage.getItem(myftNotificationsEnabled) !== 'false';
		const timeUserDismissed = window.localStorage.getItem(notificationDismissTime);
		const newContent = Date.parse(this.data.publishedDate) > Number(timeUserDismissed);

		return newContent && notificationsEnabled;
	}
}

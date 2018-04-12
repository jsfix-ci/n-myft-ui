import { json as fetchJson } from 'fetchres';
import { fragments as teaserFragments } from '@financial-times/n-teaser/main';
import slimQuery from './slim-query';

const notificationDismissTime = 'timeUserClickedMyftNotification';
const myftNotificationsEnabled = 'myftNotificationsEnabled';

export default class DigestData {
	constructor (uuid) {
		this.uuid = uuid;
	}

	fetch () {
		const digestQuery = `
			${teaserFragments.teaserExtraLight}
	
			query MyFT($uuid: String!) {
					user(uuid: $uuid) {
						digest {
							type
							publishedDate
							articles {
								...TeaserExtraLight
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
			.then(({ data = {} } = {}) => {
				this.data = data.user.digest;

				return this.data;
			});
	}

	markDigestAsSeen () {
		window.localStorage.setItem(notificationDismissTime, Date.now());
	}

	turnOffNotifications () {
		window.localStorage.setItem(myftNotificationsEnabled, 'false');
	}

	hasUserSeenDigest () {
		const notificationsEnabled = window.localStorage.getItem(myftNotificationsEnabled) !== 'false';
		const timeUserDismissed = window.localStorage.getItem(notificationDismissTime);

		if (!notificationsEnabled) {
			return true;
		}

		if (!timeUserDismissed) {
			return false;
		}

		return Date.parse(this.data.publishedDate) < Number(timeUserDismissed);
	}
}

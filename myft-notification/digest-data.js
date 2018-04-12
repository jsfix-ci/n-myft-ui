import { json as fetchJson } from 'fetchres';
import { fragments as teaserFragments } from '@financial-times/n-teaser/main';
import slimQuery from './slim-query';

export default (uuid) => {
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
	const variables = { uuid };
	const url = `https://next-api.ft.com/v2/query?query=${slimQuery(digestQuery)}&variables=${JSON.stringify(variables)}&source=next-front-page-myft`;
	const options = { credentials: 'include', timeout: 5000 };

	return fetch(url, options)
		.then(fetchJson)
		.then(({ data = {} } = {}) => data.user.digest);
};

import myFtClient from 'next-myft-client';
import relationshipConfig from '../../lib/relationship-config';
import * as loadedRelationshipsConfig from '../../lib/loaded-relationships/config';

const RelationshipSource = {
	fetch: (relationshipName) => {
		return new Promise(resolve => {
			const subjectType = relationshipConfig[relationshipName].subjectType;
			const loadedKey = `${relationshipName}.${subjectType}`;

			if (myFtClient.loaded[loadedKey]) {
				return resolve(myFtClient.loaded[loadedKey]);
			} else {

				function storeAndResolve () {
					resolve(myFtClient.loaded[loadedKey].items);
				}

				const loadEvent = `myft.user.${relationshipName}.${subjectType}.load`;
				document.body.addEventListener(loadEvent, storeAndResolve);

				// if it ain't here after n milliseconds, assume there are none
				setTimeout(() => {
					document.body.removeEventListener(loadEvent, storeAndResolve);
					resolve();
				}, loadedRelationshipsConfig.assumeNoneTimeout);
			}
		});
	}
};

export default RelationshipSource;

import personaliseLinks from './personalise-links';
import * as loadedRelationships from './lib/loaded-relationships';
import * as buttonStates from './lib/button-states';
import relationshipConfig from './lib/relationship-config';

export default function (contextEl) {
	personaliseLinks(contextEl);
	Object.keys(relationshipConfig).forEach(relationshipName => {
		const relationships = loadedRelationships.getRelationships(relationshipName);
		if (relationships.length > 0) {
			const subjectIdsV1 = relationships.map(item => item.uuid); // CAPI2_CLEANUP_NEO4J
			const subjectIdsV2 = relationships.map(item => item.uuidV2); // CAPI2_CLEANUP_NEO4J
			const subjectIds = subjectIdsV1.concat(subjectIdsV2);
			buttonStates.setStateOfManyButtons(relationshipName, subjectIds, true, contextEl);
		}
	});
}

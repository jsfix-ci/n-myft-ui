import alt from '../alt';
import RelationshipSource from '../sources/RelationshipSource';

class RelationshipActions {

	updateRelationships (relationshipName, relationships) {
		return {relationshipName, relationships};
	}

	fetchRelationships (relationshipName) {
		return () => {
			RelationshipSource.fetch(relationshipName)
				.then(relationships => this.updateRelationships(relationshipName, relationships));
		};
	}

	addRelationship (relationshipName, relationship) {
		return {relationshipName, relationship};
	}

	removeRelationship (relationshipName, relationship) {
		return {relationshipName, relationship};
	}
}

export default alt.createActions(RelationshipActions);

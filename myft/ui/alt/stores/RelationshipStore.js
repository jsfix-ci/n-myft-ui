import alt from '../alt';
import RelationshipActions from '../actions/RelationshipActions';

class RelationshipStore {
	constructor () {
		this.relationships = {};
		this.bindListeners({
			updateRelationships: RelationshipActions.updateRelationships,
			addRelationship: RelationshipActions.addRelationship,
			removeRelationship: RelationshipActions.removeRelationship
		});
	}

	updateRelationships ({relationshipName, relationships}) {
		this.relationships[relationshipName] = relationships;
	}

	addRelationship ({relationshipName, relationship}) {
		if (this.relationships[relationshipName]) {
			const relationshipIdx = this.findRelationship(relationshipName, relationship.uuid);
			if (relationshipIdx === -1) {
				this.relationships[relationshipName].push(relationship);
			}

		} else {
			this.relationships[relationshipName] = [relationship];
		}
	}

	removeRelationship ({relationshipName, uuid}) {
		const relationshipIdx = this.findRelationship(relationshipName, uuid);
		if (relationshipIdx !== -1) {
			this.relationships[relationshipName].splice(relationshipIdx, 1);
		}
	}

	findRelationship (relationshipName, uuid) {
		return this.relationships[relationshipName].findIndex(relationship => relationship.uuid === uuid);
	};
}

export default alt.createStore(RelationshipStore, 'RelationshipStore');

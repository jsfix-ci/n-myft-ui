import * as myFtButtons from './myft-buttons';
import * as lists from './lists';
import personaliseLinks from './personalise-links';
import updateUi from './update-ui';
import RelationshipActions from './alt/actions/RelationshipActions';

function init (opts) {
	RelationshipActions.fetchRelationships('followed');
	myFtButtons.init(opts);
	lists.init();
}

export {
	init,
	personaliseLinks,
	updateUi
};

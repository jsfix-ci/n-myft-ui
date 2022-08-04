const relationshipConfig = {
	saved: {
		actorType: 'user',
		idProperty: 'data-content-id',
		subjectType: 'content',
		uiSelector: '[data-myft-ui="saved"]'
	},
	followed: {
		actorType: 'user',
		idProperty: 'data-concept-id',
		subjectType: 'concept',
		uiSelector: '[data-myft-ui="follow"]'
	},
};

export default relationshipConfig;

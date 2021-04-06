import nextMyftClient from 'next-myft-client';

const listenForFollowButtonClicks = (buttonEventName) => {
	const buttonEventHandler = ({ detail }) => {
		const formData = {
			token: detail.token
		};

		nextMyftClient[detail.action](detail.actorType, detail.actorId, detail.relationshipName, detail.subjectType, detail.subjectId, formData);
	};
	document.body.removeEventListener(buttonEventName, buttonEventHandler);
	document.body.addEventListener(buttonEventName, buttonEventHandler);
};

const listenForSaveButtonClicks = (buttonEventName) => {
	const buttonEventHandler = ({ detail }) => {
		const formData = {
			token: detail.token
		};

		nextMyftClient[detail.action](detail.actorType, detail.actorId, detail.relationshipName, detail.subjectType, detail.subjectId, formData);
	};
	document.body.removeEventListener(buttonEventName, buttonEventHandler);
	document.body.addEventListener(buttonEventName, buttonEventHandler);
};

export const initFollowButtons = () => listenForFollowButtonClicks('x-follow-button');
export const initSaveButtons = () => listenForSaveButtonClicks('x-article-save-button');

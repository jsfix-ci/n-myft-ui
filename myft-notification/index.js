// !! this feature is for a short experiment only !!
import oExpander from 'o-expander';
import oDate from 'o-date';
import getUuidFromSession from './get-uuid-from-session';
import Feedback from '../components/feedback';
import DigestData from './digest-data';
import dispatchTrackingEvent from './tracking';
import templateExpander from './notification-expander.html';
import templateToggleButton from './notification-toggle-button.html';

const openDigestContent = (targetEl) => {
	moveDigestContentTo(targetEl);
	digestContentExpander.expand();
	dismissNotification();
	dispatchTrackingEvent.digestOpened(document);
};

const closeDigestContent = () => {
	digestContentExpander.collapse();
	dispatchTrackingEvent.digestClosed(document);
};

const toggleDigestContent = (e) => {
	if (digestContentExpander.isCollapsed()) {
		openDigestContent(e.path[1]);
	} else {
		closeDigestContent();
	}
};

const insertDigestContentToggleButton = (targetEl, withDot) => {
	if (targetEl) {
		targetEl.classList.add('myft-notification__container');
		const toggleButtonContainer = document.createElement('div');
		toggleButtonContainer.setAttribute('class', 'myft-notification');
		toggleButtonContainer.innerHTML = templateToggleButton({ withDot });
		toggleButtonContainer.querySelector('.myft-notification__icon').addEventListener('click', toggleDigestContent);
		targetEl.appendChild(toggleButtonContainer);
	}
};

const createDigestContent = (data, flags) => {
	const publishedDate = new Date(Date.parse(data.publishedDate));
	const publishedDateFormatted = oDate.format(publishedDate, 'd/M/yyyy');
	const oExpanderDiv = document.createElement('div');
	oExpanderDiv.setAttribute('class', 'o-expander');
	oExpanderDiv.setAttribute('data-o-component', 'o-expander');
	oExpanderDiv.setAttribute('data-o-expander-shrink-to', 'hidden');
	oExpanderDiv.innerHTML = templateExpander({ items: data.articles, publishedDateFormatted, flags });

	const digestArticleLinks = oExpanderDiv.querySelectorAll('.js-teaser-heading-link');
	digestArticleLinks.forEach(link => {
		link.addEventListener('click', () => {
			dispatchTrackingEvent.digestLinkClicked(document, link);
		});
	});

	oExpanderDiv.querySelector('.myft-notification__collapse').addEventListener('click', closeDigestContent);

	oDate.init(oExpanderDiv);

	digestContentExpander = oExpander.init(oExpanderDiv, {
		expandedToggleText: '',
		collapsedToggleText: ''
	});

	const feedbackEl = oExpanderDiv.querySelector('.myft-notification__feedback');

	if (feedbackEl) {
		new Feedback(feedbackEl, {
			onRespond: (response) => {
				if (response.answer === 'negative') {
					digestData.disableNotifications();
				}
			}
		});
	}
};

const dismissNotification = () => {
	if (digestData.hasNotifiableContent()) {
		digestData.dismissNotification();
		document.querySelectorAll('.myft-notification__icon').forEach(icon => {
			icon.classList.remove('myft-notification__icon--with-dot');
		});
	}
};

const moveDigestContentTo = (el) => el.appendChild(digestContentExpander.contentEl);

let digestData;
let digestContentExpander;

export default async (flags) => {
	const myFtIcon = document.querySelector('.o-header__top-link--myft');
	const userId = await getUuidFromSession();

	if (!myFtIcon || !userId) {
		return;
	}

	digestData = new DigestData(userId);
	digestData.fetch()
		.then(data => {
			createDigestContent(data, flags);
			const stickyHeader = document.querySelector('.o-header--sticky');
			const stickyHeaderMyFtIconContainer = stickyHeader.querySelector('.o-header__top-column--right');
			const ftHeaderMyFtIconContainer = document.querySelector('.o-header__top-wrapper .o-header__top-link--myft__container');
			const showNotification = digestData.hasNotifiableContent();

			insertDigestContentToggleButton(stickyHeaderMyFtIconContainer, showNotification);
			insertDigestContentToggleButton(ftHeaderMyFtIconContainer, showNotification);

			if (stickyHeaderMyFtIconContainer && ftHeaderMyFtIconContainer) {
				stickyHeader.addEventListener('oHeader.Sticky', (e) => {
					const isSticky = e.detail && e.detail.isActive;
					const buttonContainer = isSticky ? stickyHeaderMyFtIconContainer : ftHeaderMyFtIconContainer;
					if (!digestContentExpander.isCollapsed()) {
						moveDigestContentTo(buttonContainer.querySelector('.myft-notification'));
					}
				});
			}

		})
		.catch(() => {
			// logger.error('event=FOLLOWED_PROMISE_REJECTED ' + err.name);
			return;
		});
};

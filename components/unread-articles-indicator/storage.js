const DEVICE_SESSION_EXPIRY = 'deviceSessionExpiry';
const NEW_ARTICLES_SINCE = 'newArticlesSinceTime';
const INDICATOR_DISMISSED_AT = 'myFTIndicatorDismissedAt';

const timestampToIsoDate = ts => new Date(ts).toISOString();

const getTimestampItemAsIsoDate = key => {
	const item = window.localStorage.getItem(key);
	const timestamp = Number(item);

	return !item || isNaN(timestamp) ? null : timestampToIsoDate(timestamp);
};

export const getDeviceSessionExpiry = () => getTimestampItemAsIsoDate(DEVICE_SESSION_EXPIRY);

export const setDeviceSessionExpiry = isoDate => window.localStorage.setItem(DEVICE_SESSION_EXPIRY, String(new Date(isoDate).getTime()));

export const getNewArticlesSinceTime = () => getTimestampItemAsIsoDate(NEW_ARTICLES_SINCE);

export const setNewArticlesSinceTime = isoDate => window.localStorage.setItem(NEW_ARTICLES_SINCE, String(new Date(isoDate).getTime()));

export const getIndicatorDismissedTime = () => getTimestampItemAsIsoDate(INDICATOR_DISMISSED_AT);

export const setIndicatorDismissedTime = () => window.localStorage.setItem(INDICATOR_DISMISSED_AT, String(Date.now()));

export const isAvailable = () => {
	try {
		const storage = window.localStorage;
		const x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
};

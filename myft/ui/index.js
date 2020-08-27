import * as myFtButtons from './myft-buttons';
import * as lists from './lists';
import personaliseLinks from './personalise-links';
import updateUi from './update-ui';
import * as headerTooltip from '../../components/header-tooltip';
import navigationAlphaTest from './navigationAlphaTest';

function init (opts) {
	myFtButtons.init(opts);
	lists.init();
	headerTooltip.init();
	navigationAlphaTest(opts);
}

export {
	init,
	personaliseLinks,
	updateUi
};

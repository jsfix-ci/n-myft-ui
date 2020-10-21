import * as myFtButtons from './myft-buttons';
import * as lists from './lists';
import personaliseLinks from './personalise-links';
import updateUi from './update-ui';
import * as headerTooltip from '../../components/header-tooltip';
import navigationBetaTest from './navigationBetaTest';

function init (opts) {
	myFtButtons.init(opts);
	lists.init();
	headerTooltip.init();
	navigationBetaTest(opts);
}

export {
	init,
	personaliseLinks,
	updateUi
};

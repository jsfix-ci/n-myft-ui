const MOBILE_BREAKPOINT = 980;

export default function isMobile () {
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

	return vw <= MOBILE_BREAKPOINT;
}

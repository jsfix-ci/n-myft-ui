import { $$ as findElements } from 'n-ui-foundations';

export default function (opts) {
	if (
		opts &&
		opts.flags &&
		((opts.flags.get && opts.flags.get('frontPageAlpha')) || opts.flags.frontPageAlpha)
	) {
		const ft = 'www.ft.com';
		const relativeLinks = findElements('a[href="/"], a[href^="/?"]');
		const absoluteLinks = findElements(
			`a[href="https://${ft}"], a[href="http://${ft}"], a[href="https://${ft}/"], a[href="http://${ft}/"], a[href^="https://${ft}/?"], a[href^="http://${ft}/?"], a[href^="https://${ft}?"]`
		);

		const alphaFrontPageUrl =
			'https://ft-next-alpha-front-page-eu.herokuapp.com/next-alpha-front-page';

		[...relativeLinks, ...absoluteLinks].forEach((link) => {
			const url = new URL(link.href);
			link.href = `${alphaFrontPageUrl}${url.search}`;
		});
	}
}

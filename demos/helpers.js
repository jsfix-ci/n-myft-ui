module.exports = {
	titleToId (title) {
		return title.toLowerCase().replace(/\W/g, '-');
	}
};

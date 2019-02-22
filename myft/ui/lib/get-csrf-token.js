import Cookies from 'js-cookie';
const desiredTokenLength = 36;

module.exports = () => {
  const token = Cookies.get('FTSession_s') || Cookies.get('FTSession');
  const trimmedToken = token ? token.slice(-desiredTokenLength) : '';
  return trimmedToken;
};

import Cookies from 'js-cookie';
const desiredTokenLength = 36;

export default () => {
 const token = JSON.parse(Cookies.get('FTSession_s')) || JSON.parse(Cookies.get('FTSession'));
 const trimmedToken = token ? token.slice(-desiredTokenLength) : '';
 return trimmedToken;
};

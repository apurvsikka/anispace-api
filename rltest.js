// getIframeLink.js
const fetch = require('node-fetch');

const BASE_URL = 'https://123animehub.cc';

const episodePath = process.argv[2]; // e.g. one-piece/1
const server = process.argv[3]; // e.g. vidstreaming.io

if (!episodePath || !server) {
	console.error('Usage: node getIframeLink.js <episodePath> <serverName>');
	process.exit(1);
}

const url = `${BASE_URL}/ajax/episode/info?epr=${encodeURIComponent(episodePath + '/' + server)}`;
console.log(url);
const headers = {
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
	Referer: BASE_URL + '/',
	Origin: BASE_URL,
	'X-Requested-With': 'XMLHttpRequest',
};

(async () => {
	try {
		const res = await fetch(url, { headers });
		if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

		const json = await res.json();

		if (json && json.target) {
			console.log('🎯 Target Iframe URL:\n' + json.target);
		} else {
			console.error('⚠️ No target found in response:', json);
		}
	} catch (err) {
		console.error('❌ Error fetching iframe link:', err.message);
	}
})();

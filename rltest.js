// // getIframeLink.js
// const fetch = require('node-fetch');

// const BASE_URL = 'https://123animehub.cc';

// const episodePath = process.argv[2]; // e.g. one-piece/1
// const server = process.argv[3]; // e.g. vidstreaming.io

// if (!episodePath || !server) {
// 	console.error('Usage: node getIframeLink.js <episodePath> <serverName>');
// 	process.exit(1);
// }

// const url = `${BASE_URL}/ajax/episode/info?epr=${encodeURIComponent(episodePath + '/' + server)}`;
// console.log(url);
// const headers = {
// 	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
// 	Referer: BASE_URL + '/',
// 	Origin: BASE_URL,
// 	'X-Requested-With': 'XMLHttpRequest',
// };

// (async () => {
// 	try {
// 		const res = await fetch(url, { headers });
// 		if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

// 		const json = await res.json();

// 		if (json && json.target) {
// 			console.log('🎯 Target Iframe URL:\n' + json.target);
// 		} else {
// 			console.error('⚠️ No target found in response:', json);
// 		}
// 	} catch (err) {
// 		console.error('❌ Error fetching iframe link:', err.message);
// 	}
// })();
import express from 'express';
import axios from 'axios';
import { ddosGuardBypass } from 'axios-ddos-guard-bypass';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const app = express();
const PORT = process.env.PORT || 3000;

const targetUrl = 'https://animepahe.ru/';

app.get('/', async (req, res) => {
	try {
		const cookieJar = new CookieJar();

		// Create axios instance and wrap with cookie support
		const client = wrapper(
			axios.create({ jar: cookieJar, withCredentials: true })
		);

		// Inject ddos-guard bypass logic
		ddosGuardBypass(client);

		const response = await client.get(targetUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
				Referer: targetUrl,
			},
			timeout: 30000,
		});

		res.type('text/plain').send(response.data);
	} catch (error) {
		console.error('❌ Error:', error.message);
		res.status(500).send('Failed to fetch site content.');
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Route to fetch and display animepahe.ru HTML

// https://api.anime.nexus/api/anime/details/episode/stream?id=9e9ee84c-3163-479b-9533-c432eb94164e&fillers=true&recaps=true

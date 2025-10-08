import axios from 'axios';
import { ddosGuardBypass } from 'axios-ddos-guard-bypass';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

//  unused function , made in case animepahe cookie dies on me

export async function scrapeUrl(targetUrl: string): Promise<string> {
	// if (!targetUrl.startsWith('https://animepahe.si')) {
	// 	throw new Error(
	// 		'Blocked: Only animepahe.si URLs are allowed , idk why , only animepahe uses ddg'
	// 	);
	// }

	try {
		const cookieJar = new CookieJar();
		const client = wrapper(
			axios.create({ jar: cookieJar, withCredentials: true })
		);

		ddosGuardBypass(client);

		const response = await client.get(targetUrl, {
			headers: {
				authority: 'animepahe.si',
				accept: 'application/json, text/javascript, */*; q=0.01',
				'accept-language': 'en-US,en;q=0.9',
				cookie: '__ddg2_=;',
				dnt: '1',
				'sec-ch-ua':
					'"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'x-requested-with': 'XMLHttpRequest',
				referer: targetUrl,
				'user-agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
			},
			timeout: 30000,
		});

		return response.data;
	} catch (error: any) {
		console.error('scrapeUrl error:', error.message);
		throw new Error('Failed to fetch: ' + error.message);
	}
}

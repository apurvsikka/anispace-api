import axios from 'axios';
import { ddosGuardBypass } from 'axios-ddos-guard-bypass';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

//  unused function , made in case animepahe cookie dies on me

export async function scrapeUrl(targetUrl: string): Promise<string> {
	if (!targetUrl.startsWith('https://animepahe.si')) {
		throw new Error(
			'Blocked: Only animepahe.ru URLs are allowed , idk why , only animepahe uses ddg'
		);
	}

	try {
		const cookieJar = new CookieJar();
		const client = wrapper(
			axios.create({ jar: cookieJar, withCredentials: true })
		);

		ddosGuardBypass(client);

		const response = await client.get(targetUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
				Referer: targetUrl,
			},
			timeout: 30000,
		});

		return response.data;
	} catch (error: any) {
		console.error('scrapeUrl error:', error.message);
		throw new Error('Failed to fetch: ' + error.message);
	}
}

import axios from 'axios';

const ANIMEPAHE = 'https://animepahe.ru';

export async function AnimeOnPahe(session: string,page:number = 1) {
	const url = `${ANIMEPAHE}/api?m=release&id=${encodeURIComponent(session)}&sort=episode_desc&page=${page}`;
	console.log(url	)
	try {
		const response = await axios.get(url, {
			headers: {
				authority: 'animepahe.ru',
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
				referer: url,
				'user-agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
			},
		});

		// AnimePahe puts results inside .data.data
		return response;
	} catch (err: any) {
		console.error('AnimePahe search error:', err.message);
		throw new Error('Failed to search AnimePahe');
	}
}

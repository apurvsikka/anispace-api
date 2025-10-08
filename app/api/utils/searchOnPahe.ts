import axios from 'axios';
import { scrapeUrl } from './bypassDDG';

const ANIMEPAHE = 'https://animepahe.si';

export async function searchAnimepahe(query: string) {
	const url = `${ANIMEPAHE}/api?m=search&q=${query}`;
	console.log(url);

	try {
		const response = await scrapeUrl(url);
		// console.log(response);
		return response;
	} catch (err: any) {
		console.error('AnimePahe search error:', err.message);
		throw new Error('Failed to search AnimePahe');
	}
}

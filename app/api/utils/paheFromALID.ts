import { ANILIST_GQL, AnimeNameAniListQuery } from '../anime';
import { slugify } from '@/app/api/utils';
import { searchAnimepahe } from '@/app/api/utils/searchOnPahe';

export async function resolveAnimepaheSessionFromAlid(alid: string) {
	try {
		// Step 1: Get English title from AniList
		const res = await fetch(ANILIST_GQL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: AnimeNameAniListQuery,
				variables: { mediaId: alid },
			}),
		});

		const anilist = await res.json();

		const titleRaw = anilist?.data?.Media?.title?.english;
		const year = anilist?.data?.Media?.seasonYear;

		if (!titleRaw) throw new Error('Title not found from AniList');

		const title = slugify(titleRaw.toLowerCase());

		// Step 2: Search AnimePahe
		// const paheMatches = await searchAnimepahe(title);
		// const data = await paheMatches.json();
		const paheRes = await searchAnimepahe(title);
		const paheMatches = Array.isArray(paheRes.data) ? paheRes.data : [];
		// Step 3: Filter by year
		// const match = await paheMatches?.find((entry: any) => entry.year === year);
		const match = paheMatches.find((entry: any) => entry.year === year);
		if (!match) throw new Error('No matching entry on AnimePahe');

		return {
			match,
		};
	} catch (err: any) {
		console.error(' resolveAnimepaheSessionFromAlid error:', err.message);
		throw err;
	}
}

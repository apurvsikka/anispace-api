import { NextRequest, NextResponse } from 'next/server';
import { ANILIST_GQL, AnimeSearchAniListQuery } from '../..';
import { resolveAnimepaheSessionFromAlid } from '@/app/api/utils/paheFromALID';

export async function GET(
	req: NextRequest,
	{ params }: { params: { query: string } }
) {
	const { query } = params;
	const urlParams = req.nextUrl.searchParams;

	const page = Number(urlParams.get('page') || '1');
	const perPage = Number(urlParams.get('perPage') || '8');

	try {
		const anilistRes = await fetch(ANILIST_GQL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: AnimeSearchAniListQuery,
				variables: { search: query, page, perPage },
			}),
		});

		const json = await anilistRes.json();

		const pageInfo = json?.data?.Page?.pageInfo;
		const results = json?.data?.Page?.media;

		if (!results || results.length === 0) {
			return NextResponse.json({ pageInfo, results: [] });
		}

		const enrichedResults = await Promise.all(
			results.map(async (anime: any) => {
				try {
					const pahe = await resolveAnimepaheSessionFromAlid(
						anime.id
					);
					return {
						...anime,
						// animePaheSession: pahe?.session || null,
						pahe,
					};
				} catch (err) {
					console.warn(
						`Could not resolve AnimePahe session for AniList ID ${anime.id}`
					);
					return { ...anime, animePaheSession: null };
				}
			})
		);

		return NextResponse.json({ pageInfo, results: enrichedResults });
	} catch (err: any) {
		console.error('Search route error:', err.message);
		return NextResponse.json(
			{ error: 'Failed to fetch AniList results' },
			{ status: 500 }
		);
	}
}

import axios from 'axios';
import * as Cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import { ANILIST_GQL, AnimePageAniListQuery } from '..';
// maxpage on animegg: 25035
//maxpage on 123animehub: 1

function slugify(text: string) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

type AniListID = number;

type MediaType = 'ANIME' | 'MANGA' | null;

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	let id: AniListID | null = JSON.parse(searchParams.get('id') as string);
	let mtype: MediaType | null = searchParams.get('type') as MediaType;
	const alid = id;
	let results: any = [];
	// const ald = []; //test variable

	try {
		const alres = fetch(ANILIST_GQL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: AnimePageAniListQuery,
				variables: {
					mediaId: id,
					mediaType: 'ANIME',
				},
			}),
		});
		const alresdata = await (await alres).json();
		// console.log(alresdata);
		const coverImage = alresdata['data']['Media']['coverImage'];
		const bannerImage = alresdata['data']['Media']['bannerImage'];
		const duration = alresdata['data']['Media']['duration'];
		const externalLinks = alresdata['data']['Media']['externalLinks'];
		const isAdult = alresdata['data']['Media']['isAdult'];
		const meanScore = alresdata['data']['Media']['meanScore'];
		const relations = alresdata['data']['Media']['relations']['edges'];

		// ald.push();
		let mappingsprovider: string = `https://find-my-anime.dtimur.de/api?id=${id}&provider=Anilist&collectionConsent=false`;
		const amres = fetch(mappingsprovider);
		const amresdata = await (await amres).json();
		const type = amresdata[0].type;
		const episodes = await amresdata[0].episodes;
		const released = await amresdata[0].animeSeason;
		const status = await amresdata[0].status;
		const synonyms = await amresdata[0].synonyms;
		const metaMappings = await amresdata[0].providerMapping;
		const studios = await amresdata[0].studios;
		const producers = await amresdata[0].producers;

		results = {
			bannerImage,
			coverImage,
			metaMappings,
			type,
			isAdult,
			status,
			meanScore,
			duration,
			episodes,
			released,
			synonyms,
			studios,
			producers,
			externalLinks,
			relations,
		};
	} catch (err) {
		console.error('ERROR:', err);
	}

	return NextResponse.json({
		// ald,
		results,
	});
}

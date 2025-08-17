import axios from 'axios';
import * as Cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import { ANIMEHUB, ANIMEGG, KAIZE } from '..';
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

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	let id: string | null = searchParams.get('id');
	let kaize: string = '';
	let AnimePlanet: string = '';
	!id ? console.error('no id provided') : (kaize = `${KAIZE}/anime/${id}`);
	!id ? console.error('no id provided') : (AnimePlanet = `${KAIZE}/anime/${id}`);
	console.log(kaize);
	let results: any = [];

	try {
		const { data: kaizeData } = await axios.get(kaize);
		const $ = Cheerio.load(kaizeData);
		const romaji = $('.right > .main-datas > .name-from > h1')
			.text()
			.trim();
		const english = $(
			'.details-list > .element:nth-of-type(1) > span.value'
		)
			.text()
			.trim();
		const animeggID = slugify(english);
		const animehubID = id;
		const synopsis = $('.synopsis.keep-break')
			.text()
			.trim()
			.split('\n')
			.join('');

		let mappingsprovider: string = `https://find-my-anime.dtimur.de/api?id=${animeggID}&provider=AnimePlanet&collectionConsent=false`;
		const amres = fetch(mappingsprovider);
		const amresdata = await (await amres).json();
		const type = amresdata[0].type 
		const episodes = await amresdata[0].episodes
		const released = await amresdata[0].animeSeason
		const status = await amresdata[0].status
		const synonyms = await amresdata[0].synonyms
		const metaMappings = await amresdata[0].providerMapping;
		const studios = await amresdata[0].studios
		const producers = await amresdata[0].producers


		results = {
			title: {
				romaji,
				english,
			},
			id: {
				animeggID,
				animehubID,
			},
			metaMappings,
			episodes,
			status,
			released,
			studios,
			producers,
			synopsis,
			synonyms,
			type,
		};
	} catch (err) {
		console.error('ERROR:', err);
	}

	return NextResponse.json({
		results,
	});
}

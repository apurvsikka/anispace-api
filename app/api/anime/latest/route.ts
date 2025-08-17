import axios from 'axios';
import * as Cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import { ANIMEHUB, ANIMEGG } from '..';
// maxpage on animegg: 25035
//maxpage on 123animehub: 1
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	let page: number = parseInt(searchParams.get('page') || '0', 10);
	let url: string = '';
	page <= 1
		? (url = `${ANIMEGG}/releases?start=0`)
		: (url = `${ANIMEGG}/releases?start=${(page * 10) / 2}`);
	        const location = req.nextUrl.origin;
		const results: any[] = [];


	try {
		const { data } = await axios.get(url);
		const $ = Cheerio.load(data);
        $('li.fea.release').each((_,el) => {
            const id = $(el).find('div.rightpop.release > a').attr('href')?.replace('/series/','')
            const title = $(el).find('div.rightpop.release > a').text().trim()
            const latestEpisode = $(el).find('div.rightpop.release > ul.tags > li > a').attr('href')?.split('/')[1]

            results.push({
                id,
                title,
                latestEpisode
            })
        })
	} catch (err) {
		console.error('ERROR:', err);
	}

	return NextResponse.json({
        results
    });
}

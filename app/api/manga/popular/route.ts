import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.mangakakalot.gg';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get('page') || '1', 10);
	const url = `${BASE_URL}/manga-list/hot-manga?type=topview&category=all&state=all&page=${page}`;

	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);
		const results: any[] = [];
		const location = req.nextUrl.origin;

		$('.list-comic-item-wrap').each((_, element) => {
			const title = $(element).find('h3 > a').text().trim();
			const id =
				$(element)
					.find('h3 a')
					.attr('href')
					?.replace(`${BASE_URL}/manga/`, '') || '';
			const image = `${location}/api/manga/thumb/${encodeURIComponent(`${$(element).find('img').attr('src')}`)}`;
			const latestChapter = $(element)
				.find('.list-story-item-wrap-chapter')
				.text()
				.trim();
			const description = $(element)
				.find('p')
				.text()
				.trim()
				.replace(/\s+/g, ' ')
				.replace(/\n/g, ' ');

			results.push({ title, image, id, latestChapter, description });
		});

		const totalResults =
			JSON.parse(
				$('.group_qty > .page_blue').text().trim().split(' ')[1] || '0'
			) || 0;

		const pageLimit =
			JSON.parse(
				$('.page_last').text().trim().split('(')[1]?.split(')')[0] ||
					'999'
			) || 999;

		return NextResponse.json({
			currentPage: page,
			hasNextPage: page < pageLimit,
			totalResults,
			pageLimit,
			results,
		});
	} catch (error) {
		console.error('Error fetching top manga list:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch top manga list.' },
			{ status: 500 }
		);
	}
}

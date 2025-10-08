import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://www.mangakakalot.gg';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get('page') || '1', 10);
	const url = `${BASE_URL}/manga-list/latest-manga?category=all&state=all&page=${page}`;
	const location = req.nextUrl.origin;
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);
		const results: any[] = [];

		$('.list-comic-item-wrap').each((_, element) => {
			const title = $(element).find('h3 > a').text().trim();
			const link = $(element).find('h3 > a').attr('href');
			const latestChapter = $(element)
				.find('.list-story-item-wrap-chapter')
				.text()
				.trim();
			const id = link?.split('/manga/').pop() ?? '';
			const description = $(element)
				.find('p')
				.text()
				.trim()
				.replace(/\s+/g, ' ')
				.replace(/\n/g, ' ');
			const image = `${location}/api/manga/thumb/${encodeURIComponent(`${$(element).find('img').attr('src')}`)}`;

			results.push({
				id,
				title,
				image,
				latestChapter,
				description,
			});
		});

		const pageLimit =
			JSON.parse(
				$('.page_last').text().trim().split('(')[1].split(')')[0] ||
					'999'
			) || 999;

		const hasNextPage = page < pageLimit;

		const totalResults =
			JSON.parse(
				$('.group_qty > .page_blue').text().trim().split(' ')[1] || '0'
			) || 0;

		return NextResponse.json({
			currentPage: page,
			hasNextPage,
			pageLimit,
			totalResults,
			results,
		});
	} catch (error) {
		console.error('Error fetching latest manga list:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch latest manga list.' },
			{ status: 500 }
		);
	}
}

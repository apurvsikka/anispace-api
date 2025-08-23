// app/api/manga/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface MangaResult {
	id: string | null;
	title: string;
	image?: string;
	link?: string;
	latestChapter?: string | number;
}

export interface PaginatedMangaResponse<T> {
	query?: string;
	currentPage: number;
	hasNextPage: boolean;
	pageLimit: number;
	totalResults: number;
	results: T[];
}

export async function GET(req: NextRequest) {
	const urlParams = req.nextUrl.searchParams;
	const query = urlParams.get('query');
	const page = Number(urlParams.get('page') || '1');

	if (!query) {
		return NextResponse.json(
			{ error: 'Query is required' },
			{ status: 400 }
		);
	}

	const formattedQuery = query.trim().replace(/\s+/g, '_').toLowerCase();
	const url = `https://mangakakalot.gg/search/story/${formattedQuery}`;

	let pageLimit = 999;
	let totalResults = 0;

	try {
		const { data } = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
				referer: 'https://mangakakalot.gg',
			},
		});

		const $ = cheerio.load(data);
		const results: MangaResult[] = [];
		const location = req.nextUrl.origin;

		$('.panel_story_list .story_item').each((_, element) => {
			const title = $(element)
				.find('.story_item_right .story_name')
				.text()
				.trim();
			const link =
				$(element)
					.find('.story_item_right .story_name a')
					.attr('href') ?? undefined;
			const latestChapter =
				JSON.parse(
					$(element)
						.find('.story_item_right .story_chapter')
						.text()
						.trim()
						.split(' ')[1]
				) || 'N/A';
			const id = link?.split('/').pop() ?? null;
			const image = `${location}/api/manga/thumb/${encodeURIComponent(`${$(element).find('img').attr('src')}`)}`;

			results.push({ id, title, image, link, latestChapter });

			const lastPageText = $('.page_last').text().trim();
			if (lastPageText.includes('(')) {
				pageLimit =
					Number(lastPageText.split('(')[1].split(')')[0]) || 999;
			}

			const totalText = $('.group_qty > .page_blue').text().trim();
			if (totalText.includes(' ')) {
				totalResults = Number(totalText.split(' ')[1]) || 0;
			}
		});

		return NextResponse.json({
			query: formattedQuery,
			currentPage: page,
			hasNextPage: page < pageLimit,
			pageLimit,
			totalResults,
			results,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch search results.' },
			{ status: 500 }
		);
	}
}

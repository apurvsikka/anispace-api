// app/api/manga/all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface GenericMangaListResponse {
	id: string;
	title: string;
	image?: string;
	latestChapter?: string;
	description?: string;
}

export interface PaginatedMangaResponse<T> {
	currentPage: number;
	hasNextPage: boolean;
	pageLimit: number;
	totalResults: number;
	results: T[];
}

export async function GET(req: NextRequest) {
	const page = Number(req.nextUrl.searchParams.get('page') || '1');
	const url = `https://mangakakalot.gg/genre/all?state=all&type=latest&filter=5&page=${page}`;

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
		const results: GenericMangaListResponse[] = [];
		const location = req.nextUrl.origin;

		$('.list-truyen-item-wrap').each((_, element) => {
			const title = $(element).find('h3 > a').text().trim();
			const link = $(element).find('h3 > a').attr('href') ?? '';
			const latestChapter = $(element)
				.find('.list-story-item-wrap-chapter')
				.text()
				.trim();
			const id = link.split('/').pop() ?? '';
			const image = `${location}/api/manga/thumb/${encodeURIComponent(`${$(element).find('img').attr('src')}`)}`;
			const description = $(element)
				.find('p')
				.text()
				.trim()
				.replace(/\s+/g, ' ')
				.replace(/\n/g, ' ');
			results.push({ id, title, image, latestChapter, description });
			const lastPageText = $('.page_last').text().trim();
			if (lastPageText.includes('(')) {
				pageLimit =
					Number(lastPageText.split('(')[1].split(')')[0]) || 999;
			}
		});

		const totalText = $('.group_qty > .page_blue').text().trim();
		if (totalText.includes(' ')) {
			totalResults = Number(totalText.split(' ')[1]) || 0;
		}

		return NextResponse.json({
			currentPage: page,
			hasNextPage: page < pageLimit,
			pageLimit,
			totalResults,
			results,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch latest manga list.' },
			{ status: 500 }
		);
	}
}

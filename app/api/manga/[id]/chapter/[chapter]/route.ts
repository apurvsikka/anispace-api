// app/api/manga/[mangaId]/chapter/[chapterId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface MangaChapterInfo {
	MangaName: string;
	chapterNumber: string;
	images: string[];
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string; chapter: string } }
) {
	const { id, chapter } = params;
	const url = `https://mangakakalot.gg/manga/${id}/chapter-${chapter}`; // replace with your actual base URL

	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);
		const location = req.nextUrl.origin;
		const mangaPages: string[] = [];

		const MangaName = $('.info-top-chapter')
			.text()
			.trim()
			.split('Chapter')[0]
			.trim();

		$('.container-chapter-reader img').each((_, element) => {
			const src = $(element).attr('src');
			if (!src) return;
			// Extract the unique part of the URL to use in your API image route
			const pageUrl = src.split('/')[5].split('.')[0];
			mangaPages.push(`${location}/api/manga/${id}/chapter/${chapter}/image/${pageUrl}`);
		});

		// Optional: remove the last image if needed
		mangaPages.pop();

		const response: MangaChapterInfo = {
			MangaName,
			chapterNumber: chapter,
			images: mangaPages,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error fetching chapter info:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch chapter info.' },
			{ status: 500 }
		);
	}
}

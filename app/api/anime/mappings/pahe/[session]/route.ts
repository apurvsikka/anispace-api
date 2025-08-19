import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ANIMEPAHE_SEARCH = 'https://animepahe.ru/api?m=search&q=';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get('query');

	if (!query) {
		return NextResponse.json({ error: 'Missing query param' }, { status: 400 });
	}

	let currentPage = 1;
	let results: any[] = [];
	let hasMore = true;

	while (hasMore) {
		const url = `${ANIMEPAHE_SEARCH}${encodeURIComponent(query)}&page=${currentPage}`;
		const response = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
				'X-Requested-With': 'XMLHttpRequest',
			},
		});

		const data = response.data;

		if (data?.data?.length) {
			results.push(...data.data);
			currentPage++;
			hasMore = currentPage <= data.last_page;
		} else {
			hasMore = false;
		}
	}

	return NextResponse.json({ results });
}

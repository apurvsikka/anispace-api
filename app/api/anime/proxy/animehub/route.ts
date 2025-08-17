import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const anime = req.nextUrl.searchParams.get('anime');
	const episode = req.nextUrl.searchParams.get('episode');

	if (!anime || !episode) {
		return NextResponse.json(
			{ error: 'Missing anime or episode' },
			{ status: 400 }
		);
	}
	const proto = req.headers.get('x-forwarded-proto') || 'http';
	const host = req.headers.get('host');
	const localUrl = `${proto}://${host}/api/anime/watch/${anime}/${episode}`;
	let playerAjaxProvider: string;
	let headers: Record<string, string>;

	const metaRes = await fetch(localUrl);
	const meta = await metaRes.json();
	playerAjaxProvider = meta.playerAjaxProvider;
	headers = meta.headers;

	if (!playerAjaxProvider || !headers) {
		return NextResponse.json(
			{ error: 'Missing playerAjaxProvider or headers' },
			{ status: 502 }
		);
	}

	try {
		const iframeRes = await fetch(playerAjaxProvider, {
			headers: {
				...headers,
				Accept: 'application/json',
			},
		});

		const json = await iframeRes.json();

		if (json && json.target) {
			return NextResponse.json({ iframe: json.target });
		} else {
			return NextResponse.json(
				{ error: 'Target iframe not found' },
				{ status: 404 }
			);
		}
	} catch (err: any) {
		return NextResponse.json(
			{ error: 'Failed to fetch iframe: ' + err.message },
			{ status: 500 }
		);
	}
}

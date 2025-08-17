import axios from 'axios';
import * as Cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import { ANIMEHUB, ANIMEGG } from '../../..';

export async function GET(
	req: NextRequest,
	context: { params: { anime: string; episode: string } }
) {
	const { anime, episode } = context.params;

	const playerAjaxProvider = `${ANIMEHUB}/ajax/episode/info?epr=${encodeURIComponent(`${anime+'/'}${episode+'/jwplayer.com'}`)}`;
	const headers = {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
		Referer: ANIMEHUB + '/',
		Origin: ANIMEHUB,
		'X-Requested-With': 'XMLHttpRequest',
	};

	return NextResponse.json({ playerAjaxProvider,headers });
}

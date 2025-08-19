import { NextRequest, NextResponse } from 'next/server';
import { resolveAnimepaheSessionFromAlid } from '@/app/api/utils/paheFromALID';

export async function GET(
	req: NextRequest,
	{ params }: { params: { alid: string } }
) {
	try {
		const data = await resolveAnimepaheSessionFromAlid(params.alid);
		return NextResponse.json({ animePahe: data.animePahe });
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

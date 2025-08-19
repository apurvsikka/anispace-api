import { NextRequest, NextResponse } from 'next/server';

const rateLimitWindowMs = 60 * 1000;
const maxRequests = 100;

const ipRequestMap = new Map<string, { count: number; timestamp: number }>();
const ORIGIN_WHITELIST = [
	'https://anispace-api.vercel.app',
	'http://localhost:3000',
	'::ffff',
];

setInterval(
	() => {
		const now = Date.now();
		for (const [ip, { timestamp }] of ipRequestMap.entries()) {
			if (now - timestamp > rateLimitWindowMs) {
				ipRequestMap.delete(ip);
			}
		}
	},
	5 * 60 * 1000
);

function getClientIp(req: NextRequest): string {
	const forwardedFor = req.headers.get('x-forwarded-for');
	const realIp = req.headers.get('x-real-ip');

	const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
	console.log(`Client IP: ${clientIp}`);
	return clientIp;
}

export function middleware(req: NextRequest) {
	const ip = getClientIp(req);
	const origin = req.headers.get('origin');
	if (origin && ORIGIN_WHITELIST.includes(origin)) {
		return NextResponse.next();
	}
	const now = Date.now();
	const record = ipRequestMap.get(ip);

	if (record) {
		if (now - record.timestamp < rateLimitWindowMs) {
			if (record.count >= maxRequests) {
				console.log(`Too many requests from IP: ${ip}`);
				return new NextResponse(
					JSON.stringify({ error: 'Too many requests' }),
					{
						status: 429,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			} else {
				ipRequestMap.set(ip, {
					count: record.count + 1,
					timestamp: record.timestamp,
				});
			}
		} else {
			ipRequestMap.set(ip, { count: 1, timestamp: now });
		}
	} else {
		ipRequestMap.set(ip, { count: 1, timestamp: now });
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/api/:path*'],
};

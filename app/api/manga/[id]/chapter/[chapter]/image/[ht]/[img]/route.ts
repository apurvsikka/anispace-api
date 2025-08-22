import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: {
    params: { id: string; chapter: string; ht: string; img: string };
  }
) {
  try {
    const { id, chapter, ht, img } = context.params;

    const host =
      ht === '1' ? 'imgs-2.2xstorage.com' : 'img-r1.2xstorage.com';

    const url = `https://${host}/${encodeURIComponent(id)}/${chapter}/${img}.webp`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0',
        Accept:
          'image/avif,image/webp,image/png,image/*;q=0.8,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.5',
        Referer: 'https://www.mangakakalot.gg/',
        DNT: '1',
      },
    });

    if (!response.ok) {
      console.error("Fetch failed:", response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch chapter image' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contentType =
      response.headers.get('content-type') || 'image/webp';

    // safer to fully buffer it
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('proxyChapterImage error:', err);
    return new Response(
      JSON.stringify({ error: 'Error proxying chapter image' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

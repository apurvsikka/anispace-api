import { NextRequest, NextResponse } from 'next/server';
import { request, gql } from 'graphql-request';

const ANILIST_API = 'https://graphql.anilist.co';

const QUERY_BY_NAME = gql`
  query ($search: String) {
    Media(search: $search, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
    }
  }
`;

const QUERY_BY_ID = gql`
  query ($id: Int) {
    Media(id: $id, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
    }
  }
`;

// basic slugify: lowercases, removes non-alphanum, replaces spaces/hyphens with -
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const manga = searchParams.get('kakalot');
  const id = searchParams.get('al');

  try {
    if (manga) {
      const data:any = await request(ANILIST_API, QUERY_BY_NAME, { search: manga });

      return NextResponse.json({
        id: data.Media.id,
        title: data.Media.title,
      });
    } else if (id) {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      }

      const data:any = await request(ANILIST_API, QUERY_BY_ID, { id: numericId });
      const romaji = data.Media.title.romaji;
      let mangaData: never[] = [];
      await fetch(`${getAbsoluteURL(req, `/api/manga/${slugify(romaji)}`)}`)
      .then(data => data.json())
      .then(res => mangaData = res)

      return NextResponse.json({
        id: slugify(romaji),
        anilistId: data.Media.id,
        data: mangaData
      });
    } else {
      return NextResponse.json(
        { error: 'Please provide either `kakalot` or `al` query parameter.' },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
function getAbsoluteURL(req: NextRequest, path: string) {
  const host = req.headers.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}${path}`;
}

import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10) // ensure integer

    const ALQUERY = `
query Media($id: Int) {
  Media(id: $id) {
    relations {
      edges {
        relationType
        node {
          id
          type
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            color
            large
            medium
          }
        }
      }
    }
  }
}

    `;

    const response = await fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			query: ALQUERY,
			variables: { id: id },
		}),
		cache: 'no-store',
	});

    const data = await response.json()
    const d = await data.data.Media.relations.edges
    return NextResponse.json(d)
  } catch (error) {
    console.error("Error in GET /api/manga/info/[id]:", error)
    return NextResponse.json(
      { error: "Failed to fetch manga info" },
      { status: 500 }
    )
  }
}

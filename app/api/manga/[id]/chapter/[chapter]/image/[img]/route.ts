import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string; chapter: string; img: string };
  }
) {
  const { id: manga, chapter, img } = params;
  const url = `https://imgs-2.2xstorage.com/${encodeURIComponent(manga)}/${chapter}/${img}.webp`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0",
        Accept:
          "image/avif,image/jxl,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        Referer: "https://www.mangakakalot.gg/",
        DNT: "1",
      },
    });

    if (!response.ok || !response.body) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch chapter image" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const contentType = response.headers.get("content-type") || "image/webp";

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("proxyChapterImage error:", err);
    return new Response(
      JSON.stringify({ error: "Error proxying chapter image" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

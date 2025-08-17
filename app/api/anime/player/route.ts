import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://123animehub.cc";

export async function GET(req: NextRequest) {
  const epr = req.nextUrl.searchParams.get("epr"); // like: "one-piece/1/ // do not encode
  if (!epr) {
    return NextResponse.json({ error: "Missing 'epr' parameter" }, { status: 400 });    
  }

	const proto = req.headers.get('x-forwarded-proto') || 'http';
	const host = req.headers.get('host');
    const anime = epr.split('/')[0]
    const ep = epr.split('/')[1]
	const infoUrl = `${proto}://${host}/api/anime/proxy/animehub?anime=${anime}&episode=${ep}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Referer: `${BASE_URL}/`,
    Origin: BASE_URL,
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    const res = await fetch(infoUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch iframe: ${res.statusText}` },
        { status: res.status }
      );
    }

    const json = await res.json();

    const iframe = json.iframe;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Video Player</title>
  <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
  <style>
    :root {
      --plyr-color-main: #007bff;
    }
    body {
      margin: 0;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      box-shadow: 0 0 20px #007bff55;
    }
  </style>
</head>
<body>
  <iframe allowfullscreen src="${iframe}"></iframe>
  <script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>
</body>
</html>
`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

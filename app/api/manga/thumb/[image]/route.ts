import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { image: string } }
) {
	let image = params.image;
	let url = `https://img-r1.2xstorage.com/thumb/${encodeURIComponent(image)}.webp`;

	if (image.startsWith("http://") || image.startsWith("https://")) {
		url = image;
	}

	try {
		const response = await fetch(url, {
			headers: {
				Host: "img-r1.2xstorage.com",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0)",
				Accept: "image/avif,image/webp,image/*,*/*;q=0.5",
				Referer: "https://www.mangakakalot.gg/",
			},
		});

		if (!response.ok || !response.body) {
			return NextResponse.json(
				{ error: "Failed to fetch image" },
				{ status: 500 }
			);
		}

		const contentType =
			response.headers.get("content-type") || "image/webp";
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		return new NextResponse(buffer, {
			headers: {
				"Content-Type": contentType,
			},
		});
	} catch (err) {
		console.error("proxyThumb error:", err);
		return NextResponse.json(
			{ error: "Error proxying thumbnail image" },
			{ status: 500 }
		);
	}
}

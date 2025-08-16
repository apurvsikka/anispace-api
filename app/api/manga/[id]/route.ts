import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import * as React from 'react'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const  {id} = await params
		const url = `https://mangakakalot.gg/manga/${id}`; // update this base URL if needed

		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const gen_temp = $(".genres")
			.text()
			.trim()
			.replace(/\s+/g, " ")
			.replace(/\n/g, " ");
		const genres =
			gen_temp
				.split(": ")[1]
				.split(",")
				.map((genre) => genre.trim())
				.filter((g) => g !== "") ?? [];
			const location = req.nextUrl.origin;

		const mangaInfo = {
			title: $(".manga-info-text > li > h1").text().trim(),
			image: `${location}/api/manga/thumb/${id}`,
			altTitle:
				$(".story-alternative")
					.text()
					.trim()
					.split(":")[1]
					?.trim()
					.split(" / ") || [],
			authors: $(".manga-info-text > li:nth-child(2) > a")
				.map((_, el) => $(el).text().trim())
				.get(),
			description: $("#contentBox")
				.text()
				.trim()
				.split("summary: ")[1]
				?.replace(/\s+/g, " ")
				.replace(/\n/g, ""),
			status:
				$(".manga-info-text > li:nth-child(3)")
					.text()
					.trim()
					.split(":")[1]
					?.trim() || "",
			genres,
			updatedOn:
				$(".manga-info-text > li:nth-child(4)")
					.text()
					.trim()
					.split("updated : ")[1]
					.split(" ") || [],
			chapters: [] as {
				chapterName: string;
				chapterNumber: string | null;
				timeOfUpload: string | string[];
			}[],
		};

		$(".chapter-list > .row").each((_, element) => {
			const chapterName = $(element).find("span > a").attr("title") || "";
			const chapterLink = $(element).find("span > a").attr("href");
			const chapterNumberMatch = chapterLink?.match(/chapter-(\d+)/);
			const chapterNumber = chapterNumberMatch ? chapterNumberMatch[1] : null;
			const timeOfUpload = $(element).find("span:nth-child(3)").text().trim();

			mangaInfo.chapters.push({
				chapterName,
				chapterNumber,
				timeOfUpload: timeOfUpload.includes("ago")
					? timeOfUpload
					: timeOfUpload.split(" "),
			});
		});

		return NextResponse.json(mangaInfo);
	} catch (error) {
		console.error("Error in GET /api/manga/info/[id]:", error);
		return new NextResponse("Failed to fetch manga info", { status: 500 });
	}
}

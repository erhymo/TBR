
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

type Source = {
	name: string;
	url: string;
	articleSelector: string;
};

const sources: Source[] = [
	{
		name: "E24",
		url: "https://e24.no",
		articleSelector: "a",
	},
	{
		name: "DN",
		url: "https://www.dn.no",
		articleSelector: "a",
	},
	{
		name: "Finansavisen",
		url: "https://finansavisen.no",
		articleSelector: "a",
	},
	{
		name: "VG",
		url: "https://vg.no",
		articleSelector: "a",
	},
	{
		name: "Aftenposten",
		url: "https://aftenposten.no",
		articleSelector: "a",
	},
	{
		name: "NRK Økonomi",
		url: "https://www.nrk.no/okonomi/",
		articleSelector: "a",
	},
	{
		name: "Hegnar",
		url: "https://www.hegnar.no",
		articleSelector: "a",
	},
	{
		name: "Sysla",
		url: "https://sysla.no",
		articleSelector: "a",
	},
	{
		name: "Energi24",
		url: "https://energi24.no",
		articleSelector: "a",
	},
	{
		name: "Skipsrevyen",
		url: "https://www.skipsrevyen.no",
		articleSelector: "a",
	},
];

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q")?.toLowerCase() || "";
	const results: { source: string; title: string; url: string }[] = [];
	const errors: { source: string; error: string }[] = [];

	for (const source of sources) {
		try {
			const res = await axios.get(source.url);
			const $ = cheerio.load(res.data);
			$(source.articleSelector).each((_: number, el) => {
				const element = $(el);
				const title = element.text().trim();
				const href = element.attr("href");
				if (title.toLowerCase().includes(query) && href) {
					results.push({
						source: source.name,
						title,
						url: href.startsWith("http") ? href : source.url + href,
					});
				}
			});
		} catch (err: any) {
			errors.push({ source: source.name, error: err?.message || "Ukjent feil" });
		}
	}

	return NextResponse.json({ articles: results, errors });
}

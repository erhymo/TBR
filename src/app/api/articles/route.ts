import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

type Article = {
  source: string;
  title: string;
  url: string;
  published: string;
};

async function fetchE24Articles(query: string): Promise<Article[]> {
  const url = "https://e24.no";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const articles: Article[] = [];

  $(".article-teaser__title").each((_: number, el: any) => {
    const title = $(el).text().trim();
    const parent = $(el).closest("a");
    const href = parent.attr("href");
    const published = parent.find("time").attr("datetime") || "";

    if (
      title.toLowerCase().includes(query.toLowerCase())
    ) {
      articles.push({
        source: "E24",
        title,
        url: href ? (href.startsWith("http") ? href : url + href) : url,
        published,
      });
    }
  });

  // Sorter etter publiseringsdato (nyeste først)
  articles.sort((a, b) => (b.published > a.published ? 1 : -1));
  return articles.slice(0, 10);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json({ articles: [] });
  }

  // Utvid med flere kilder senere
  const e24 = await fetchE24Articles(query);

  return NextResponse.json({ articles: e24 });
}
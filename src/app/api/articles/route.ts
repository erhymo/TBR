
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type Article = {
  source: string;
  date?: string;
  title?: string;
  url?: string;
};

const sources = [
  { name: 'E24', url: 'https://e24.no/rss' },
  { name: 'Finansavisen', url: 'https://finansavisen.no/rss' },
  { name: 'Hegnar', url: 'https://www.hegnar.no/rss' },
  // Legg til flere RSS-feeds her hvis tilgjengelig
];

export async function GET() {
  const parser = new Parser();
  const articles: Article[] = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      feed.items.slice(0, 10).forEach((item) => {
        articles.push({
          source: source.name,
          date: typeof item.pubDate === 'string' ? item.pubDate : '',
          title: typeof item.title === 'string' ? item.title : '',
          url: typeof item.link === 'string' ? item.link : '',
        });
      });
    } catch {
      // Hopp over kilder som feiler
    }
  }

  return NextResponse.json(articles.slice(0, 10));
}

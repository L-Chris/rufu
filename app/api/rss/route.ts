import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  creator?: string;
  isoDate?: string;
}

export async function GET(request: Request) {
  const parser = new Parser();
  const { searchParams } = new URL(request.url);
  const sources = JSON.parse(searchParams.get('sources') || '[]');

  try {
    const items: RSSItem[] = [];

    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.url);
        const sourceItems = feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          contentSnippet: item.contentSnippet,
          creator: item.creator,
          isoDate: item.isoDate
        }));
        items.push(...sourceItems);
      } catch (error) {
        console.error(`Error fetching RSS from ${source.url}:`, error);
      }
    }

    // 按发布日期排序
    items.sort((a, b) => {
      const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
      const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error processing RSS feeds:', error);
    return NextResponse.json({ error: '无法处理RSS源' }, { status: 500 });
  }
}
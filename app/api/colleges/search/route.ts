import { NextRequest, NextResponse } from 'next/server';
import { COLLEGES_DATABASE, CollegeRecord } from '@/lib/registration/colleges-data';

const searchCache = new Map<string, CollegeRecord[]>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();
    const city = (searchParams.get('city') || '').trim().toLowerCase();

    const cacheKey = `${query}_${city}`;
    if (searchCache.has(cacheKey)) {
      return NextResponse.json({
        results: searchCache.get(cacheKey),
        source: 'cache',
      });
    }

    let matches = COLLEGES_DATABASE;

    if (query) {
      matches = matches.filter((col) => {
        const nameMatch = col.name.toLowerCase().includes(query);
        const cityMatch = col.city.toLowerCase().includes(query);
        const stateMatch = col.state.toLowerCase().includes(query);
        const aliasMatch = col.aliases.some((alias) => alias.toLowerCase().includes(query));
        return nameMatch || cityMatch || stateMatch || aliasMatch;
      });
    }

    if (city) {
      matches = matches.filter((col) => col.city.toLowerCase() === city);
    }

    if (query) {
      matches = matches.sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(query) || a.aliases.some((al) => al.toLowerCase() === query);
        const bExact = b.name.toLowerCase().startsWith(query) || b.aliases.some((al) => al.toLowerCase() === query);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    if (searchCache.size > 100) {
      searchCache.clear();
    }
    searchCache.set(cacheKey, matches);

    return NextResponse.json({
      results: matches.slice(0, 20),
      source: 'local_database',
      total: matches.length,
    });
  } catch (error) {
    console.error('[colleges/search]', error);
    return NextResponse.json({ error: 'Failed to search colleges', results: [] }, { status: 500 });
  }
}


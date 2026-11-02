// app/api/colleges/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { COLLEGES_DATABASE, CollegeRecord } from '@/lib/registration/colleges-data';

// In-memory cache for search terms
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

    // Filter by query (name, alias, city, state, or address)
    if (query) {
      matches = matches.filter((col) => {
        const nameMatch = col.name.toLowerCase().includes(query);
        const cityMatch = col.city.toLowerCase().includes(query);
        const stateMatch = col.state.toLowerCase().includes(query);
        const aliasMatch = col.aliases.some((alias) => alias.toLowerCase().includes(query));
        return nameMatch || cityMatch || stateMatch || aliasMatch;
      });
    }

    // Optional filter by city
    if (city) {
      matches = matches.filter((col) => col.city.toLowerCase() === city);
    }

    // Sort: Exact name or alias match first
    if (query) {
      matches = matches.sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(query) || a.aliases.some(al => al.toLowerCase() === query);
        const bExact = b.name.toLowerCase().startsWith(query) || b.aliases.some(al => al.toLowerCase() === query);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    // Cache the result (cap at 100 entries)
    if (searchCache.size > 100) {
      searchCache.clear();
    }
    searchCache.set(cacheKey, matches);

    return NextResponse.json({
      results: matches,
      source: 'local_database',
      total: matches.length,
    });
  } catch (error) {
    console.error('[colleges/search]', error);
    return NextResponse.json({ error: 'Failed to search colleges', results: [] }, { status: 500 });
  }
}

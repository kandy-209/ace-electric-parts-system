/**
 * API Route: Search parts with ML/AI matching
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';
import { OpenAI } from 'openai';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createSupabaseAdmin();

    if (!search) {
      // Simple category filter
      let query = supabase.from('parts').select('*').limit(limit);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data: parts, error } = await query;

      if (error) {
        throw error;
      }

      return NextResponse.json({ parts: parts || [], count: parts?.length || 0 });
    }

    // AI-powered semantic search
    // 1. Get all parts (or category-filtered)
    let query = supabase.from('parts').select('*').limit(500);
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: allParts, error: fetchError } = await query;

    if (fetchError || !allParts || allParts.length === 0) {
      return NextResponse.json({ parts: [], count: 0 });
    }

    // 2. Use AI to rank parts by relevance
    const rankingPrompt = `Rank these parts by relevance to the search query.

Search Query: "${search}"

Parts:
${allParts.map((p, i) => `
${i}. Part #${p.part_number}
   Description: ${p.description}
   Manufacturer: ${p.manufacturer || 'N/A'}
   Category: ${p.category || 'N/A'}
`).join('\n')}

Return JSON array with relevance scores (0-1) and brief explanation:
{
  "matches": [
    {
      "index": 0,
      "relevance_score": 0.95,
      "reason": "Exact match on part description"
    }
  ]
}`;

    try {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at matching parts to search queries. Return only valid JSON.',
          },
          {
            role: 'user',
            content: rankingPrompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const aiResults = JSON.parse(completion.choices[0].message.content || '{}');
      const matches = aiResults.matches || [];

      // 3. Sort and filter by relevance
      const rankedParts = matches
        .filter((m: any) => m.relevance_score >= 0.3)
        .sort((a: any, b: any) => b.relevance_score - a.relevance_score)
        .slice(0, limit)
        .map((m: any) => ({
          ...allParts[m.index],
          relevance_score: m.relevance_score,
          match_reason: m.reason,
        }));

      return NextResponse.json({
        parts: rankedParts,
        count: rankedParts.length,
      });
    } catch (aiError) {
      console.error('AI ranking error, falling back to text search:', aiError);
      
      // Fallback to simple text search
      const { data: parts, error } = await supabase
        .from('parts')
        .select('*')
        .or(`description.ilike.%${search}%,part_number.ilike.%${search}%,manufacturer.ilike.%${search}%`)
        .limit(limit);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        parts: parts || [],
        count: parts?.length || 0,
      });
    }
  } catch (error: any) {
    console.error('Search parts error:', error);
    return NextResponse.json(
      { error: 'Failed to search parts', details: error.message },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key server-side
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch latest Google reviews from Supabase
    const { data, error } = await supabase
      .from('google_reviews')
      .select('id, author_name, rating, review_text, review_time, profile_photo_url')
      .order('review_time', { ascending: false })
      .limit(50) // fetch latest 50 reviews

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    // Map to frontend-friendly structure
    const reviews = (data || []).map((r: any) => ({
      id: r.id,
      author_name: r.author_name,
      rating: r.rating,
      text: r.review_text,
      time: r.review_time,
      profile_photo_url: r.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.author_name)}`,
    }))

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

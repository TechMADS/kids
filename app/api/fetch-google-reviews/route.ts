import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseClient'

export async function GET() {
  const PLACE_ID = process.env.GOOGLE_PLACE_ID!
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY!

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`

  const res = await fetch(url)
  const json = await res.json()

  const reviews = json?.result?.reviews || []

  const supabase = supabaseServer()

  for (const r of reviews) {
    await supabase.from('google_reviews').upsert({
      google_review_id: r.time.toString(),
      author_name: r.author_name,
      rating: r.rating,
      review_text: r.text,
      review_time: new Date(r.time * 1000).toISOString(),
      raw: r,
    })
  }

  return NextResponse.json({ success: true, count: reviews.length })
}

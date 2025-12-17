import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabaseClient'

const ADMIN_KEY = process.env.ADMIN_KEY || ''

function checkAdmin(req: Request) {
  const key = req.headers.get('x-admin-key') || ''
  return ADMIN_KEY && key === ADMIN_KEY
}

export async function GET(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const perPage = Number(url.searchParams.get('per_page') || '25')

  const from = (page - 1) * perPage
  const to = page * perPage - 1

  const supabase = supabaseServer()
  const { data, error } = await supabase
    .from('reviews')
    .select('id,created_at,customer_name,phone_hash,dob,review_text,rating,google_review_url,score,purchase_id,metadata,rewarded')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('admin list error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const { id, rewarded } = body || {}
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = supabaseServer()
  const { data, error } = await supabase.from('reviews').update({ rewarded: !!rewarded }).eq('id', id).select('*').single()
  if (error) {
    console.error('admin update error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

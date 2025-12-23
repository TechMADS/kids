import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabaseClient'

const ADMIN_VIEW_KEY = process.env.ADMIN_VIEW_KEY || ''
const ADMIN_SYNC_KEY = process.env.ADMIN_SYNC_KEY || ''
const EDGE_SYNC_URL = process.env.SUPABASE_EDGE_SYNC_URL || ''

function getAdminMode(req: Request): 'view' | 'sync' | null {
  const key = req.headers.get('x-admin-key') || ''
  if (key === ADMIN_VIEW_KEY) return 'view'
  if (key === ADMIN_SYNC_KEY) return 'sync'
  return null
}

/* ---------------- GET : View reviews ---------------- */

export async function GET(req: Request) {
  const mode = getAdminMode(req)
  if (mode !== 'view')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const perPage = Number(url.searchParams.get('per_page') || '25')

  const from = (page - 1) * perPage
  const to = page * perPage - 1

  const supabase = supabaseServer()
  const { data, error } = await supabase
    .from('reviews')
    .select(
      'id,created_at,customer_name,phone_hash,dob,review_text,rating,google_review_url,score,purchase_id,metadata,rewarded'
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('admin list error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

/* ---------------- PATCH : Reward update ---------------- */

export async function PATCH(req: Request) {
  const mode = getAdminMode(req)
  if (mode !== 'view')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { id, rewarded } = body || {}

  if (!id)
    return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = supabaseServer()
  const { data, error } = await supabase
    .from('reviews')
    .update({ rewarded: !!rewarded })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('admin update error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

/* ---------------- POST : Trigger Google review fetch ---------------- */

export async function POST(req: Request) {
  const mode = getAdminMode(req)
  if (mode !== 'sync')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  if (!EDGE_SYNC_URL) {
    return NextResponse.json({ error: 'Edge URL not configured' }, { status: 500 })
  } 

  try {
    const res = await fetch(EDGE_SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const text = await res.text()

    return NextResponse.json({
      success: true,
      edgeResponse: text,
    })
  } catch (err) {
    console.error('Edge sync error', err)
    return NextResponse.json({ error: 'Failed to trigger sync' }, { status: 500 })
  }
}

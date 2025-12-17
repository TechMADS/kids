import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseClient'
import crypto from 'crypto'
import { computeScore } from '../../../lib/score'

const PHONE_SECRET = process.env.REVIEW_PHONE_SECRET || ''

function encryptPhone(phone: string) {
  if (!PHONE_SECRET) return null
  const iv = crypto.randomBytes(12)
  const key = crypto.createHash('sha256').update(PHONE_SECRET).digest()
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(phone, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const {
    customerName,
    phone,
    dob,
    reviewText,
    rating,
    googleReviewUrl,
    purchaseId,
    submittedFromQr = true,
  } = body || {}

  // Basic validation
  if (!purchaseId) {
    return NextResponse.json({ error: 'purchaseId is required (one review per purchase)' }, { status: 400 })
  }
  if (!phone) {
    return NextResponse.json({ error: 'phone is required' }, { status: 400 })
  }
  if (!reviewText) {
    return NextResponse.json({ error: 'reviewText is required' }, { status: 400 })
  }

  const phoneTrim = String(phone).trim()
  const phoneHash = crypto.createHash('sha256').update(phoneTrim).digest('hex')
  const phoneEncrypted = encryptPhone(phoneTrim)

  const score = computeScore({ rating, reviewText, googleReviewUrl, dob })

  const supabase = supabaseServer()

  // Prevent duplicate review for same purchase
  const { data: existing, error: fetchErr } = await supabase
    .from('reviews')
    .select('id')
    .eq('purchase_id', purchaseId)
    .limit(1)

  if (fetchErr) {
    console.error('Error checking existing review:', fetchErr)
    // proceed — insertion will fail on unique index if needed
  }

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'A review already exists for this purchase' }, { status: 409 })
  }

  const metadata = {
    ip: req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || null,
    submittedFromQr: !!submittedFromQr,
  }

  const { data, error } = await supabase.from('reviews').insert({
    customer_name: customerName || null,
    phone_hash: phoneHash,
    phone_encrypted: phoneEncrypted,
    dob: dob || null,
    review_text: reviewText,
    rating: typeof rating === 'number' ? rating : null,
    google_review_url: googleReviewUrl || null,
    score,
    purchase_id: purchaseId,
    metadata,
    submitted_from_qr: !!submittedFromQr,
  }).select('*').single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message || 'Insert failed' }, { status: 500 })
  }

  // Return a minimal response (no phone data) for privacy
  return NextResponse.json({ id: data.id, score: Number(data.score) }, { status: 201 })
}

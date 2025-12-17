import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

async function main() {
  const purchaseId = `test-${Date.now()}`
  const payload = {
    customer_name: 'Test User',
    phone_hash: 'hash-test',
    dob: null,
    review_text: 'This is an automated test review (delete me).',
    rating: 5,
    google_review_url: null,
    score: 95,
    purchase_id: purchaseId,
    metadata: { test: true },
    submitted_from_qr: true,
  }

  console.log('Attempting insert for purchase_id:', purchaseId)

  const { data, error } = await supabase.from('reviews').insert([payload]).select('*').single()
  if (error) {
    console.error('Insert error:', error)
    process.exit(2)
  }
  console.log('Insert success, id:', data.id)

  // fetch the inserted row to verify
  const { data: found, error: fetchErr } = await supabase.from('reviews').select('*').eq('purchase_id', purchaseId).single()
  if (fetchErr) {
    console.error('Fetch error:', fetchErr)
    process.exit(3)
  }
  console.log('Found row:', { id: found.id, score: found.score, purchase_id: found.purchase_id })
}

main().catch((e) => {
  console.error('Unexpected error', e)
  process.exit(99)
})

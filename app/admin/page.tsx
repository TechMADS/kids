'use client'

import { useState } from 'react'

type Review = {
  id: string
  created_at: string
  customer_name?: string
  phone_hash?: string
  dob?: string
  review_text?: string
  rating?: number
  google_review_url?: string
  score?: number
  purchase_id?: string
  metadata?: any
  rewarded?: boolean
}

/* ---------------- SCORE LOGIC ---------------- */
const calculateScore = (text?: string): number | null => {
  if (!text || !text.trim()) return null

  let score = 1
  const len = text.length

  if (len >= 10) score = 2
  if (len >= 40) score = 3
  if (len >= 100) score = 4

  const positiveWords = ['excellent', 'awesome', 'great', 'amazing', 'good', 'best']
  if (positiveWords.some(w => text.toLowerCase().includes(w))) {
    score = Math.min(score + 1, 5)
  }

  return score
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  /* ---------------- FETCH REVIEWS ---------------- */
  const fetchReviews = async () => {
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { 'x-admin-key': adminKey.trim() },
      })
      const json = await res.json()
      if (!res.ok) setErr(json.error || 'Failed to fetch')
      else setReviews(json.data || [])
    } catch {
      setErr('Network error')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- TOGGLE REWARD ---------------- */
  const toggleReward = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ id, rewarded: !current }),
      })

      const json = await res.json()
      if (!res.ok) setErr(json.error || 'Update failed')
      else setReviews(r => r.map(x => (x.id === id ? json.data : x)))
    } catch {
      setErr('Network error')
    }
  }

  /* ---------------- SYNC GOOGLE REVIEWS ---------------- */
  const syncGoogleReviews = async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey.trim() },
      })
      const json = await res.json()
      if (!res.ok) setErr(json.error || 'Sync failed')
      else alert('Google reviews fetched successfully')
    } catch {
      setErr('Network error')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- ENTER KEY HANDLER ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      if (adminKey.trim() === 'techmads') syncGoogleReviews()
      else fetchReviews()
    }
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-full overflow-x-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Admin – Reviews</h1>

      {/* Admin Key */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="flex-1 px-4 py-3 rounded-lg border"
          placeholder="Admin Key"
          value={adminKey}
          type="password"
          onChange={e => setAdminKey(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-60"
          disabled={loading}
          onClick={adminKey === 'techmads' ? syncGoogleReviews : fetchReviews}
        >
          {loading ? 'Loading...' : 'Fetch Reviews'}
        </button>
      </div>

      {/* Error */}
      {err && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {err}
        </div>
      )}

      {/* Reviews Table */}
      <div className="overflow-x-auto bg-card rounded-xl p-4">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Purchase ID</th>
              <th className="px-4 py-3 text-left">Score</th>
              <th className="px-4 py-3 text-left">Review</th>
              <th className="px-4 py-3 text-left">Rewarded</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {reviews.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-muted">
                  No reviews found
                </td>
              </tr>
            )}

            {reviews.map(r => {
              const score = calculateScore(r.review_text)

              return (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm">
                    {new Date(r.created_at).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">{r.customer_name || '—'}</td>

                  <td className="px-4 py-3 font-mono text-sm">
                    {r.purchase_id}
                  </td>

                  <td className="px-4 py-3 font-bold">
                    {score ?? (
                      <span className="italic text-gray-500">
                        Review Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    {r.review_text?.trim() ? (
                      <p className="line-clamp-2">{r.review_text}</p>
                    ) : (
                      <span className="italic text-gray-500">
                        Review Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {r.rewarded ? '✅ Yes' : '❌ No'}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleReward(r.id, !!r.rewarded)}
                      className={`px-3 py-1 rounded text-sm ${
                        r.rewarded
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {r.rewarded ? 'Unreward' : 'Reward'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}

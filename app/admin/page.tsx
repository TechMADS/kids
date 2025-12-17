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

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const fetchReviews = async () => {
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews', { headers: { 'x-admin-key': adminKey } })
      const json = await res.json()
      if (!res.ok) setErr(json.error || 'Failed to fetch')
      else setReviews(json.data || [])
    } catch (e) {
      setErr('Network error')
    } finally {
      setLoading(false)
    }
  }

  const toggleReward = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ id, rewarded: !current }),
      })
      const json = await res.json()
      if (!res.ok) {
        setErr(json.error || 'Update failed')
      } else {
        setReviews((r) => r.map((x) => (x.id === id ? json.data : x)))
      }
    } catch (e) {
      setErr('Network error')
    }
  }

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Admin - Reviews</h1>
        <div>
          <input className="input" placeholder="Admin Key" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} style={{ marginRight: 8 }} />
          <button className="btn btn-primary" onClick={fetchReviews} disabled={loading}>{loading ? 'Loading…' : 'Fetch Reviews'}</button>
        </div>
      </div>

      {err && <p style={{ color: 'red' }}>{err}</p>}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Created</th>
              <th>Name</th>
              <th>Purchase ID</th>
              <th>Score</th>
              <th>Review</th>
              <th>Rewarded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.customer_name || '—'}</td>
                <td>{r.purchase_id}</td>
                <td><span className="badge">{r.score}</span></td>
                <td style={{ maxWidth: 420 }}>{r.review_text?.slice(0, 200)}</td>
                <td>{r.rewarded ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-ghost" onClick={() => toggleReward(r.id, !!r.rewarded)}>{r.rewarded ? 'Unreward' : 'Reward'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

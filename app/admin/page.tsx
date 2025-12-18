'use client';

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
    <main className="container mx-auto px-4 py-6 sm:py-8 max-w-full overflow-x-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:gap-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Admin - Reviews
        </h1>
        
        {/* Admin Key Input and Fetch Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input 
            className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Admin Key" 
            value={adminKey} 
            onChange={(e) => setAdminKey(e.target.value)}
            type="password"
          />
          <button 
            className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-bold min-h-[44px] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={fetchReviews} 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading…
              </span>
            ) : 'Fetch Reviews'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {err && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 dark:bg-red-900/20 dark:text-red-400 dark:border-red-400">
          <p className="font-medium">{err}</p>
        </div>
      )}

      {/* Reviews Table */}
      <div className="card bg-card rounded-2xl p-4 sm:p-6">
        <div className="overflow-x-auto -mx-4 sm:-mx-6 -mb-6 sm:-mb-8">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-surface">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    Purchase ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    Review
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    Rewarded
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {r.customer_name || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {r.purchase_id}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="badge font-bold">
                          {r.score || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs">
                        <div className="line-clamp-2 text-ellipsis overflow-hidden">
                          {r.review_text || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center gap-1 ${r.rewarded ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {r.rewarded ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Yes
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              No
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button 
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[36px] ${
                            r.rewarded 
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                          }`}
                          onClick={() => toggleReward(r.id, !!r.rewarded)}
                        >
                          {r.rewarded ? 'Unreward' : 'Reward'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="text-muted text-sm">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <svg className="animate-spin h-6 w-6 text-accent" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Loading reviews...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <svg className="w-12 h-12 text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="font-medium">No reviews found</p>
                              <p className="text-sm mt-1">Enter admin key and click "Fetch Reviews"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        {reviews.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
            <div>
              Showing <span className="font-semibold">{reviews.length}</span> review{reviews.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Rewarded: {reviews.filter(r => r.rewarded).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Pending: {reviews.filter(r => !r.rewarded).length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Optimized View (Optional alternative for very small screens) */}
      <div className="block sm:hidden mt-6">
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card bg-card p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{r.customer_name || 'Anonymous'}</h3>
                  <p className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <span className="badge text-xs">{r.score}</span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted">Purchase ID</p>
                <p className="font-mono text-sm">{r.purchase_id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted">Review</p>
                <p className="text-sm line-clamp-2">{r.review_text || '—'}</p>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className={`text-sm ${r.rewarded ? 'text-green-600' : 'text-red-600'}`}>
                  {r.rewarded ? '✅ Rewarded' : '❌ Not Rewarded'}
                </span>
                <button 
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    r.rewarded 
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-green-50 text-green-700'
                  }`}
                  onClick={() => toggleReward(r.id, !!r.rewarded)}
                >
                  {r.rewarded ? 'Unreward' : 'Reward'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
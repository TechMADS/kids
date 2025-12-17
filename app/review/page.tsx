'use client'

import { useState } from 'react'

export default function ReviewPage() {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    dob: '',
    reviewText: '',
    rating: '5',
    googleReviewUrl: '',
    purchaseId: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          dob: form.dob,
          reviewText: form.reviewText,
          rating: Number(form.rating),
          googleReviewUrl: form.googleReviewUrl,
          purchaseId: form.purchaseId,
          submittedFromQr: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'An error occurred')
      } else {
        setMessage(`Thanks! Your score: ${data.score}. ID: ${data.id}`)
        setForm({ customerName: '', phone: '', dob: '', reviewText: '', rating: '5', googleReviewUrl: '', purchaseId: '' })
      }
    } catch (err) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <section className="hero card fade-in">
        <div>
          <h2>Share feedback & earn rewards</h2>
          <p>Scan the QR in-store or paste the purchase ID from your receipt to submit a review and receive your credit score.</p>
          <div style={{ marginTop: 16 }}>
            <a href="/r/scan" className="btn btn-primary">Open Scan Page</a>
          </div>
        </div>
        <div style={{ width: 220, textAlign: 'center' }}>
          <img src="/logo.svg" alt="bike" style={{ width: 120, height: 120, opacity: 0.95 }} />
          <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>Scan QR at checkout</div>
        </div>
      </section>

      <div className="card fade-in" style={{ marginTop: 18 }}>
        <h1 style={{ marginTop: 0 }}>Submit your review</h1>
        <p style={{ color: 'var(--muted)', marginTop: 6 }}>One review per purchase — enter the purchase ID from your receipt.</p>

        <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Name</label>
            <input className="input" name="customerName" value={form.customerName} onChange={onChange} />
          </div>

          <div className="field">
            <label>Phone</label>
            <input className="input" name="phone" value={form.phone} onChange={onChange} required />
          </div>

          <div className="field">
            <label>Date of Birth</label>
            <input className="input" name="dob" value={form.dob} onChange={onChange} type="date" />
          </div>

          <div className="field">
            <label>Purchase ID (on receipt)</label>
            <input className="input" name="purchaseId" value={form.purchaseId} onChange={onChange} required />
          </div>

          <div className="field">
            <label>Rating</label>
            <select className="input" name="rating" value={form.rating} onChange={onChange}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Okay</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <div className="field">
            <label>Google Review URL (optional)</label>
            <input className="input" name="googleReviewUrl" value={form.googleReviewUrl} onChange={onChange} />
          </div>

          <div className="field">
            <label>Review</label>
            <textarea className="input" name="reviewText" value={form.reviewText} onChange={onChange} rows={5} required />
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit & Get Score'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setForm({ customerName: '', phone: '', dob: '', reviewText: '', rating: '5', googleReviewUrl: '', purchaseId: '' })}>Reset</button>
          </div>

          {message && <div style={{ marginTop: 8 }}><div className="badge">{message}</div></div>}
        </form>
      </div>
    </main>
  )
}

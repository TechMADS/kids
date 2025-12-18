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
    <>
      {/* Hero Section */}
      <section className="hero-gradient rounded-2xl p-6 sm:p-10 mb-6 fade-in">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Share feedback & earn rewards
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
              Scan the QR in-store or paste the purchase ID from your receipt to submit a review and receive your credit score.
            </p>
            <div>
              <a
                href="/r/scan"
                className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-bold inline-block hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
              >
                Open Scan Page
              </a>
            </div>
          </div>
          <div className="text-center">
            <img
              src="/logo.svg"
              alt="bike"
              className="w-24 h-24 sm:w-32 sm:h-32 opacity-95 mx-auto"
            />
            <div className="text-muted text-sm mt-3">
              Scan QR at checkout
            </div>
          </div>
        </div>
      </section>

      {/* Review Form */}
      <div className="card bg-card rounded-2xl p-6 sm:p-8 fade-in">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Submit your review
        </h1>
        <p className="text-muted text-sm sm:text-base mb-6">
          One review per purchase — enter the purchase ID from your receipt.
        </p>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Name</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                name="customerName"
                value={form.customerName}
                onChange={onChange}
                placeholder="Your name"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
                placeholder="Your phone number"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                name="dob"
                value={form.dob}
                onChange={onChange}
              />
            </div>

            {/* Purchase ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">
                Purchase ID (on receipt) <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                name="purchaseId"
                value={form.purchaseId}
                onChange={onChange}
                required
                placeholder="e.g., ABCD-1234"
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Rating</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                name="rating"
                value={form.rating}
                onChange={onChange}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Okay</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>

            {/* Google Review URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">
                Google Review URL (optional)
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                name="googleReviewUrl"
                value={form.googleReviewUrl}
                onChange={onChange}
                placeholder="https://g.page/r/..."
              />
            </div>

            {/* Review Text - Full Width */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted">
                Review <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[120px] resize-y"
                name="reviewText"
                value={form.reviewText}
                onChange={onChange}
                required
                placeholder="Share your experience..."
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-bold flex-1 min-h-[44px] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit & Get Score'}
              </button>
              <button
                type="button"
                onClick={() => setForm({ customerName: '', phone: '', dob: '', reviewText: '', rating: '5', googleReviewUrl: '', purchaseId: '' })}
                className="px-6 py-3 rounded-lg font-bold border border-border bg-transparent hover:bg-surface min-h-[44px] transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className="md:col-span-2 mt-4">
                <div className="message p-4 rounded-lg">
                  {message}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
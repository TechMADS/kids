'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface GoogleReview {
  id: string
  author_name: string
  rating: number
  text: string
  time: string
  profile_photo_url?: string
}

export default function ReviewPage() {
  const router = useRouter()
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
  const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(false)

  // Fetch Google Reviews
  useEffect(() => {
    fetchGoogleReviews()
  }, [])

  const fetchGoogleReviews = async () => {
    try {
      setReviewsLoading(true)
      const res = await fetch('/api/google-reviews')
      const data = await res.json()
      if (res.ok) {
        setGoogleReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching Google reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

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
        setMessage(`Thanks! Your score: ${data.score}. Redirecting to Google Reviews...`)

        // Clear form
        setForm({ 
          customerName: '', 
          phone: '', 
          dob: '', 
          reviewText: '',
          rating: '5', 
          googleReviewUrl: '', 
          purchaseId: '' })

        // Redirect to Google Reviews after 2 seconds
        setTimeout(() => {
          window.open('https://g.page/r/CRvWy46b4ntPEBM/review', '_blank')
        }, 2000)
      }
    } catch (err) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  // Calculate average rating
  const averageRating = googleReviews.length > 0
    ? (googleReviews.reduce((acc, review) => acc + review.rating, 0) / googleReviews.length).toFixed(1)
    : '0.0'

  // Display limited or all reviews
  const displayedReviews = showAllReviews ? googleReviews : googleReviews.slice(0, 3)

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
              After submission, you'll be redirected to leave a Google Review.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* <a
                href="/r/scan"
                className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-bold inline-block hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg text-center"
              >
                Open Scan Page
              </a> */}
              <a
                href="https://g.page/r/CRvWy46b4ntPEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-bold border border-border bg-transparent hover:bg-surface transition-colors text-center"
              >
                Go to Google Reviews
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Review Form - Takes 2/3 on desktop */}
        <div className="lg:col-span-2">
          <div className="card bg-card rounded-2xl p-6 sm:p-8 fade-in">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Submit Your Details
            </h1>
            <p className="text-muted text-sm sm:text-base mb-6">
              One review per purchase — enter the purchase ID from your receipt. After submission, you'll be redirected to Google Reviews.
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
                {/* <div className="space-y-2">
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
                </div> */}

                {/* Google Review URL - Optional */}
                {/* <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">
                    Already reviewed? Paste URL (optional)
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    name="googleReviewUrl"
                    value={form.googleReviewUrl}
                    onChange={onChange}
                    placeholder="https://g.page/r/..."
                  />
                </div> */}

                {/* Buttons */}
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-bold flex-1 min-h-[44px] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit & Go to Google Reviews'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ 
                      customerName: '', 
                      phone: '', 
                      dob: '', 
                      reviewText: '',
                      rating: '5', 
                      googleReviewUrl: '',
                      purchaseId: '' 
                    })}
                    className="px-6 py-3 rounded-lg font-bold border border-border bg-transparent hover:bg-surface min-h-[44px] transition-colors"
                  >
                    Clear Form
                  </button>
                </div>

                {/* Message */}
                {message && (
                  <div className="md:col-span-2 mt-4">
                    <div className={`p-4 rounded-lg ${message.includes('Thanks')
                        ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                        : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                      }`}>
                      <div className="flex items-center gap-2">
                        {message.includes('Thanks') ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-sm font-medium">{message}</span>
                      </div>
                      {message.includes('Thanks') && (
                        <div className="mt-2 text-xs text-green-700 dark:text-green-400">
                          You will be redirected automatically in 2 seconds...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Google Reviews Sidebar - Takes 1/3 on desktop */}
        <div className="lg:col-span-1">
          <div className="card bg-card rounded-2xl p-6 sm:p-8 fade-in h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Google Reviews</h2>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-2xl font-bold">{averageRating}</span>
                <span className="text-muted text-sm">({googleReviews.length} reviews)</span>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-surface"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-surface rounded w-24 mb-1"></div>
                        <div className="h-3 bg-surface rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-surface rounded mb-2"></div>
                    <div className="h-3 bg-surface rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : googleReviews.length > 0 ? (
              <div className="space-y-6">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-border last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={review.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.author_name}`}
                        alt={review.author_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{review.author_name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-muted ml-1">
                            {new Date(review.time).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">{review.text}</p>
                  </div>
                ))}

                {googleReviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full py-3 rounded-lg font-medium border border-border bg-transparent hover:bg-surface transition-colors text-sm"
                  >
                    {showAllReviews ? 'Show Less' : `Show All ${googleReviews.length} Reviews`}
                  </button>
                )}

                <div className="pt-4 border-t border-border">
                  <a
                    href="https://g.page/r/CRvWy46b4ntPEBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-bold bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 transition-colors shadow-sm text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    View on Google
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-muted text-sm">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {googleReviews.length > 0 && (
        <div className="card bg-card rounded-2xl p-6 mb-6 fade-in">
          <h3 className="text-lg font-bold mb-4">Review Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-surface">
              <div className="text-3xl font-bold text-accent">{averageRating}</div>
              <div className="text-sm text-muted mt-1">Average Rating</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface">
              <div className="text-3xl font-bold text-accent">{googleReviews.length}</div>
              <div className="text-sm text-muted mt-1">Total Reviews</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface">
              <div className="text-3xl font-bold text-accent">
                {googleReviews.filter(r => r.rating === 5).length}
              </div>
              <div className="text-sm text-muted mt-1">5-Star Reviews</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface">
              <div className="text-3xl font-bold text-accent">
                {Math.round((googleReviews.filter(r => r.rating >= 4).length / googleReviews.length) * 100)}%
              </div>
              <div className="text-sm text-muted mt-1">Positive Reviews</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
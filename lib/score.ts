export type ScoreInput = {
  rating?: number | null
  reviewText?: string | null
  googleReviewUrl?: string | null
  dob?: string | null
}

export function computeScore(input: ScoreInput) {
  const { rating, reviewText, googleReviewUrl } = input
  let score = 50 // base

  if (typeof rating === 'number') {
    score = Math.min(100, Math.max(0, rating * 20))
  }

  if (reviewText) {
    const len = reviewText.trim().length
    if (len > 100) score += 10
    else if (len > 50) score += 5
  }

  if (googleReviewUrl) score += 15

  // clamp
  score = Math.max(0, Math.min(100, Math.round(score)))
  return score
}

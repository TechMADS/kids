import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // For Google Reviews, you typically need to:
    // 1. Use Google Places API or
    // 2. Use Google My Business API or
    // 3. Use a third-party service
    
    // Example using a mock service or your own database
    // Since we can't directly fetch from Google without API key and server-side
    
    // For now, returning mock data
    // In production, you would:
    // - Store Google Reviews in your database when users submit them
    // - Or fetch from Google Places API with a valid API key
    
    const mockReviews = [
      {
        id: '1',
        author_name: 'John Doe',
        rating: 5,
        text: 'Excellent service and great quality bikes! Will definitely come back.',
        time: '2024-01-15T10:30:00Z',
        profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      {
        id: '2',
        author_name: 'Jane Smith',
        rating: 4,
        text: 'Good experience overall. Staff was helpful but wait time was a bit long.',
        time: '2024-01-10T14:20:00Z',
        profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
      {
        id: '3',
        author_name: 'Mike Johnson',
        rating: 5,
        text: 'Best bike shop in town! They fixed my bike in no time.',
        time: '2024-01-05T09:15:00Z',
        profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      },
      {
        id: '4',
        author_name: 'Sarah Williams',
        rating: 5,
        text: 'Love my new mountain bike! The team helped me choose the perfect one.',
        time: '2024-01-02T16:45:00Z',
        profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      {
        id: '5',
        author_name: 'Alex Chen',
        rating: 4,
        text: 'Great selection of bikes. Prices are reasonable too.',
        time: '2023-12-28T11:10:00Z',
        profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
    ]

    return NextResponse.json({ reviews: mockReviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: 'Not authenticated with Spotify' },
                { status: 401 }
            )
        }

        // Get track ID and album ID from query parameters
        const { searchParams } = new URL(request.url)
        const trackId = searchParams.get('trackId')
        const albumId = searchParams.get('albumId')

        if (!trackId) {
            return NextResponse.json(
                { error: 'Track ID is required' },
                { status: 400 }
            )
        }

        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}&limit=50`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        )

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(
                { error: 'Failed to fetch recommendations', details: error },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extract album cover image URLs from recommended tracks
        // Filter out tracks from the same album as the currently playing track
        const covers = data.tracks
            .filter((track: any) => !albumId || track.album.id !== albumId)
            .map((track: any) => track.album.images[0]?.url)
            .filter(Boolean)
            .slice(0, 30) // Limit to 30 covers after filtering

        return NextResponse.json({ covers })
    } catch (error) {
        console.error('Error fetching recommendations:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

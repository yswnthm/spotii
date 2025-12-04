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

        const response = await fetch(
            'https://api.spotify.com/v1/browse/new-releases?limit=30',
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        )

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(
                { error: 'Failed to fetch new releases', details: error },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extract cover image URLs
        const covers = data.albums.items.map((album: any) => album.images[0]?.url).filter(Boolean)

        return NextResponse.json({ covers })
    } catch (error) {
        console.error('Error fetching new releases:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

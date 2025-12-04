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
            'https://api.spotify.com/v1/me/player/currently-playing',
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        )

        // 204 No Content means nothing is playing
        if (response.status === 204) {
            return NextResponse.json({
                isPlaying: false,
                track: null,
            })
        }

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(
                { error: 'Failed to fetch currently playing track', details: error },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extract relevant track information
        const trackInfo = {
            isPlaying: data.is_playing,
            track: data.item ? {
                id: data.item.id,
                name: data.item.name,
                artists: data.item.artists.map((artist: any) => artist.name),
                artistIds: data.item.artists.map((artist: any) => artist.id),
                albumCover: data.item.album.images[0]?.url,
                duration: data.item.duration_ms,
                progressMs: data.progress_ms,
                availableMarkets: data.item.available_markets || [],
            } : null,
        }

        return NextResponse.json(trackInfo)
    } catch (error) {
        console.error('Error fetching currently playing track:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type PlaybackAction = 'play' | 'pause' | 'next' | 'previous'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: 'Not authenticated with Spotify' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { action } = body as { action: PlaybackAction }

        if (!action || !['play', 'pause', 'next', 'previous'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be: play, pause, next, or previous' },
                { status: 400 }
            )
        }

        // Map actions to Spotify endpoints
        const endpoints: Record<PlaybackAction, { method: string; url: string }> = {
            play: {
                method: 'PUT',
                url: 'https://api.spotify.com/v1/me/player/play',
            },
            pause: {
                method: 'PUT',
                url: 'https://api.spotify.com/v1/me/player/pause',
            },
            next: {
                method: 'POST',
                url: 'https://api.spotify.com/v1/me/player/next',
            },
            previous: {
                method: 'POST',
                url: 'https://api.spotify.com/v1/me/player/previous',
            },
        }

        const endpoint = endpoints[action]

        const response = await fetch(endpoint.url, {
            method: endpoint.method,
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        })

        // Spotify returns 204 No Content on success for these endpoints
        if (response.status === 204) {
            return NextResponse.json({ success: true, action })
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return NextResponse.json(
                { error: `Failed to ${action} playback`, details: error },
                { status: response.status }
            )
        }

        return NextResponse.json({ success: true, action })
    } catch (error) {
        console.error('Error controlling playback:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

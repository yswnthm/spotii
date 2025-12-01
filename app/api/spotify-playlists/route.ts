import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

// Extend NextAuth Session type to include accessToken
declare module "next-auth" {
    interface Session {
        accessToken?: string
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in with Spotify." },
                { status: 401 }
            )
        }

        const accessToken = session.accessToken as string

        // Fetch user's playlists from Spotify
        const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Spotify API error:", errorText)
            return NextResponse.json(
                { error: "Failed to fetch playlists from Spotify", details: errorText },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Format the playlist data
        const playlists = data.items.map((playlist: any) => ({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            image: playlist.images?.[0]?.url || null,
            trackCount: playlist.tracks.total,
            owner: playlist.owner.display_name,
            isPublic: playlist.public,
            url: playlist.external_urls.spotify,
        }))

        return NextResponse.json({
            playlists,
            total: data.total,
        })
    } catch (error) {
        console.error("Get playlists error:", error)
        return NextResponse.json(
            { error: "Failed to fetch playlists" },
            { status: 500 }
        )
    }
}

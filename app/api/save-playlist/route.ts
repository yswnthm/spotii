import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

// Extend NextAuth Session type to include accessToken
declare module "next-auth" {
    interface Session {
        accessToken?: string
    }
}

interface Song {
    title: string
    artist: string
    album?: string
}

interface SavePlaylistRequest {
    playlistName: string
    songs: Song[]
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in with Spotify." },
                { status: 401 }
            )
        }

        const { playlistName, songs }: SavePlaylistRequest = await req.json()

        if (!songs || songs.length === 0) {
            return NextResponse.json(
                { error: "No songs to save" },
                { status: 400 }
            )
        }

        const accessToken = session.accessToken as string

        // Step 1: Get user's Spotify ID
        const userResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!userResponse.ok) {
            const errorText = await userResponse.text()
            console.error("Spotify User Data Error:", errorText)
            throw new Error(`Failed to fetch user data: ${userResponse.status} ${userResponse.statusText}`)
        }

        const userData = await userResponse.json()
        const userId = userData.id

        // Step 2: Create a new playlist
        const createPlaylistResponse = await fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: "Created with Spotii - AI Playlist Generator",
                    public: false,
                }),
            }
        )

        if (!createPlaylistResponse.ok) {
            throw new Error("Failed to create playlist")
        }

        const playlist = await createPlaylistResponse.json()
        const playlistId = playlist.id

        // Step 3: Search for tracks and collect URIs
        const trackUris: string[] = []
        const notFound: Song[] = []

        // Helper function for string similarity (Levenshtein distance based)
        const getSimilarity = (s1: string, s2: string): number => {
            const longer = s1.length > s2.length ? s1 : s2
            const shorter = s1.length > s2.length ? s2 : s1
            const longerLength = longer.length
            if (longerLength === 0) return 1.0

            const costs = new Array()
            for (let i = 0; i <= shorter.length; i++) {
                let lastValue = i
                for (let j = 0; j <= longer.length; j++) {
                    if (i === 0) {
                        costs[j] = j
                    } else {
                        if (j > 0) {
                            let newValue = costs[j - 1]
                            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
                            }
                            costs[j - 1] = lastValue
                            lastValue = newValue
                        }
                    }
                }
                if (i > 0) costs[longer.length] = lastValue
            }
            return (longerLength - costs[longer.length]) / longerLength
        }

        for (const song of songs) {
            // Try multiple search strategies
            let bestMatch: any = null
            let bestScore = 0

            // Strategy 1: Search with Title and Artist (Strict Field Matching)
            let query = `track:${song.title} artist:${song.artist}`
            // If album is present, we can try to include it, but sometimes it's too specific or wrong in AI generation.
            // Let's stick to Title + Artist as primary, and use Album for verification if needed.

            const searchResponse = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )

            if (searchResponse.ok) {
                const searchData = await searchResponse.json()

                for (const track of searchData.tracks.items) {
                    // Calculate similarity score
                    const titleSim = getSimilarity(song.title.toLowerCase(), track.name.toLowerCase())
                    const artistSim = getSimilarity(song.artist.toLowerCase(), track.artists[0].name.toLowerCase())

                    // Weighted score: Title matches are more important, but artist must match somewhat
                    const score = (titleSim * 0.6) + (artistSim * 0.4)

                    if (score > bestScore) {
                        bestScore = score
                        bestMatch = track
                    }
                }
            }

            // Strategy 2: Search with just Title (Field Matching)
            if (bestScore < 0.6) {
                const broadQuery = `track:${song.title}`
                const broadResponse = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(broadQuery)}&type=track&limit=5`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )

                if (broadResponse.ok) {
                    const broadData = await broadResponse.json()
                    for (const track of broadData.tracks.items) {
                        const titleSim = getSimilarity(song.title.toLowerCase(), track.name.toLowerCase())
                        const artistSim = getSimilarity(song.artist.toLowerCase(), track.artists[0].name.toLowerCase())
                        const score = (titleSim * 0.6) + (artistSim * 0.4)

                        if (score > bestScore) {
                            bestScore = score
                            bestMatch = track
                        }
                    }
                }
            }

            // Strategy 3: Plain Text Search (Most Forgiving)
            if (bestScore < 0.5) {
                const plainQuery = `${song.title} ${song.artist}`
                const plainResponse = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(plainQuery)}&type=track&limit=5`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )

                if (plainResponse.ok) {
                    const plainData = await plainResponse.json()
                    for (const track of plainData.tracks.items) {
                        const titleSim = getSimilarity(song.title.toLowerCase(), track.name.toLowerCase())
                        const artistSim = getSimilarity(song.artist.toLowerCase(), track.artists[0].name.toLowerCase())
                        const score = (titleSim * 0.6) + (artistSim * 0.4)

                        if (score > bestScore) {
                            bestScore = score
                            bestMatch = track
                        }
                    }
                }
            }

            // Threshold for accepting a match (Lowered to 0.4 to be more inclusive)
            if (bestMatch && bestScore > 0.4) {
                trackUris.push(bestMatch.uri)
            } else {
                notFound.push(song)
            }
        }

        // Step 4: Add tracks to playlist (if any were found)
        if (trackUris.length > 0) {
            const addTracksResponse = await fetch(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uris: trackUris,
                    }),
                }
            )

            if (!addTracksResponse.ok) {
                throw new Error("Failed to add tracks to playlist")
            }
        }

        return NextResponse.json({
            success: true,
            playlistUrl: playlist.external_urls.spotify,
            tracksAdded: trackUris.length,
            tracksNotFound: notFound.length,
            notFound: notFound,
        })
    } catch (error) {
        console.error("Save playlist error:", error)
        return NextResponse.json(
            { error: "Failed to save playlist to Spotify" },
            { status: 500 }
        )
    }
}

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

        // Get artist ID from query params
        const searchParams = request.nextUrl.searchParams
        const artistId = searchParams.get('artistId')

        interface AlbumData {
            uri: string
            cover: string
        }

        let albums: AlbumData[] = []

        if (artistId) {
            // Fetch albums from the same artist (discography)
            const artistAlbumsResponse = await fetch(
                `https://api.spotify.com/v1/artists/${artistId}/albums?limit=15&include_groups=album,single`,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            )

            if (artistAlbumsResponse.ok) {
                const artistAlbumsData = await artistAlbumsResponse.json()
                const artistAlbums = artistAlbumsData.items
                    .map((album: any) => ({
                        uri: album.uri,
                        cover: album.images[0]?.url
                    }))
                    .filter((a: AlbumData) => a.cover)
                albums.push(...artistAlbums)
            }

            // Fetch related artists and their albums
            const relatedArtistsResponse = await fetch(
                `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            )

            if (relatedArtistsResponse.ok) {
                const relatedArtistsData = await relatedArtistsResponse.json()

                // Get albums from first 3 related artists
                const relatedArtistsToFetch = relatedArtistsData.artists.slice(0, 3)

                for (const artist of relatedArtistsToFetch) {
                    const albumsResponse = await fetch(
                        `https://api.spotify.com/v1/artists/${artist.id}/albums?limit=5&include_groups=album,single`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.accessToken}`,
                            },
                        }
                    )

                    if (albumsResponse.ok) {
                        const albumsData = await albumsResponse.json()
                        const relatedAlbums = albumsData.items
                            .map((album: any) => ({
                                uri: album.uri,
                                cover: album.images[0]?.url
                            }))
                            .filter((a: AlbumData) => a.cover)
                        albums.push(...relatedAlbums)
                    }
                }
            }
        } else {
            // Fallback to global new releases if no artist ID provided
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
            albums = data.albums.items
                .map((album: any) => ({
                    uri: album.uri,
                    cover: album.images[0]?.url
                }))
                .filter((a: AlbumData) => a.cover)
        }

        return NextResponse.json({ albums })
    } catch (error) {
        console.error('Error fetching new releases:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

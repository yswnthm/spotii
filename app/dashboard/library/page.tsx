"use client"

import { useEffect, useState } from "react"
import { Music, Loader2 } from "lucide-react"
import { useRecentPlaylists } from "@/hooks/use-recent-playlists"
import { PlaylistCard, UnifiedPlaylist } from "@/components/playlist-card"
import { StatsPanel } from "@/components/stats-panel"
import { PlaylistDetailsDialog } from "@/components/playlist-details-dialog"

interface SpotifyPlaylist {
    id: string
    name: string
    description: string | null
    image: string | null
    trackCount: number
    owner: string
    isPublic: boolean
    url: string
}

export default function LibraryPage() {
    const { playlists: spotiiPlaylists } = useRecentPlaylists()
    const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([])
    const [isLoadingSpotify, setIsLoadingSpotify] = useState(true)
    const [spotifyError, setSpotifyError] = useState<string | null>(null)

    const [selectedPlaylist, setSelectedPlaylist] = useState<UnifiedPlaylist | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handlePlaylistClick = (playlist: UnifiedPlaylist) => {
        setSelectedPlaylist(playlist)
        setIsDialogOpen(true)
    }

    useEffect(() => {
        const fetchSpotifyPlaylists = async () => {
            try {
                const response = await fetch("/api/spotify-playlists")
                const data = await response.json()

                if (response.ok) {
                    setSpotifyPlaylists(data.playlists)
                } else {
                    setSpotifyError(data.error || "Failed to load playlists")
                }
            } catch (error) {
                console.error("Failed to fetch Spotify playlists:", error)
                setSpotifyError("Failed to load playlists")
            } finally {
                setIsLoadingSpotify(false)
            }
        }

        fetchSpotifyPlaylists()
    }, [])

    // Convert to unified format
    const unifiedSpotifyPlaylists: UnifiedPlaylist[] = spotifyPlaylists.map((p) => ({
        id: `spotify-${p.id}`,
        name: p.name,
        trackCount: p.trackCount,
        image: p.image,
        source: "spotify" as const,
        url: p.url,
        owner: p.owner,
    }))

    const unifiedSpotiiPlaylists: UnifiedPlaylist[] = spotiiPlaylists.map((p) => ({
        id: `spotii-${p.id}`,
        name: p.name,
        trackCount: p.trackCount,
        source: "spotii" as const,
        createdAt: p.createdAt,
        mood: p.mood,
        genre: p.genre,
        songs: p.songs
    }))

    // Combine all playlists
    const allPlaylists = [...unifiedSpotifyPlaylists, ...unifiedSpotiiPlaylists]
    const totalPlaylists = allPlaylists.length

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Your Library</h1>
                <p className="text-white/70">
                    All your playlists in one place ({totalPlaylists} total)
                </p>
            </div>

            <StatsPanel playlists={allPlaylists} />

            {/* Unified Playlists Grid */}
            {isLoadingSpotify ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-white/20 rounded-xl bg-white/[0.01] backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 mb-4 text-primary animate-spin" />
                    <p className="text-sm text-white/70">
                        Loading your playlists...
                    </p>
                </div>
            ) : spotifyError && unifiedSpotiiPlaylists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-border rounded-xl bg-muted/20">
                    <Music className="w-12 h-12 mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">Could not load playlists</h3>
                    <p className="text-sm text-muted-foreground">{spotifyError}</p>
                </div>
            ) : totalPlaylists === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/20 rounded-xl bg-white/[0.01] backdrop-blur-sm">
                    <Music className="w-12 h-12 mb-4 text-white/50" />
                    <h3 className="text-lg font-semibold mb-2 text-white">No playlists yet</h3>
                    <p className="text-sm text-white/70">
                        Start creating AI-generated playlists with Spotii or connect your Spotify account
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {allPlaylists.map((playlist) => (
                        <PlaylistCard
                            key={playlist.id}
                            playlist={playlist}
                            showSourceTag
                            onClick={() => handlePlaylistClick(playlist)}
                        />
                    ))}
                </div>
            )}

            <PlaylistDetailsDialog
                playlist={selectedPlaylist}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    )
}

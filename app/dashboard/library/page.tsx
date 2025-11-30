"use client"

import { useEffect, useState } from "react"
import { Music, Loader2, Lock } from "lucide-react"
import { useRecentPlaylists } from "@/hooks/use-recent-playlists"
import { PlaylistCard, UnifiedPlaylist } from "@/components/playlist-card"
import { StatsPanel } from "@/components/stats-panel"
import { PlaylistDetailsDialog } from "@/components/playlist-details-dialog"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

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
                // Show locked playlists when not authenticated and no Spotii playlists
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="group relative bg-white/[0.01] border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm"
                            >
                                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center">
                                    {/* Blurred background effect */}
                                    <div className="absolute inset-0 backdrop-blur-md bg-white/5" />

                                    {/* Lock icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <Lock className="w-8 h-8 text-white/50" />
                                        </div>
                                    </div>

                                    {/* Placeholder album art */}
                                    <Music className="w-12 h-12 text-white/20 blur-sm" />
                                </div>
                                <div className="p-4">
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2 blur-sm" />
                                    <div className="h-3 bg-white/5 rounded w-1/2 blur-sm" />
                                </div>
                            </div>
                        ))}

                        {/* Connect Spotify Card */}
                        <div className="group relative bg-primary/10 border-2 border-primary/30 border-dashed rounded-lg overflow-hidden backdrop-blur-sm flex flex-col items-center justify-center p-6 min-h-[200px] sm:col-span-2 md:col-span-3 lg:col-span-5 xl:col-span-6">
                            <Lock className="w-12 h-12 text-primary/70 mb-3" />
                            <h3 className="text-lg font-semibold mb-2 text-white">Connect Your Spotify</h3>
                            <p className="text-sm text-white/70 mb-4 text-center max-w-md">
                                Link your Spotify account to see and manage your playlists
                            </p>
                            <Button
                                onClick={() => signIn('spotify', { callbackUrl: '/dashboard/library' })}
                                className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold"
                            >
                                <Music className="w-4 h-4 mr-2" />
                                Connect Spotify
                            </Button>
                        </div>
                    </div>
                </div>
            ) : spotifyError && unifiedSpotiiPlaylists.length > 0 ? (
                // Show Spotii playlists + locked Spotify section when not authenticated
                <div className="space-y-8">
                    {/* Spotii Playlists */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Spotii Playlists ({unifiedSpotiiPlaylists.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {unifiedSpotiiPlaylists.map((playlist) => (
                                <PlaylistCard
                                    key={playlist.id}
                                    playlist={playlist}
                                    onClick={() => handlePlaylistClick(playlist)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Locked Spotify Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Your Spotify Playlists</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="group relative bg-white/[0.01] border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center">
                                        <div className="absolute inset-0 backdrop-blur-md bg-white/5" />
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <Lock className="w-8 h-8 text-white/50" />
                                        </div>
                                        <Music className="w-12 h-12 text-white/20 blur-sm" />
                                    </div>
                                    <div className="p-4">
                                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2 blur-sm" />
                                        <div className="h-3 bg-white/5 rounded w-1/2 blur-sm" />
                                    </div>
                                </div>
                            ))}

                            {/* Connect Spotify Card */}
                            <div className="group relative bg-primary/10 border-2 border-primary/30 border-dashed rounded-lg overflow-hidden backdrop-blur-sm flex flex-col items-center justify-center p-6 min-h-[200px] sm:col-span-2 md:col-span-3 lg:col-span-5 xl:col-span-6">
                                <Lock className="w-12 h-12 text-primary/70 mb-3" />
                                <h3 className="text-lg font-semibold mb-2 text-white">Connect Your Spotify</h3>
                                <p className="text-sm text-white/70 mb-4 text-center max-w-md">
                                    Link your Spotify account to see and manage your playlists
                                </p>
                                <Button
                                    onClick={() => signIn('spotify', { callbackUrl: '/dashboard/library' })}
                                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold"
                                >
                                    <Music className="w-4 h-4 mr-2" />
                                    Connect Spotify
                                </Button>
                            </div>
                        </div>
                    </div>
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

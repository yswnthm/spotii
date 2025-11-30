"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Play, Music2, Music, Loader2, Lock } from "lucide-react"
import Link from "next/link"
import { useRecentPlaylists } from "@/hooks/use-recent-playlists"
import Image from "next/image"
import { PlaylistCard, UnifiedPlaylist } from "@/components/playlist-card"
import { PlaylistDetailsDialog } from "@/components/playlist-details-dialog"
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

export default function DashboardPage() {
    const { playlists, getStats, deletePlaylist } = useRecentPlaylists()
    const stats = getStats()

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return "Today"
        if (diffDays === 1) return "Yesterday"
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Good evening</h1>
                    <p className="text-white/70">Ready to discover some new music?</p>
                </div>
                <Link href="/dashboard/create">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="w-4 h-4 mr-2" />
                        New Playlist
                    </Button>
                </Link>
            </div>

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create Card */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white/[0.02] backdrop-blur-md border border-white/20 rounded-xl p-8 flex flex-col justify-center items-start space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Create your vibe</h2>
                        <p className="text-white/70 max-w-md">
                            Describe what you want to hear, and let our AI craft the perfect playlist for you in seconds.
                        </p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Start Generating
                        </Button>
                    </Link>
                </div>

                {/* Stats / Info */}
                <div className="bg-white/[0.02] backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-white">Your Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70">Playlists Created</span>
                            <span className="font-bold text-white">{stats.totalPlaylists}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70">Songs Discovered</span>
                            <span className="font-bold text-white">{stats.totalSongs}</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="pt-2">
                            <p className="text-xs text-white/70">
                                Top Genre: <span className="text-primary">{stats.topGenre}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Playlists */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Recent Creations</h2>
                {playlists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/20 rounded-xl bg-white/[0.01] backdrop-blur-sm">
                        <Music2 className="w-12 h-12 mb-4 text-white/50" />
                        <h3 className="text-lg font-semibold mb-2 text-white">No playlists yet</h3>
                        <p className="text-sm text-white/70 mb-4">
                            Create your first AI-generated playlist to get started
                        </p>
                        <Link href="/dashboard/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Playlist
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {playlists.slice(0, 5).map((playlist) => {
                            const unifiedPlaylist: UnifiedPlaylist = {
                                id: `spotii-${playlist.id}`,
                                name: playlist.name,
                                trackCount: playlist.trackCount,
                                source: "spotii",
                                createdAt: playlist.createdAt,
                                mood: playlist.mood,
                                genre: playlist.genre,
                                songs: playlist.songs
                            }

                            return (
                                <PlaylistCard
                                    key={playlist.id}
                                    playlist={unifiedPlaylist}
                                    onClick={() => handlePlaylistClick(unifiedPlaylist)}
                                    onDelete={() => deletePlaylist(playlist.id)}
                                />
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Spotify Playlists */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Your Spotify Playlists</h2>
                {isLoadingSpotify ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-white/20 rounded-xl bg-white/[0.01] backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 mb-4 text-primary animate-spin" />
                        <p className="text-sm text-white/70">Loading your Spotify playlists...</p>
                    </div>
                ) : spotifyError ? (
                    // Show blurred playlists with connect overlay when not authenticated
                    <div className="relative">
                        {/* Blurred playlist grid background */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="group relative bg-white/[0.01] border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center">
                                        <Music2 className="w-12 h-12 text-white/20" />
                                    </div>
                                    <div className="p-4">
                                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                                        <div className="h-3 bg-white/5 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Blur and overlay */}
                        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center rounded-xl">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                <Lock className="w-16 h-16 text-primary/70 relative" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 text-white">Connect Your Spotify</h3>
                            <p className="text-sm text-white/70 mb-6 max-w-md px-4">
                                Link your Spotify account to access and manage all your playlists right here
                            </p>
                            <Button
                                onClick={() => signIn('spotify', { callbackUrl: '/dashboard' })}
                                size="lg"
                                className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold"
                            >
                                <Music className="w-5 h-5 mr-2" />
                                Connect Spotify
                            </Button>
                        </div>
                    </div>
                ) : spotifyPlaylists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/20 rounded-xl bg-white/[0.01] backdrop-blur-sm">
                        <Music className="w-12 h-12 mb-4 text-white/50" />
                        <h3 className="text-lg font-semibold mb-2 text-white">No Spotify playlists</h3>
                        <p className="text-sm text-white/70">
                            You don't have any playlists on Spotify yet
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {spotifyPlaylists.slice(0, 6).map((playlist) => (
                            <a
                                key={playlist.id}
                                href={playlist.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-white/[0.01] border border-white/10 rounded-lg overflow-hidden hover:border-primary/50 transition-colors backdrop-blur-sm"
                            >
                                <div className="aspect-square bg-gradient-to-br from-primary/20 to-muted relative flex items-center justify-center">
                                    {playlist.image ? (
                                        <Image
                                            src={playlist.image}
                                            alt={playlist.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Music2 className="w-12 h-12 text-primary/40" />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                        <Button size="icon" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                                            <Play className="w-5 h-5 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold truncate text-white">{playlist.name}</h3>
                                    <p className="text-xs text-white/70">
                                        {playlist.trackCount} tracks · {playlist.owner}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>



            <PlaylistDetailsDialog
                playlist={selectedPlaylist}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div >
    )
}

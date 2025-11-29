import { Music2, Play } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Song } from "@/hooks/use-recent-playlists"

export interface UnifiedPlaylist {
    id: string
    name: string
    trackCount: number
    image?: string | null
    source: "spotify" | "spotii"
    url?: string
    description?: string
    owner?: string
    createdAt?: string
    mood?: string
    genre?: string
    songs?: Song[]
}

interface PlaylistCardProps {
    playlist: UnifiedPlaylist
    onClick?: () => void
    showSourceTag?: boolean
}

export function PlaylistCard({ playlist, onClick, showSourceTag }: PlaylistCardProps) {
    const isSpotify = playlist.source === "spotify"

    const handleClick = () => {
        if (isSpotify && playlist.url) {
            window.open(playlist.url, "_blank", "noopener noreferrer")
        } else if (onClick) {
            onClick()
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return ""
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
        <div
            onClick={handleClick}
            className="group relative bg-white/[0.01] border border-white/10 rounded-lg overflow-hidden hover:border-primary/50 transition-colors cursor-pointer backdrop-blur-sm"
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
                {/* Source Tag on Album Cover */}
                {showSourceTag && (
                    <div className="absolute top-2 right-2">
                        <Badge
                            variant={isSpotify ? "default" : "secondary"}
                            className={`text-xs ${isSpotify ? "bg-[#1DB954] hover:bg-[#1DB954]/90" : ""}`}
                        >
                            {isSpotify ? "Spotify" : "Spotii"}
                        </Badge>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold truncate text-white">{playlist.name}</h3>
                <p className="text-xs text-white/70">
                    {playlist.trackCount} tracks
                    {isSpotify && playlist.owner && ` · ${playlist.owner}`}
                    {!isSpotify && playlist.createdAt && ` · ${formatDate(playlist.createdAt)}`}
                </p>
                {/* Mood/Genre Tags for Spotii playlists */}
                {!isSpotify && (playlist.mood || playlist.genre) && (
                    <div className="flex gap-1 mt-2">
                        {playlist.mood && (
                            <Badge variant="outline" className="text-xs">
                                {playlist.mood}
                            </Badge>
                        )}
                        {playlist.genre && (
                            <Badge variant="outline" className="text-xs">
                                {playlist.genre}
                            </Badge>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

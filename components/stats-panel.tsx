import { UnifiedPlaylist } from "@/components/playlist-card"
import { Music, Disc, ListMusic } from "lucide-react"

interface StatsPanelProps {
    playlists: UnifiedPlaylist[]
}

export function StatsPanel({ playlists }: StatsPanelProps) {
    const totalPlaylists = playlists.length
    const totalSongs = playlists.reduce((acc, curr) => acc + (curr.trackCount || 0), 0)
    const spotiiCount = playlists.filter(p => p.source === 'spotii').length
    const spotifyCount = playlists.filter(p => p.source === 'spotify').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <ListMusic className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-white/70">Total Playlists</p>
                    <p className="text-2xl font-bold text-white">{totalPlaylists}</p>
                </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Music className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-white/70">Total Songs</p>
                    <p className="text-2xl font-bold text-white">{totalSongs}</p>
                </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Disc className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-white/70">Sources</p>
                    <div className="flex gap-3 text-sm font-medium">
                        <span className="text-white">{spotiiCount} Spotii</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white">{spotifyCount} Spotify</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { UnifiedPlaylist } from "@/components/playlist-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Music2, Clock, Calendar } from "lucide-react"

interface PlaylistDetailsDialogProps {
    playlist: UnifiedPlaylist | null
    isOpen: boolean
    onClose: () => void
}

export function PlaylistDetailsDialog({ playlist, isOpen, onClose }: PlaylistDetailsDialogProps) {
    if (!playlist) return null

    const formatDate = (dateString?: string) => {
        if (!dateString) return ""
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-black/40 backdrop-blur-xl border-white/10 text-white shadow-2xl">
                <DialogHeader>
                    <div className="flex items-start gap-6 mb-4">
                        <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 shadow-lg border border-white/10">
                            <Music2 className="w-12 h-12 text-white/60" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <DialogTitle className="text-3xl font-bold tracking-tight">{playlist.name}</DialogTitle>
                            <div className="flex flex-wrap gap-3 text-sm text-white/60">
                                <span className="flex items-center gap-1.5">
                                    <Music2 className="w-4 h-4" />
                                    {playlist.trackCount} tracks
                                </span>
                                {playlist.createdAt && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(playlist.createdAt)}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2 mt-3">
                                {playlist.mood && (
                                    <Badge variant="outline" className="text-xs border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-3 py-1">
                                        {playlist.mood}
                                    </Badge>
                                )}
                                {playlist.genre && (
                                    <Badge variant="outline" className="text-xs border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-3 py-1">
                                        {playlist.genre}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden mt-2">
                    <div className="flex items-center justify-between px-4 mb-2">
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Title</h3>
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mr-4">Details</h3>
                    </div>
                    <ScrollArea className="h-[400px] pr-4 -mr-4">
                        {playlist.songs && playlist.songs.length > 0 ? (
                            <div className="space-y-1 pr-4">
                                {playlist.songs.map((song, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all group border border-transparent hover:border-white/5"
                                    >
                                        <span className="text-white/30 w-6 text-center text-sm font-mono group-hover:text-primary transition-colors">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-white/90 group-hover:text-white transition-colors">
                                                {song.title}
                                            </p>
                                            <p className="text-sm text-white/50 truncate group-hover:text-white/70 transition-colors">
                                                {song.artist}
                                            </p>
                                        </div>
                                        <div className="text-right max-w-[150px]">
                                            <p className="text-sm text-white/40 truncate group-hover:text-white/60 transition-colors">
                                                {song.album}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-white/40">
                                <Music2 className="w-16 h-16 mb-4 opacity-10" />
                                <p className="text-lg font-medium opacity-50">No songs available</p>
                                <p className="text-sm opacity-30">This playlist appears to be empty</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}

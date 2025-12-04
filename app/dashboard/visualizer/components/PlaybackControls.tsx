'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface Track {
    id: string
    name: string
    artists: string[]
    albumCover: string
    duration: number
    progressMs: number
}

interface PlaybackControlsProps {
    track: Track | null
    isPlaying: boolean
    onPlayPause: () => void
    onNext: () => void
    onPrevious: () => void
}

export default function PlaybackControls({
    track,
    isPlaying,
    onPlayPause,
    onNext,
    onPrevious,
}: PlaybackControlsProps) {
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        if (!track) return

        // Initialize progress from track data
        setCurrentTime(track.progressMs)
        setProgress((track.progressMs / track.duration) * 100)

        // Update progress in real-time when playing
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentTime((prev) => {
                    const newTime = Math.min(prev + 1000, track.duration)
                    setProgress((newTime / track.duration) * 100)
                    return newTime
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [track, isPlaying])

    // Sync with external updates
    useEffect(() => {
        if (track) {
            setCurrentTime(track.progressMs)
            setProgress((track.progressMs / track.duration) * 100)
        }
    }, [track?.progressMs, track?.duration])

    if (!track) {
        return null
    }

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000)
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Track Info */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                        {track.name}
                    </h3>
                    <p className="text-sm text-white/60 truncate">
                        {track.artists.join(', ')}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="relative h-1 bg-white/20 rounded-full overflow-hidden group cursor-pointer">
                        <div
                            className="absolute h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/60">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(track.duration)}</span>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={onPrevious}
                        variant="ghost"
                        size="icon"
                        className="text-white/80 hover:text-white hover:bg-white/10 transition-all"
                        title="Previous track"
                    >
                        <SkipBack className="w-5 h-5" />
                    </Button>

                    <Button
                        onClick={onPlayPause}
                        size="icon"
                        className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <Pause className="w-6 h-6" fill="currentColor" />
                        ) : (
                            <Play className="w-6 h-6" fill="currentColor" />
                        )}
                    </Button>

                    <Button
                        onClick={onNext}
                        variant="ghost"
                        size="icon"
                        className="text-white/80 hover:text-white hover:bg-white/10 transition-all"
                        title="Next track"
                    >
                        <SkipForward className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

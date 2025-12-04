'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import VisualizerCanvas from './components/VisualizerCanvas'
import PlaybackControls from './components/PlaybackControls'
import { Button } from '@/components/ui/button'
import { Music, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import Link from 'next/link'

interface Track {
    id: string
    name: string
    artists: string[]
    albumId: string
    albumCover: string
    duration: number
    progressMs: number
}

export default function VisualizerPage() {
    const { data: session } = useSession()
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [backgroundAlbums, setBackgroundAlbums] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Fetch currently playing track
    const fetchCurrentlyPlaying = useCallback(async () => {
        if (!session?.accessToken) return

        try {
            const response = await fetch('/api/spotify/currently-playing')

            if (!response.ok) {
                throw new Error('Failed to fetch currently playing track')
            }

            const data = await response.json()

            if (data.track) {
                setCurrentTrack(data.track)
                setIsPlaying(data.isPlaying)
            } else {
                setCurrentTrack(null)
                setIsPlaying(false)
            }
        } catch (err) {
            console.error('Error fetching currently playing:', err)
            // Don't set error state for polling failures to avoid disrupting the experience
        }
    }, [session?.accessToken])

    // Fetch similar songs based on current track
    const fetchSimilarSongs = useCallback(async (trackId: string, albumId: string) => {
        if (!session?.accessToken) return

        try {
            const response = await fetch(`/api/spotify/recommendations?trackId=${trackId}&albumId=${albumId}`)

            if (!response.ok) {
                throw new Error('Failed to fetch similar songs')
            }

            const data = await response.json()
            setBackgroundAlbums(data.covers || [])
        } catch (err) {
            console.error('Error fetching similar songs:', err)
        }
    }, [session?.accessToken])

    // Initial fetch
    useEffect(() => {
        async function initialize() {
            if (!session?.accessToken) {
                setLoading(false)
                return
            }

            try {
                await fetchCurrentlyPlaying()
            } catch (err) {
                console.error('Error initializing:', err)
                setError('Failed to load visualizer')
            } finally {
                setLoading(false)
            }
        }

        initialize()
    }, [session, fetchCurrentlyPlaying])


    // Polling for currently playing track
    useEffect(() => {
        if (!session?.accessToken) return

        // Poll every 1 second for real-time updates
        pollingIntervalRef.current = setInterval(() => {
            fetchCurrentlyPlaying()
        }, 1000)

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }
        }
    }, [session?.accessToken, fetchCurrentlyPlaying])


    // Fetch similar songs when current track changes
    useEffect(() => {
        if (currentTrack?.id && currentTrack?.albumId) {
            fetchSimilarSongs(currentTrack.id, currentTrack.albumId)
        }
    }, [currentTrack?.id, currentTrack?.albumId, fetchSimilarSongs])


    // Playback control handlers
    const handlePlaybackControl = useCallback(async (action: 'play' | 'pause' | 'next' | 'previous') => {
        try {
            const response = await fetch('/api/spotify/playback-control', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            })

            const data = await response.json()

            if (!response.ok) {
                // Show user-friendly error message
                console.error(`Playback control error:`, data)
                alert(data.details || data.error || `Failed to ${action}`)
                return
            }

            // Immediately fetch updated state
            setTimeout(() => {
                fetchCurrentlyPlaying()
            }, 300)
        } catch (err) {
            console.error(`Error ${action}ing playback:`, err)
            alert(`Error controlling playback. Please try again.`)
        }
    }, [fetchCurrentlyPlaying])

    const handlePlayPause = () => {
        handlePlaybackControl(isPlaying ? 'pause' : 'play')
    }

    const handleNext = () => {
        handlePlaybackControl('next')
    }

    const handlePrevious = () => {
        handlePlaybackControl('previous')
    }

    // Fullscreen handlers
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle fullscreen with F key or F11
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault()
                toggleFullscreen()
            }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const toggleFullscreen = async () => {
        if (!containerRef.current) return

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen()
            } else {
                await document.exitFullscreen()
            }
        } catch (err) {
            console.error('Error toggling fullscreen:', err)
        }
    }

    // Not authenticated with Spotify
    if (!session?.accessToken) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Connect Spotify
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Connect your Spotify account to experience the 3D playback visualizer synced with your music.
                    </p>
                    <Link href="/api/auth/signin/spotify">
                        <Button className="w-full" size="lg">
                            <svg
                                className="w-5 h-5 mr-2"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            Connect to Spotify
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Loading state
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading visualizer...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Error Loading Visualizer
                    </h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    // No song playing
    if (!currentTrack) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        No Song Playing
                    </h2>
                    <p className="text-muted-foreground">
                        Start playing a song on Spotify to see the 3D visualizer come to life.
                    </p>
                </div>
            </div>
        )
    }

    // Render visualizer with playback
    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
            <VisualizerCanvas
                currentAlbumCover={currentTrack.albumCover}
                backgroundAlbums={backgroundAlbums}
                isPlaying={isPlaying}
            />

            {/* Playback Controls */}
            <PlaybackControls
                track={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrevious={handlePrevious}
            />

            {/* Fullscreen toggle button */}
            <div className="absolute top-4 right-4 z-10">
                <Button
                    onClick={toggleFullscreen}
                    variant="ghost"
                    size="icon"
                    className="bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 hover:border-white/20 text-white/80 hover:text-white"
                    title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-5 h-5" />
                    ) : (
                        <Maximize2 className="w-5 h-5" />
                    )}
                </Button>
            </div>

            {/* Instructions overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
                    <p className="text-sm text-white/80 text-center">
                        <span className="font-medium">Drag</span> to move • <span className="font-medium">Scroll</span> to zoom • <span className="font-medium">F</span> for fullscreen
                    </p>
                </div>
            </div>
        </div>
    )
}

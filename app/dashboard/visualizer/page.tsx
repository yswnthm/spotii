'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import VisualizerCanvas from './components/VisualizerCanvas'
import { Button } from '@/components/ui/button'
import { Music, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import Link from 'next/link'

export default function VisualizerPage() {
    const { data: session } = useSession()
    const [albumCovers, setAlbumCovers] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchAlbumCovers() {
            if (!session?.accessToken) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch('/api/spotify/new-releases')

                if (!response.ok) {
                    throw new Error('Failed to fetch album covers')
                }

                const data = await response.json()
                setAlbumCovers(data.covers || [])
            } catch (err) {
                console.error('Error fetching album covers:', err)
                setError('Failed to load album covers')
            } finally {
                setLoading(false)
            }
        }

        fetchAlbumCovers()
    }, [session])

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
                        Connect your Spotify account to experience the 3D album visualizer with the latest new releases.
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
                    <p className="text-muted-foreground">Loading album covers...</p>
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

    // No album covers
    if (albumCovers.length === 0) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        No Albums Found
                    </h2>
                    <p className="text-muted-foreground">
                        Unable to load new releases at this time.
                    </p>
                </div>
            </div>
        )
    }

    // Render visualizer
    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
            <VisualizerCanvas albumCovers={albumCovers} />

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
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
                    <p className="text-sm text-white/80 text-center">
                        <span className="font-medium">Drag</span> to move • <span className="font-medium">Scroll</span> to zoom • <span className="font-medium">F</span> for fullscreen
                    </p>
                </div>
            </div>
        </div>
    )
}

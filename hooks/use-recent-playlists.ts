import { useState, useEffect } from "react"

export interface Song {
    title: string
    artist: string
    album?: string
}

export interface SavedPlaylist {
    id: string
    name: string
    mood: string
    genre: string
    era: string
    songs: Song[]
    createdAt: string
    trackCount: number
}

const STORAGE_KEY = "spotii_recent_playlists"
const MAX_PLAYLISTS = 5

export function useRecentPlaylists() {
    const [playlists, setPlaylists] = useState<SavedPlaylist[]>([])

    // Load playlists from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                try {
                    const parsed = JSON.parse(stored)
                    // Enforce limit
                    const limited = parsed.slice(0, MAX_PLAYLISTS)
                    setPlaylists(limited)

                    // Update storage if we trimmed
                    if (parsed.length > MAX_PLAYLISTS) {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
                    }
                } catch (error) {
                    console.error("Failed to parse playlists from localStorage:", error)
                    setPlaylists([])
                }
            }
        }
    }, [])

    const savePlaylist = (playlist: Omit<SavedPlaylist, "id" | "createdAt" | "trackCount">) => {
        const newPlaylist: SavedPlaylist = {
            ...playlist,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            trackCount: playlist.songs.length,
        }

        const updated = [newPlaylist, ...playlists].slice(0, MAX_PLAYLISTS)
        setPlaylists(updated)

        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }

        return newPlaylist
    }

    const getStats = () => {
        const totalPlaylists = playlists.length
        const totalSongs = playlists.reduce((sum, p) => sum + p.trackCount, 0)

        // Get top genre
        const genreCounts: Record<string, number> = {}
        playlists.forEach(p => {
            if (p.genre) {
                genreCounts[p.genre] = (genreCounts[p.genre] || 0) + 1
            }
        })

        const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

        return {
            totalPlaylists,
            totalSongs,
            topGenre,
        }
    }

    const deletePlaylist = (id: string) => {
        const updated = playlists.filter(p => p.id !== id)
        setPlaylists(updated)

        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
    }

    return {
        playlists,
        savePlaylist,
        deletePlaylist,
        getStats,
    }
}

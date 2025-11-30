"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Music, Sparkles, Loader2, Play, Check, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRecentPlaylists } from "@/hooks/use-recent-playlists"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreatePlaylistPage() {
    const { toast } = useToast()
    const { savePlaylist } = useRecentPlaylists()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [playlist, setPlaylist] = useState<any[] | null>(null)

    // Prompt-based generation
    const [prompt, setPrompt] = useState("")
    const [activeTab, setActiveTab] = useState("basic")

    // Basic Form State
    const [mood, setMood] = useState("")
    const [genre, setGenre] = useState("")
    const [languages, setLanguages] = useState<string[]>([])

    // Advanced Filters
    const [activity, setActivity] = useState("")
    const [energy, setEnergy] = useState([50])
    const [tempo, setTempo] = useState("")
    const [popularity, setPopularity] = useState([50])

    // Preferences
    const [vocalPreference, setVocalPreference] = useState("")
    const [era, setEra] = useState("modern")
    const [explicitContent, setExplicitContent] = useState("allow")

    // Playlist Settings
    const [duration, setDuration] = useState("30")
    const [trackCount, setTrackCount] = useState("20")

    const handleLanguageToggle = (lang: string) => {
        setLanguages(prev =>
            prev.includes(lang)
                ? prev.filter(l => l !== lang)
                : [...prev, lang]
        )
    }

    // Handle URL query parameter for prompt
    useEffect(() => {
        const promptParam = searchParams.get("prompt")
        if (promptParam) {
            setPrompt(promptParam)
            setActiveTab("prompt")
        }
    }, [searchParams])

    const handlePromptGenerate = async () => {
        if (!prompt.trim()) return

        setIsLoading(true)
        setPlaylist(null)

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt.trim()
                }),
            })

            const data = await response.json()
            if (data.songs) {
                setPlaylist(data.songs)

                // Save to localStorage
                const playlistName = `${prompt.substring(0, 30)}${prompt.length > 30 ? "..." : ""} - AI Generated`

                savePlaylist({
                    name: playlistName,
                    mood: "AI Prompt",
                    genre: "Mixed",
                    era: "modern",
                    songs: data.songs,
                })
            }
        } catch (error) {
            console.error("Failed to generate", error)
            toast({
                title: "Generation failed",
                description: "Please try again with a different prompt.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleGenerate = async () => {
        setIsLoading(true)
        setPlaylist(null)

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mood,
                    genre,
                    languages,
                    activity,
                    energy: energy[0],
                    tempo,
                    popularity: popularity[0],
                    vocalPreference,
                    era,
                    explicitContent,
                    duration,
                    trackCount
                }),
            })

            const data = await response.json()
            if (data.songs) {
                setPlaylist(data.songs)

                // Save to localStorage
                const playlistName = mood
                    ? `${mood}${genre ? ` ${genre}` : ""}`
                    : "My Playlist"

                savePlaylist({
                    name: playlistName,
                    mood: mood || "None",
                    genre: genre || "Any",
                    era: era || "modern",
                    songs: data.songs,
                })
            }
        } catch (error) {
            console.error("Failed to generate", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveToSpotify = async () => {
        if (!playlist || playlist.length === 0) return

        setIsSaving(true)
        try {
            const playlistName = mood
                ? `${mood}${genre ? ` ${genre}` : ""} - Spotii`
                : `My Spotii Playlist`

            const response = await fetch("/api/save-playlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    playlistName,
                    songs: playlist,
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                toast({
                    title: "Playlist saved! 🎉",
                    description: `Added ${data.tracksAdded} tracks to your Spotify account.`,
                })

                if (data.playlistUrl) {
                    window.open(data.playlistUrl, "_blank")
                }
            } else {
                throw new Error(data.error || "Failed to save playlist")
            }
        } catch (error) {
            console.error("Save error:", error)
            toast({
                title: "Failed to save",
                description: error instanceof Error ? error.message : "Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Create your vibe</h1>
                <p className="text-white/70">
                    Customize every detail to craft the perfect soundtrack for any moment.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Controls */}
                <div className="lg:col-span-1">
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        <div className="space-y-6 bg-white/[0.02] backdrop-blur-md border border-white/20 p-6 rounded-xl">
                            {/* Prompt Section - Main Interface */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white text-lg font-semibold">Describe your vibe</Label>
                                    <p className="text-sm text-white/60">Tell us what you're feeling, and we'll curate the perfect playlist</p>
                                </div>

                                {/* Prompt Input - matching hero.tsx style */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                    <div className="relative flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg">
                                        <div className="relative flex-1">
                                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                                            <Input
                                                placeholder="Describe your vibe..."
                                                className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent h-10 text-white placeholder:text-white/50"
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                disabled={isLoading}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault()
                                                        handlePromptGenerate()
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Example Prompts */}
                                <div className="space-y-2">
                                    <p className="text-sm text-white/70">Try examples:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Late night coding session with lo-fi beats",
                                            "Energetic Bollywood workout mix",
                                            "Romantic Telugu songs for a rainy evening",
                                            "Chill indie vibes for studying"
                                        ].map((example) => (
                                            <button
                                                key={example}
                                                onClick={() => setPrompt(example)}
                                                className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                                                disabled={isLoading}
                                            >
                                                {example}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Button for Prompt */}
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                    size="lg"
                                    onClick={handlePromptGenerate}
                                    disabled={isLoading || !prompt.trim()}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate from Prompt
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/[0.02] px-2 text-white/50">Or customize manually</span>
                                </div>
                            </div>

                            {/* Accordion for Basic and Advanced */}
                            <Accordion type="multiple" className="w-full">
                                <AccordionItem value="basic" className="border-white/10">
                                    <AccordionTrigger className="text-white hover:text-white/80">Basic Options</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        {/* Mood */}
                                        <div className="space-y-2">
                                            <Label>Mood / Vibe *</Label>
                                            <Input
                                                placeholder="e.g. Chill, Energetic, Romantic..."
                                                value={mood}
                                                onChange={(e) => setMood(e.target.value)}
                                                className="bg-white/[0.01] border-white/10"
                                            />
                                        </div>

                                        {/* Languages */}
                                        <div className="space-y-2">
                                            <Label>Languages (Multi-select)</Label>
                                            <div className="grid grid-cols-2 gap-2 p-3 bg-white/[0.01] rounded-md border border-input max-h-48 overflow-y-auto">
                                                {[
                                                    "Hindi", "English", "Tamil", "Telugu", "Punjabi",
                                                    "Malayalam", "Kannada", "Bengali", "Marathi",
                                                    "Gujarati", "Urdu", "Odia", "Assamese", "Rajasthani"
                                                ].map((lang) => (
                                                    <div key={lang} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={lang}
                                                            checked={languages.includes(lang)}
                                                            onCheckedChange={() => handleLanguageToggle(lang)}
                                                        />
                                                        <label
                                                            htmlFor={lang}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                        >
                                                            {lang}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Genre */}
                                        <div className="space-y-2">
                                            <Label>Genre</Label>
                                            <Select value={genre} onValueChange={setGenre}>
                                                <SelectTrigger className="bg-white/[0.01] border-white/10">
                                                    <SelectValue placeholder="Select a genre" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pop">Pop</SelectItem>
                                                    <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                                                    <SelectItem value="rock">Rock</SelectItem>
                                                    <SelectItem value="electronic">Electronic</SelectItem>
                                                    <SelectItem value="edm">EDM</SelectItem>
                                                    <SelectItem value="r-n-b">R&B</SelectItem>
                                                    <SelectItem value="jazz">Jazz</SelectItem>
                                                    <SelectItem value="classical">Classical</SelectItem>
                                                    <SelectItem value="indian-classical">Indian Classical</SelectItem>
                                                    <SelectItem value="devotional">Devotional</SelectItem>
                                                    <SelectItem value="fusion">Fusion</SelectItem>
                                                    <SelectItem value="indie">Indie</SelectItem>
                                                    <SelectItem value="metal">Metal</SelectItem>
                                                    <SelectItem value="reggae">Reggae</SelectItem>
                                                    <SelectItem value="folk">Folk</SelectItem>
                                                    <SelectItem value="soundtrack">Soundtrack</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Track Count */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <Label>Number of Tracks</Label>
                                                <span className="text-xs text-muted-foreground">{trackCount} songs</span>
                                            </div>
                                            <Slider
                                                value={[parseInt(trackCount)]}
                                                onValueChange={(vals) => setTrackCount(vals[0].toString())}
                                                min={10}
                                                max={100}
                                                step={5}
                                                className="py-2"
                                            />
                                        </div>

                                        {/* Generate Button for Basic */}
                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                            size="lg"
                                            onClick={handleGenerate}
                                            disabled={isLoading || !mood}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Curating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate Playlist
                                                </>
                                            )}
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="advanced" className="border-white/10">
                                    <AccordionTrigger className="text-white hover:text-white/80">Advanced Options</AccordionTrigger>
                                    <AccordionContent className="space-y-6 pt-4">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Context & Vibe</h3>

                                            {/* Activity/Occasion */}
                                            <div className="space-y-2">
                                                <Label>Activity / Occasion</Label>
                                                <Select value={activity} onValueChange={setActivity}>
                                                    <SelectTrigger className="bg-white/[0.01] border-white/10">
                                                        <SelectValue placeholder="Select activity" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="workout">Workout</SelectItem>
                                                        <SelectItem value="study">Study / Focus</SelectItem>
                                                        <SelectItem value="party">Party</SelectItem>
                                                        <SelectItem value="roadtrip">Road Trip</SelectItem>
                                                        <SelectItem value="romantic">Romantic</SelectItem>
                                                        <SelectItem value="wedding">Wedding / Celebration</SelectItem>
                                                        <SelectItem value="festival">Festival</SelectItem>
                                                        <SelectItem value="meditation">Meditation / Yoga</SelectItem>
                                                        <SelectItem value="morning">Morning Motivation</SelectItem>
                                                        <SelectItem value="rainy">Rainy Day</SelectItem>
                                                        <SelectItem value="latenight">Late Night</SelectItem>
                                                        <SelectItem value="cooking">Cooking</SelectItem>
                                                        <SelectItem value="commute">Commute</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Energy Level */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Energy Level</Label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {energy[0] < 30 ? "Calm" : energy[0] < 70 ? "Moderate" : "Energetic"}
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={energy}
                                                    onValueChange={setEnergy}
                                                    min={0}
                                                    max={100}
                                                    step={10}
                                                    className="py-2"
                                                />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Calm</span>
                                                    <span>Upbeat</span>
                                                </div>
                                            </div>

                                            {/* Tempo */}
                                            <div className="space-y-2">
                                                <Label>Tempo Preference</Label>
                                                <Select value={tempo} onValueChange={setTempo}>
                                                    <SelectTrigger className="bg-white/[0.01] border-white/10">
                                                        <SelectValue placeholder="Any tempo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="slow">Slow</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="fast">Fast</SelectItem>
                                                        <SelectItem value="mixed">Mixed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Popularity vs Discovery */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Music Discovery</Label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {popularity[0] < 30 ? "Hidden Gems" : popularity[0] < 70 ? "Balanced" : "Popular Hits"}
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={popularity}
                                                    onValueChange={setPopularity}
                                                    min={0}
                                                    max={100}
                                                    step={10}
                                                    className="py-2"
                                                />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Hidden Gems</span>
                                                    <span>Popular</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Preferences</h3>

                                            {/* Vocal Preference */}
                                            <div className="space-y-2">
                                                <Label>Vocal Type</Label>
                                                <Select value={vocalPreference} onValueChange={setVocalPreference}>
                                                    <SelectTrigger className="bg-white/[0.01] border-white/10">
                                                        <SelectValue placeholder="Any vocals" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male Vocals</SelectItem>
                                                        <SelectItem value="female">Female Vocals</SelectItem>
                                                        <SelectItem value="mixed">Mixed Vocals</SelectItem>
                                                        <SelectItem value="instrumental">Instrumental</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Era */}
                                            <div className="space-y-2">
                                                <Label>Era</Label>
                                                <Select value={era} onValueChange={setEra}>
                                                    <SelectTrigger className="bg-white/[0.01] border-white/10">
                                                        <SelectValue placeholder="Select an era" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="modern">Modern (2020s)</SelectItem>
                                                        <SelectItem value="2010s">2010s</SelectItem>
                                                        <SelectItem value="2000s">2000s</SelectItem>
                                                        <SelectItem value="90s">90s</SelectItem>
                                                        <SelectItem value="80s">80s</SelectItem>
                                                        <SelectItem value="70s">70s</SelectItem>
                                                        <SelectItem value="60s">60s</SelectItem>
                                                        <SelectItem value="oldies">Oldies (Pre-60s)</SelectItem>
                                                        <SelectItem value="golden-era">Golden Era (50s-70s)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Explicit Content */}
                                            <div className="space-y-2">
                                                <Label>Explicit Content</Label>
                                                <Select value={explicitContent} onValueChange={setExplicitContent}>
                                                    <SelectTrigger className="bg-white/[0.01] border-white/10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="allow">Allow</SelectItem>
                                                        <SelectItem value="avoid">Avoid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Playlist Settings</h3>

                                            {/* Duration */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Duration</Label>
                                                    <span className="text-xs text-muted-foreground">{duration} min</span>
                                                </div>
                                                <Slider
                                                    value={[parseInt(duration)]}
                                                    onValueChange={(vals) => setDuration(vals[0].toString())}
                                                    min={15}
                                                    max={180}
                                                    step={15}
                                                    className="py-2"
                                                />
                                            </div>
                                        </div>

                                        {/* Generate Button for Advanced */}
                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                            size="lg"
                                            onClick={handleGenerate}
                                            disabled={isLoading || !mood}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Curating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate Playlist
                                                </>
                                            )}
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </ScrollArea>
                </div>

                {/* Right: Results */}
                <div className="lg:col-span-2 space-y-4">
                    {!playlist && !isLoading && (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center border-2 border-dashed border-white/20 rounded-xl p-8 text-white/50 bg-white/[0.01] backdrop-blur-sm">
                            <Music className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold mb-2 text-white">Your playlist will appear here</h3>
                            <p className="text-sm max-w-md text-white/70">
                                Try "Romantic Bollywood in Hindi" or "Energetic Bhangra for Wedding"!
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-white/70 animate-pulse">Crafting your perfect playlist...</p>
                        </div>
                    )}

                    {playlist && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Your Curated Mix</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSaveToSpotify}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Save to Spotify
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="bg-white/[0.02] backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
                                {playlist.map((song, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-4 hover:bg-white/[0.01] transition-colors border-b border-white/10 last:border-0 group"
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center text-white/50 font-mono text-sm">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-white">{song.title}</p>
                                            <p className="text-sm text-white/70 truncate">{song.artist}</p>
                                        </div>
                                        <div className="text-sm text-white/70 hidden sm:block">
                                            {song.album}
                                        </div>
                                        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

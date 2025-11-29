import OpenAI from "openai"
import { z } from "zod"

// Determine which AI provider to use
const useGroq = !!process.env.GROQ_API_KEY
const useOpenRouter = !!process.env.OPENROUTER_API_KEY

if (!useGroq && !useOpenRouter) {
    console.warn("No AI API key found. Please set GROQ_API_KEY or OPENROUTER_API_KEY in .env.local")
}

// Initialize OpenAI-compatible client (works with both Groq and OpenRouter)
const client = new OpenAI({
    apiKey: useGroq ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY,
    baseURL: useGroq
        ? "https://api.groq.com/openai/v1"
        : "https://openrouter.ai/api/v1",
    defaultHeaders: useGroq ? undefined : {
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "Spotii - AI Playlist Generator",
    },
})

// Select the appropriate model based on provider
const MODEL = useGroq
    ? "llama-3.3-70b-versatile"  // Groq's latest fast Llama model
    : "meta-llama/llama-3.1-8b-instruct:free"  // OpenRouter's free model

export async function POST(req: Request) {
    try {
        const {
            mood,
            genre,
            languages,
            activity,
            energy,
            tempo,
            popularity,
            vocalPreference,
            era,
            explicitContent,
            duration,
            trackCount
        } = await req.json()

        // Determine number of songs
        const count = trackCount ? parseInt(trackCount) : Math.ceil(parseInt(duration) / 3.5)

        // Construct a detailed prompt
        let criteria = `    - Mood/Vibe: ${mood}\n`
        if (genre) criteria += `    - Genre: ${genre}\n`
        if (languages && languages.length > 0) criteria += `    - Languages: ${languages.join(", ")}\n`
        if (activity) criteria += `    - Activity/Occasion: ${activity}\n`
        if (energy) criteria += `    - Energy Level: ${energy}/100 (0=Calm, 100=Energetic)\n`
        if (tempo) criteria += `    - Tempo: ${tempo}\n`
        if (popularity) criteria += `    - Popularity: ${popularity}/100 (0=Hidden Gems, 100=Mainstream Hits)\n`
        if (vocalPreference) criteria += `    - Vocal Type: ${vocalPreference}\n`
        if (era) criteria += `    - Era: ${era}\n`
        if (explicitContent) criteria += `    - Explicit Content: ${explicitContent}\n`
        criteria += `    - Length: Approximately ${count} songs\n`

        const prompt = `Create a music playlist with the following criteria:
${criteria}
    
    Return a JSON object with a "songs" array. Each song should have:
    - title (string)
    - artist (string)
    - album (string, optional)
    
    Only return real, existing songs that fit this vibe perfectly. Ensure the songs match the requested languages and genres.`

        const completion = await client.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a music expert who creates perfect playlists. Always respond with valid JSON matching the requested schema.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        })

        const content = completion.choices[0]?.message?.content
        if (!content) {
            throw new Error("No content in response")
        }

        const data = JSON.parse(content)

        // Validate the response structure
        const schema = z.object({
            songs: z.array(
                z.object({
                    title: z.string(),
                    artist: z.string(),
                    album: z.string().optional(),
                })
            ),
        })

        const validated = schema.parse(data)
        return Response.json(validated)
    } catch (error) {
        console.error("Generation error:", error)
        return Response.json({ error: "Failed to generate playlist" }, { status: 500 })
    }
}

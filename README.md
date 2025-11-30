# Spotii 🎵✨

**AI-Powered Playlist Generator for Spotify**

Spotii is a modern web application that uses AI to create personalized music playlists tailored to your mood, vibe, and preferences. Simply describe what you're feeling, and let AI curate the perfect soundtrack for any moment.

![Spotii](public/back2.jpg)

---

## 🌟 Features

### AI-Powered Playlist Generation
- **Natural Language Prompts**: Describe your vibe in plain language (e.g., "Romantic Telugu songs for a rainy evening" or "Energetic Bollywood workout mix")
- **Smart Curation**: Powered by advanced language models (Groq Llama 3.3 or OpenRouter) to understand context, mood, and language preferences
- **Multi-Language Support**: Generate playlists in 14+ Indian and international languages including Hindi, Telugu, Tamil, Punjabi, Malayalam, English, and more

### Flexible Creation Options
- **Prompt-Based Generation**: Quick and intuitive - just type what you want
- **Basic Options**: Select mood, genre, languages, and track count
- **Advanced Filters**: Fine-tune with energy levels, tempo, popularity, vocal preferences, era, activity/occasion, and more

### Spotify Integration
- **Deferred Authentication**: Start creating playlists immediately - no Spotify login required upfront
- **One-Click Save**: Save generated playlists directly to your Spotify account
- **View Existing Playlists**: Browse and access your existing Spotify playlists from within the app
- **Smart Redirect**: Automatically prompts for Spotify login only when saving playlists

### Dashboard & Library
- **Recent Creations**: View your last 5 AI-generated playlists
- **Playlist Details**: See full song lists with artist and album information
- **Stats Panel**: Track your playlist count, songs discovered, and top genres
- **Spotify Library Integration**: Access your Spotify playlists alongside your AI-generated ones

### Modern UI/UX
- **Glassmorphism Design**: Beautiful, modern interface with glass-morphic effects and gradients
- **Dark Mode**: Eye-friendly dark theme throughout
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and micro-interactions

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Spotify Developer Account** (for Spotify integration)
- **AI API Key** (Groq or OpenRouter - see setup below)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spotii.git
   cd spotii
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   # NextAuth Configuration
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Spotify API Credentials
   SPOTIFY_CLIENT_ID="your-spotify-client-id"
   SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
   
   # AI Provider (choose one)
   GROQ_API_KEY="your-groq-api-key"
   # OR
   OPENROUTER_API_KEY="your-openrouter-api-key"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Configuration Guide

### Spotify API Setup

1. **Create a Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create App"
   - Fill in the app details (name, description, website)

2. **Configure Redirect URIs**
   - Add `http://localhost:3000/api/auth/callback/spotify` for local development
   - Add your production URL callback for deployment (e.g., `https://yourdomain.com/api/auth/callback/spotify`)

3. **Get Credentials**
   - Copy your **Client ID** and **Client Secret**
   - Add them to `.env.local`

### AI Provider Setup

Choose **one** of the following AI providers:

#### Option 1: Groq (Recommended - Fast & Free)
1. Visit [Groq Console](https://console.groq.com)
2. Create an account and get your API key
3. Add to `.env.local`: `GROQ_API_KEY="your-key-here"`
4. Uses: Llama 3.3 70B Versatile model

#### Option 2: OpenRouter
1. Visit [OpenRouter](https://openrouter.ai)
2. Create an account and get your API key
3. Add to `.env.local`: `OPENROUTER_API_KEY="your-key-here"`
4. Uses: Llama 3.1 8B Instruct (free tier)

### NextAuth Secret Generation

Generate a secure secret for NextAuth:
```bash
openssl rand -base64 32
```
Add the output to `NEXTAUTH_SECRET` in `.env.local`

---

## 📖 Usage

### Creating a Playlist

#### Method 1: Natural Language Prompt
1. Go to the Create page or use the hero section
2. Type a description like:
   - "Late night coding session with lo-fi beats"
   - "Energetic Bollywood workout mix"
   - "Romantic Telugu songs for a rainy evening"
3. Click "Generate"
4. Review your AI-curated playlist
5. Click "Save to Spotify" (will prompt for login if needed)

#### Method 2: Basic Options
1. Expand "Basic Options" in the Create page
2. Select:
   - Mood/Vibe (e.g., Chill, Energetic, Romantic)
   - Languages (multi-select)
   - Genre
   - Number of tracks
3. Click "Generate Playlist"

#### Method 3: Advanced Customization
1. Expand "Advanced Options"
2. Fine-tune with:
   - **Activity/Occasion**: Workout, Study, Party, Road Trip, etc.
   - **Energy Level**: Calm to Energetic slider
   - **Tempo**: Slow, Medium, Fast, or Mixed
   - **Music Discovery**: Hidden Gems to Popular Hits
   - **Vocal Type**: Male, Female, Mixed, or Instrumental
   - **Era**: Modern to Oldies (pre-60s)
   - **Explicit Content**: Allow or Avoid
   - **Duration**: 15-180 minutes
3. Click "Generate Playlist"

### Viewing Playlists
- **Recent Creations**: Shown on the Dashboard (5 most recent)
- **Library**: View all your created playlists
- **Spotify Playlists**: Access your Spotify library (requires authentication)
- **Playlist Details**: Click any playlist to see full song list

### Saving to Spotify
1. Generate a playlist
2. Click "Save to Spotify"
3. If not logged in, you'll be redirected to Spotify authentication
4. After login, playlist will be created in your Spotify account
5. Opens Spotify playlist in a new tab

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: Tailwind CSS 4
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: Tailwind Animate + custom CSS animations
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React hooks + localStorage

### Backend
- **Runtime**: Node.js
- **API Routes**: Next.js App Router API routes
- **Authentication**: [NextAuth.js 4](https://next-auth.js.org/)
- **OAuth Provider**: Spotify OAuth 2.0

### AI & External APIs
- **AI Models**: 
  - Groq (Llama 3.3 70B Versatile)
  - OpenRouter (Llama 3.1 8B Instruct)
- **Music API**: Spotify Web API
- **AI SDK**: OpenAI SDK (compatible with Groq/OpenRouter)

### Development Tools
- **Language**: TypeScript 5
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js)
- **Analytics**: Vercel Analytics

---

## 📁 Project Structure

```
spotii/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/  # NextAuth configuration
│   │   ├── generate/            # AI playlist generation
│   │   ├── save-playlist/       # Spotify save endpoint
│   │   └── spotify-playlists/   # Fetch user's Spotify playlists
│   ├── dashboard/               # Dashboard pages
│   │   ├── create/              # Playlist creation page
│   │   ├── library/             # User's playlist library
│   │   └── page.tsx             # Main dashboard
│   ├── login/                   # Login page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                  # React components
│   ├── ui/                      # shadcn/ui components
│   ├── about.tsx                # About section
│   ├── cta.tsx                  # Call-to-action
│   ├── faq.tsx                  # FAQ section
│   ├── footer.tsx               # Footer
│   ├── hero.tsx                 # Hero section
│   ├── navbar.tsx               # Navigation bar
│   ├── playlist-card.tsx        # Playlist card component
│   ├── playlist-details-dialog.tsx  # Playlist details modal
│   ├── providers.tsx            # NextAuth provider wrapper
│   └── stats-panel.tsx          # Statistics panel
├── hooks/                       # Custom React hooks
│   ├── use-recent-playlists.ts # Playlist management hook
│   └── use-toast.ts             # Toast notifications
├── lib/                         # Utility libraries
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
│   ├── back2.jpg                # Background image
│   └── ...                      # Icons and other assets
├── types/                       # TypeScript type definitions
├── .env.local                   # Environment variables (create this)
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## 🎨 Key Features in Detail

### Deferred Spotify Authentication
Unlike traditional music apps, Spotii allows users to:
1. Land on the site and immediately start creating playlists
2. Use AI to generate playlists without any login
3. View and interact with generated playlists locally
4. Only authenticate with Spotify when ready to save

This reduces friction and lets users experience the core value proposition instantly.

### Intelligent AI Prompting
The AI generation system:
- Parses natural language to understand mood, genre, language, and context
- Supports structured inputs with 20+ configurable parameters
- Validates responses using Zod schemas
- Handles language-specific requests accurately (e.g., Telugu, Tamil, Hindi songs)
- Returns real, existing songs that match the criteria

### Local Playlist Management
- Playlists are stored in localStorage for instant access
- No database required for core functionality
- Tracks statistics: total playlists, songs, top genres
- Persists across sessions
- Can delete playlists with confirmation

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Configure environment variables (same as `.env.local`)

3. **Update Spotify Redirect URI**
   - Add your production URL to Spotify app settings
   - `https://yourdomain.vercel.app/api/auth/callback/spotify`

4. **Deploy**
   - Vercel will automatically build and deploy

### Other Platforms
Spotii can be deployed to any platform that supports Next.js:
- **Netlify**: Use the Next.js runtime
- **Cloudflare Pages**: Use the @cloudflare/next-on-pages adapter
- **Railway/Render**: Deploy as a Node.js application
- **Docker**: Use the official Next.js Dockerfile

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (TypeScript, React best practices)
- Add comments for complex logic
- Test on multiple browsers and devices
- Update documentation for new features

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXTAUTH_SECRET` | ✅ Yes | Secret for NextAuth session encryption | Random 32-char string |
| `NEXTAUTH_URL` | ✅ Yes | Base URL of your application | `http://localhost:3000` |
| `SPOTIFY_CLIENT_ID` | ✅ Yes | Spotify app client ID | From Spotify Dashboard |
| `SPOTIFY_CLIENT_SECRET` | ✅ Yes | Spotify app client secret | From Spotify Dashboard |
| `GROQ_API_KEY` | ⚠️ One Required | Groq API key for AI generation | From Groq Console |
| `OPENROUTER_API_KEY` | ⚠️ One Required | OpenRouter API key (alternative to Groq) | From OpenRouter |

---

## 🐛 Troubleshooting

### Spotify Authentication Issues
- **Error**: "INVALID_CLIENT: Insecure redirect URI"
  - **Solution**: Ensure redirect URI in Spotify dashboard matches `NEXTAUTH_URL/api/auth/callback/spotify`

### AI Generation Fails
- **Error**: "Failed to generate playlist"
  - **Solution**: Check that either `GROQ_API_KEY` or `OPENROUTER_API_KEY` is set correctly
  - Verify API key is valid and has available quota

### Songs Not Matching Language
- **Issue**: Generated songs don't match requested language
  - **Solution**: Be specific in your prompt (e.g., "Telugu songs only" or "Hindi Bollywood songs")

### Playlists Not Persisting
- **Issue**: Playlists disappear after refresh
  - **Solution**: Check browser's localStorage is enabled and not being cleared

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- **AI Models**: [Groq](https://groq.com/) and [Meta Llama](https://llama.meta.com/)
- **Music Data**: [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- **Icons**: [Lucide Icons](https://lucide.dev/)

---

## 📧 Contact

For questions, suggestions, or issues:
- Open an issue on GitHub
- Reach out via [your contact method]

---

**Made with ❤️ and AI**

Create your vibe. Discover your sound. Welcome to Spotii.

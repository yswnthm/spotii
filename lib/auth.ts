import { NextAuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    scope: "user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative",
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken
            return session
        },
    },
}

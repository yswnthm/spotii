"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Music, Home, PlusCircle, Library, LogOut, PanelLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { data: session } = useSession()

    const navigation = [
        { name: "Home", href: "/dashboard", icon: Home },
        { name: "Create Playlist", href: "/dashboard/create", icon: PlusCircle },
        { name: "My Library", href: "/dashboard/library", icon: Library },
    ]

    return (
        <div className="min-h-screen bg-background flex relative overflow-hidden">
            {/* Global Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    alt="Background image"
                    src="/back2.jpg"
                    fill
                    priority
                    className="object-cover blur-[2px] opacity-40"
                    style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black/0" />
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "border-r border-white/10 bg-black/40 backdrop-blur-md hidden md:flex flex-col transition-all duration-300 ease-in-out relative z-10",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className={cn("p-6", isCollapsed && "px-4")}>
                    <Link href="/" className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                            <Music className="w-5 h-5 text-primary-foreground" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-xl font-bold text-foreground overflow-hidden whitespace-nowrap transition-all duration-300">
                                Spotii
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-3 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px]",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <span className="overflow-hidden whitespace-nowrap transition-all duration-300">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                            isCollapsed ? "justify-center px-2" : "justify-start"
                        )}
                        onClick={() => signOut({ callbackUrl: '/' })}
                        title={isCollapsed ? "Sign Out" : undefined}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isCollapsed && (
                            <span className="ml-2 overflow-hidden whitespace-nowrap transition-all duration-300">
                                Sign Out
                            </span>
                        )}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-black/5 backdrop-blur-md sticky top-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <PanelLeft className="w-5 h-5" />
                    </Button>

                    {/* Connected Services Badges */}
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                            session?.accessToken
                                ? "bg-[#1DB954]/10 border border-[#1DB954]/30"
                                : "bg-white/5 border border-white/20"
                        )}>
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill={session?.accessToken ? "#1DB954" : "#ffffff40"}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            <span className={cn(
                                "text-xs font-medium",
                                session?.accessToken ? "text-[#1DB954]" : "text-white/50"
                            )}>
                                Spotify {session?.accessToken ? "Connected" : "Not Connected"}
                            </span>
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    )
}

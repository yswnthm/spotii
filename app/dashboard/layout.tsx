"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Music, Home, PlusCircle, Library, LogOut, PanelLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

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
                    "border-r border-white/10 bg-black/5 backdrop-blur-md hidden md:flex flex-col transition-all duration-300 ease-in-out relative z-10",
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
                <header className="h-16 border-b border-white/10 flex items-center px-4 bg-black/5 backdrop-blur-md sticky top-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <PanelLeft className="w-5 h-5" />
                    </Button>
                </header>
                {children}
            </main>
        </div>
    )
}

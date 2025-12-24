"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TrendingUp, Menu, User, LogOut } from "lucide-react"

export function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("X-Token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("X-Token")
    setIsLoggedIn(false)
    setShowUserMenu(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 glow">
              <TrendingUp className="h-5 w-5 text-white font-bold" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              PredictX
            </span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => router.push("/")} className="transition-colors hover:text-primary">
            Markets
          </button>
          <button onClick={() => router.push("/portfolio")} className="transition-colors hover:text-primary">
            Portfolio
          </button>
          <button onClick={() => router.push("/learn")} className="transition-colors hover:text-primary">
            Learn
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {/* User Menu */}
          {isLoggedIn ? (
            <div className="relative">
              <Button
                onClick={() => setShowUserMenu(!showUserMenu)}
                variant="ghost"
                size="sm"
                className="gap-2 glow-hover"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border/50 bg-card/95 backdrop-blur-xl shadow-lg glass animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/portfolio")
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors"
                    >
                      Portfolio
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/settings")
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors"
                    >
                      Settings
                    </button>
                    <div className="border-t border-border/50 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              size="default"
              className="glow-hover rounded-md px-6"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount, useDisconnect, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import { TrendingUp, Menu, User, LogOut, Wallet, ExternalLink } from "lucide-react"
import { formatUnits } from "viem"

export function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("X-Token")
    setIsLoggedIn(!!token)
  }, [])

  // Function to open wallet modal
  const openWalletModal = () => {
    // Use the global modal event
    const event = new CustomEvent('web3modal:open')
    window.dispatchEvent(event)
  }

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
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border/50 bg-card/95 backdrop-blur-xl shadow-lg glass animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 space-y-1">
                    {/* Wallet Section */}
                    {isConnected && address ? (
                      <>
                        <div className="px-3 py-2 mb-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Wallet className="h-4 w-4 text-purple-400" />
                            <span className="text-xs font-semibold text-muted-foreground">WALLET</span>
                          </div>
                          <div className="bg-background/50 rounded-md p-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <code className="text-xs font-mono text-foreground">
                                {address.slice(0, 6)}...{address.slice(-4)}
                              </code>
                              <button
                                onClick={() => {
                                  setShowUserMenu(false)
                                  openWalletModal()
                                }}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </div>
                            {balance && (
                              <div className="flex items-center justify-between pt-1 border-t border-border/30">
                                <span className="text-xs text-muted-foreground">Balance</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-semibold text-foreground">
                                    {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{balance.symbol}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            disconnect()
                            setShowUserMenu(false)
                          }}
                          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors text-orange-400 flex items-center gap-2"
                        >
                          <Wallet className="h-4 w-4" />
                          Disconnect Wallet
                        </button>
                        <div className="border-t border-border/50 my-1"></div>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            openWalletModal()
                          }}
                          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors text-purple-400 flex items-center gap-2"
                        >
                          <Wallet className="h-4 w-4" />
                          Connect Wallet
                        </button>
                        <div className="border-t border-border/50 my-1"></div>
                      </>
                    )}

                    {/* Account Menu Items */}
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, Wallet, ArrowLeft, TrendingUp } from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpValue, setOtpValue] = useState("")

  const handleEmailLogin = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.signIn(email)

      if (response.success) {
        setShowOTP(true)
      } else {
        setError(response.error?.message || "Failed to send OTP")
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPComplete = async (value: string) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.verifyOtp(email, value)

      if (response.success) {
        // Token is automatically saved as X-Token in API client
        router.push("/")
      } else {
        setError(response.error?.message || "Invalid OTP")
        // Clear OTP input on error so user can try again
        setOtpValue("")
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Invalid OTP")
      // Clear OTP input on error so user can try again
      setOtpValue("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = async () => {
    setIsLoading(true)
    setError("")

    // Wallet connection would be implemented here
    // For now, show a message
    setError("Wallet connection coming soon!")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to markets</span>
          </button>

          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 glow">
                <TrendingUp className="h-7 w-7 text-white font-bold" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                PredictX
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {showOTP ? "Verify your email" : "Welcome back"}
              </h1>
              <p className="text-muted-foreground">
                {showOTP 
                  ? `We sent a code to ${email}`
                  : "Sign in to start trading on prediction markets"
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {!showOTP ? (
              <>
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                      placeholder="you@example.com"
                      className="w-full bg-background/50 rounded-xl py-3 pl-11 pr-4 h-12 glass"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Login Button */}
                <Button
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                  className="w-full py-6 text-base glow-hover"
                >
                  {isLoading ? "Sending code..." : "Continue with Email"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-muted-foreground">OR</span>
                  </div>
                </div>

                {/* Wallet Connect Button */}
                <Button
                  onClick={handleWalletConnect}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full py-6 text-base gap-2 glass glow-hover"
                >
                  <Wallet className="h-5 w-5" />
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={otpValue}
                      onChange={setOtpValue}
                      onComplete={handleOTPComplete}
                      containerClassName="gap-2"
                      disabled={isLoading}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-lg glass border-purple-500/30" />
                        <InputOTPSlot index={1} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-lg glass border-purple-500/30" />
                        <InputOTPSlot index={2} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-lg glass border-purple-500/30" />
                        <InputOTPSlot index={3} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-lg glass border-purple-500/30" />
                        <InputOTPSlot index={4} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-lg glass border-purple-500/30" />
                        <InputOTPSlot index={5} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-lg glass border-purple-500/30" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Enter the 6-digit code we sent to your email
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Resend Code */}
                <div className="text-center space-y-2">
                  <button
                    onClick={() => setShowOTP(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change email address
                  </button>
                  <br />
                  <button
                    onClick={handleEmailLogin}
                    disabled={isLoading}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {isLoading ? "Sending..." : "Resend code"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900/10 via-indigo-900/10 to-purple-900/10 items-center justify-center p-12 border-l border-purple-500/20">
        <div className="max-w-lg space-y-6 text-center">
          <div className="relative">
            {/* Illustration Placeholder */}
            <div className="relative w-full aspect-square rounded-3xl glass glow p-8 flex items-center justify-center">
              <div className="space-y-6 w-full">
                {/* Mock Chart */}
                <div className="flex items-end justify-center gap-2 h-48">
                  {[40, 70, 50, 90, 60, 85, 75].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-lg animate-pulse"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass rounded-xl p-4">
                    <p className="text-2xl font-bold text-green-400">+24%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-2xl font-bold text-purple-400">150</p>
                    <p className="text-xs text-muted-foreground">Trades</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-2xl font-bold text-indigo-400">12K</p>
                    <p className="text-xs text-muted-foreground">Volume</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Trade on real-world events
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of traders making predictions on politics, sports, crypto, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

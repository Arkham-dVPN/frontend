import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Network, Coins } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="text-2xl font-light tracking-wider text-foreground">ARKHAM</div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-sm tracking-wide text-muted-foreground hover:text-foreground">
              ENTER DASHBOARD
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Subtle tagline above */}
          <div className="mb-8 text-sm tracking-[0.3em] text-muted-foreground">THE SABLE CHURCH</div>

          {/* Main title */}
          <h1 className="mb-4 text-6xl font-light tracking-tight text-foreground md:text-8xl">ARKHAM</h1>

          {/* Tagline */}
          <p className="mb-12 max-w-md text-lg tracking-wide text-muted-foreground">Reclaim Your Digital Sovereignty</p>

          {/* Main CTA with sun ray effect */}
          <div className="relative">
            {/* Sun ray lines */}
            <div className="absolute inset-0 -z-10">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-32 w-[1px] origin-bottom animate-sunray bg-gradient-to-t from-primary/0 to-primary/30"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            <Link href="/dashboard">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-primary px-12 py-6 text-lg font-medium tracking-wide text-primary-foreground shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all hover:shadow-[0_0_50px_rgba(255,215,0,0.5)]"
              >
                <span className="relative z-10">ACTIVATE THE VEIL</span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-20" />
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-24 text-xs tracking-[0.3em] text-muted-foreground">SCROLL TO REVEAL</div>
        </div>

        {/* Background geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full border border-primary blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full border border-accent blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 py-32">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-sm tracking-[0.3em] text-muted-foreground">CORE PRINCIPLES</h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Privacy */}
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Privacy</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Your data remains yours. No logs, no tracking, no compromise. Move through the digital realm unseen.
              </p>
            </div>

            {/* Decentralization */}
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Network className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Decentralization</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Powered by a distributed network of nodes. No single point of failure. True digital sovereignty.
              </p>
            </div>

            {/* Rewards */}
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Coins className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Rewards</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Contribute bandwidth, earn rewards. The network grows stronger with every node that joins the cause.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-muted-foreground">© 2025 ARKHAM · THE VEIL AWAITS</p>
        </div>
      </footer>
    </div>
  )
}

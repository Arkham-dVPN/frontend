"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Network, Coins, FileText, Play, Zap, GitBranch, Lock, Server, Laptop, Github } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="text-2xl font-light tracking-wider text-foreground">ARKHAM</div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="gap-2 text-sm tracking-wide text-muted-foreground hover:text-foreground">
                  <Play className="h-4 w-4" /> DEMO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-black border-0">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/ocuhi0PIgNU"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm tracking-wide text-muted-foreground hover:text-foreground">
                ENTER DASHBOARD
              </Button>
            </Link>
            <Link href="https://github.com/Arkham-dVPN" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 text-sm tracking-[0.3em] text-muted-foreground">THE SABLE CHURCH</div>
          <h1 className="mb-4 text-6xl font-light tracking-tight text-foreground md:text-8xl">ARKHAM</h1>
          <p className="mb-12 max-w-md text-lg tracking-wide text-muted-foreground">Reclaim Your Digital Sovereignty</p>
          <div className="relative">
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
          <div className="mt-24 text-xs tracking-[0.3em] text-muted-foreground">SCROLL TO REVEAL</div>
        </div>
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
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Privacy</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Your data remains yours. No logs, no tracking, no compromise. Move through the digital realm unseen.
              </p>
            </div>
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Network className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Decentralization</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Powered by a distributed network of nodes. No single point of failure. True digital sovereignty.
              </p>
            </div>
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

      {/* Advanced Features Section */}
      <section className="py-32 bg-card border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-sm tracking-[0.3em] text-muted-foreground">ADVANCED FEATURES</h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background/30 transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Intelligent Routing</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Arkham automatically selects the fastest, lowest-latency peer available to ensure a smooth and responsive connection.
              </p>
            </div>
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background/30 transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <GitBranch className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Multi-Hop Anonymity</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                For maximum privacy, you can chain your connection through multiple nodes, making it significantly harder to trace your traffic's origin.
              </p>
            </div>
            <div className="group relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background/30 transition-all group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-light tracking-wide text-foreground">Secure & Transparent</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Built on WireGuard® with secure DNS to prevent leaks. The entire protocol is open for inspection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download CLI Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-sm tracking-[0.3em] text-muted-foreground">JOIN THE NETWORK</h2>
            <p className="mt-4 max-w-2xl mx-auto text-4xl font-light text-foreground">
              Become a Node Operator
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Contribute to a decentralized internet by running an Arkham node on your hardware. Download the CLI to get started.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Button size="lg" variant="outline" className="w-full sm:w-64 gap-3 px-8 py-6 text-lg" asChild>
                <Link href="/builds-1.0.0/arkham-cli-linux-amd64">
                  <Image src="/icons8-linux-50.png" alt="Linux Logo" width={24} height={24} />
                  Linux (x86)
                </Link>
              </Button>
              <Link href="/builds-1.0.0/arkham-cli-linux-arm64" className="text-xs text-muted-foreground hover:text-primary hover:underline">
                Download for ARM64
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="lg" variant="outline" className="w-full sm:w-72 gap-3 px-8 py-6 text-lg" asChild>
                <Link href="/builds-1.0.0/arkham-cli-macos-amd64">
                  <Image src="/icons8-apple-30.png" alt="Apple Logo" width={24} height={24} />
                  macOS (Intel)
                </Link>
              </Button>
              <Link href="/builds-1.0.0/arkham-cli-macos-arm64" className="text-xs text-muted-foreground hover:text-primary hover:underline">
                Download for Apple Silicon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 bg-card border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-sm tracking-[0.3em] text-muted-foreground">HOW IT WORKS</h2>
            <p className="mt-4 max-w-2xl mx-auto text-4xl font-light text-foreground">
              Get Started in Minutes
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            {/* The connecting line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-border hidden md:block" />

            <div className="space-y-16">
              <div className="relative flex items-start">
                <div className="h-16 w-16 rounded-full bg-background border border-border flex items-center justify-center z-10 shrink-0">
                  <span className="text-2xl font-light text-primary">1</span>
                </div>
                <div className="ml-8">
                  <h3 className="text-xl font-light tracking-wide text-foreground mb-2">Download & Run the CLI</h3>
                  <p className="text-muted-foreground">Download the appropriate binary for your system. Open your terminal, make the file executable (`chmod +x ./arkham-cli-linux-amd64`), and run it.</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="h-16 w-16 rounded-full bg-background border border-border flex items-center justify-center z-10 shrink-0">
                  <span className="text-2xl font-light text-primary">2</span>
                </div>
                <div className="ml-8">
                  <h3 className="text-xl font-light tracking-wide text-foreground mb-2">Start at Least Two Nodes</h3>
                  <p className="text-muted-foreground">For the network to function, you need at least two nodes. Use the CLI to start one "Gateway Node" (with sudo) and at least one "Peer-Only Node" in separate terminal windows.</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="h-16 w-16 rounded-full bg-background border border-border flex items-center justify-center z-10 shrink-0">
                  <span className="text-2xl font-light text-primary">3</span>
                </div>
                <div className="ml-8">
                  <h3 className="text-xl font-light tracking-wide text-foreground mb-2">Use the Dashboard</h3>
                  <p className="text-muted-foreground">Once your nodes are running, use the CLI menu to open the web dashboard. You'll see your active nodes and can "Activate The Veil" to secure your connection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DAWN Bounty Section */}
      <Dialog>
        <section className="py-32 bg-card border-y border-border/50">
          <div className="container mx-auto px-6 text-center flex flex-col items-center">
            <Image src="/dawn-logo.png" alt="DAWN Logo" width={80} height={40} className="mb-4" />
            <h2 className="text-sm tracking-[0.3em] text-muted-foreground">BUILT FOR THE BLACK BOX</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground">
              Arkham is proudly submitted to the DAWN Cypherpunk bounty. It’s designed to run on the DAWN Black Box, transforming the decentralized hardware network into a user-owned shield for digital privacy.
            </p>
            <DialogTrigger asChild>
              <p className="mt-4 text-sm font-medium cursor-pointer text-primary/80 hover:text-primary hover:underline transition-colors">
                Learn how Arkham is designed for the Black Box
              </p>
            </DialogTrigger>
            <Card className="max-w-2xl w-full mt-12 border-border/50 bg-background/30 p-6 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-foreground">Technical Whitepaper</h3>
                  <p className="text-sm text-muted-foreground mt-1">A deep dive into the architecture and vision of Arkham.</p>
                </div>
                <Link href="https://www.notion.so/Arkham-Whitepaper-28c2140c9bcb802c8af3f7f46f282eb6?source=copy_link" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 shrink-0 w-full sm:w-auto">
                    <FileText className="h-4 w-4" />
                    View on Notion
                  </Button>
                </Link>
              </Card>
          </div>
        </section>
        <DialogContent className="bg-card border-border/50 text-foreground">
          <DialogHeader>
            <DialogTitle className="mb-4">Arkham & The DAWN Black Box</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Arkham is designed from the ground up to be a core service running inside every DAWN Black Box. The backend is a lightweight, self-contained Go application, making it perfect for deployment within a Linux container on the Black Box hardware.
              <br /><br />
              This approach turns the distributed network of Black Boxes into a powerful, cohesive, and privacy-preserving dVPN for the entire community, adding immense value to every device owner and directly fulfilling the vision of the DAWN cypherpunk bounty.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6 text-center text-xs text-muted-foreground">
          <p>
            © 2025 by Skipp · <a href="https://x.com/davidnzubee" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">Follow on X</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
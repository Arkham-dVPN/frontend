
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Globe, Shield, Activity, Loader } from "lucide-react"

// Define the structure of the API response
interface ConnectionDetails {
  status: string;
  message: string;
  warden_peer_id?: string;
  seeker_public_key?: string;
  warden_public_key?: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [connection, setConnection] = useState<ConnectionDetails | null>(null);

  const veilIsActive = connection?.status === "success";

  const handleToggleVeil = async () => {
    // If we are already connected, this button should disconnect (for now, just reset state)
    if (veilIsActive) {
      setConnection(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/connect', { 
        method: 'POST',
      });
      const data: ConnectionDetails = await res.json();
      setConnection(data);
    } catch (error) {
      console.error("Failed to connect:", error);
      setConnection({
        status: "error",
        message: "Failed to connect to backend. Is it running?",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm tracking-wide">RETURN</span>
            </Button>
          </Link>
          <div className="text-2xl font-light tracking-wider text-foreground">ARKHAM</div>
          <div className="flex items-center gap-2 text-xs tracking-wide text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${veilIsActive ? "bg-primary animate-pulse-glow" : "bg-muted"}`} />
            <span>{isLoading ? "CONNECTING..." : (veilIsActive ? "ONLINE" : "OFFLINE")}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Control Panel */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card p-8">
              {/* The Veil Toggle */}
              <div className="mb-12 flex flex-col items-center">
                <h2 className="mb-2 text-sm tracking-[0.3em] text-muted-foreground">THE VEIL</h2>
                <button
                  onClick={handleToggleVeil}
                  disabled={isLoading}
                  className={`relative h-16 w-32 rounded-full border-2 transition-all disabled:opacity-50 ${
                    veilIsActive
                      ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                      : "border-border bg-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-1 flex items-center justify-center h-12 w-12 rounded-full transition-all ${
                      veilIsActive
                        ? "left-[calc(100%-3.25rem)] bg-primary shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                        : "left-1 bg-muted"
                    }`}
                  >
                    {isLoading && <Loader className="h-6 w-6 animate-spin" />}
                  </div>
                </button>
                <p className="mt-4 text-sm tracking-wide text-muted-foreground">
                  {isLoading ? "NEGOTIATING..." : (veilIsActive ? "SECURED" : "EXPOSED")}
                </p>
              </div>

              {/* World Map - This part remains the same visually */}
              <div className="relative aspect-[2/1] overflow-hidden rounded-lg border border-border/50 bg-secondary/30">
                 <svg viewBox="0 0 800 400" className="h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100,150 L150,120 L200,130 L250,110 L300,120 L350,100 L400,110 L450,90 L500,100 L550,80 L600,90 L650,70 L700,80" stroke="currentColor" strokeWidth="1" fill="none" />
                  <path d="M100,200 L150,220 L200,210 L250,230 L300,220 L350,240 L400,230 L450,250 L500,240 L550,260 L600,250 L650,270 L700,260" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
                <div className="absolute inset-0">
                  {[ { x: "15%", y: "30%" }, { x: "35%", y: "45%" }, { x: "55%", y: "35%" }, { x: "75%", y: "50%" }, { x: "85%", y: "40%" }, ].map((pos, i) => (
                    <div key={i} className="absolute h-2 w-2 rounded-full bg-foreground/40" style={{ left: pos.x, top: pos.y }} />
                  ))}
                  <div className="absolute h-4 w-4 rounded-full bg-primary animate-pulse-glow" style={{ left: "25%", top: "55%" }} />
                  {veilIsActive && (
                    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                      <line x1="25%" y1="55%" x2="75%" y2="50%" stroke="#FFA500" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                    </svg>
                  )}
                  {veilIsActive && (
                    <div className="absolute h-3 w-3 rounded-full bg-accent shadow-[0_0_15px_rgba(255,165,0,0.6)]" style={{ left: "75%", top: "50%" }} />
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-sm tracking-wide text-foreground">CONNECTION STATUS</h3>
              </div>
              <p className={`text-2xl font-light ${veilIsActive ? "text-primary" : "text-muted-foreground"}`}>
                {veilIsActive ? "Secured" : "Not Connected"}
              </p>
			  {connection?.message && <p className="text-xs text-muted-foreground mt-2">{connection.message}</p>}
            </Card>

            <Card className="border-border/50 bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="text-sm tracking-wide text-foreground">WARDEN ID</h3>
              </div>
              <p className="font-mono text-xs text-muted-foreground break-all">{connection?.warden_peer_id || "N/A"}</p>
            </Card>

            <Card className="border-border/50 bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-sm tracking-wide text-foreground">WARDEN PUBLIC KEY</h3>
              </div>
              <p className="font-mono text-xs text-muted-foreground break-all">{connection?.warden_public_key || "N/A"}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

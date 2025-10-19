
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApiUrl } from "@/hooks/use-api-url";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

const gatewayNodes = [
  { name: "Local Testnet", url: "http://localhost:8080", available: true },
  { name: "Render Testnet", url: "https://arkham-dvpn.onrender.com", available: false },
  { name: "Arkham Mainnet", url: "https://dvpn.arkham.io", available: true },
];

export default function SettingsPage() {
  const { apiUrl, updateApiUrl } = useApiUrl();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm tracking-wide">RETURN TO DASHBOARD</span>
            </Button>
          </Link>
          <div className="text-2xl font-light tracking-wider text-foreground">SETTINGS</div>
          <div className="w-48"></div> {/* Adjusted width for alignment */}
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto border-border/50 bg-card p-8">
          <h2 className="text-lg font-medium mb-2">Gateway Node Selection</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose the API entrypoint for the Arkham network. This node acts as a bridge between the UI and the P2P network.
          </p>
          <div className="space-y-3">
            {gatewayNodes.map((node) => (
              <Button
                key={node.url}
                variant={apiUrl === node.url ? "secondary" : "outline"}
                className="w-full justify-between h-12 text-left"
                onClick={() => updateApiUrl(node.url)}
                disabled={!node.available}
              >
                <div className="flex items-center">
                  {node.available ? (
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-3 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold">{node.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{node.url}</p>
                  </div>
                </div>
                {apiUrl === node.url && (
                  <div className="text-xs bg-primary/20 text-primary-foreground py-1 px-2 rounded-full">
                    ACTIVE
                  </div>
                )}
              </Button>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

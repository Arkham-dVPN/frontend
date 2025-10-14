
"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiUrl } from "@/hooks/use-api-url";
import { ArrowLeft, Save } from "lucide-react";

export default function SettingsPage() {
  const { apiUrl, updateApiUrl } = useApiUrl();
  const [localUrl, setLocalUrl] = useState(apiUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateApiUrl(localUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
          <div className="w-40"></div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto border-border/50 bg-card p-8">
          <h2 className="text-lg font-medium mb-6">Backend Configuration</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">Backend API URL</Label>
              <p className="text-xs text-muted-foreground">
                Set the URL for the Arkham backend node. Defaults to a public instance for demo purposes.
              </p>
              <Input
                id="api-url"
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder="e.g., http://localhost:8080"
              />
            </div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              <span>{saved ? "Saved!" : "Save Changes"}</span>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

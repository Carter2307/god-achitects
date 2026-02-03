import { useState } from "react";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Input } from "~/ui/input";

export default function ManualCheckIn() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockUser = {
    id: "1",
    email: "marie.martin@example.com",
    firstName: "Marie",
    lastName: "Martin",
    role: "secretary" as const,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search
    console.log("Search:", searchQuery);
  };

  return (
    <AppShell role="secretary" title="Check-in manuel" user={mockUser}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Rechercher une réservation</CardTitle>
            <CardDescription>
              Recherchez par nom, email ou numéro de place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Nom, email ou place (ex: A-12)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Rechercher</Button>
            </form>
          </CardContent>
        </Card>

        {/* Pending Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Check-ins en attente</CardTitle>
            <CardDescription>
              Réservations d'aujourd'hui en attente de check-in (avant 11h)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="mt-4 text-muted-foreground">
                Aucun check-in en attente
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Check-ins récents</CardTitle>
            <CardDescription>
              Check-ins effectués aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="mt-4 text-muted-foreground">
                Aucun check-in aujourd'hui
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

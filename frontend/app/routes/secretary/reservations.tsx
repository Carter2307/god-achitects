import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Input } from "~/ui/input";

export default function SecretaryReservations() {
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

  return (
    <AppShell role="secretary" title="Toutes les réservations" user={mockUser}>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 pt-6">
            <Input placeholder="Rechercher par nom, email..." className="max-w-xs" />
            <Input type="date" className="max-w-xs" />
            <Button variant="secondary" size="sm">
              Toutes
            </Button>
            <Button variant="ghost" size="sm">
              En cours
            </Button>
            <Button variant="ghost" size="sm">
              À venir
            </Button>
            <Button variant="ghost" size="sm">
              En attente
            </Button>
            <Button variant="ghost" size="sm">
              Annulées
            </Button>
          </CardContent>
        </Card>

        {/* Reservations List */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations</CardTitle>
            <CardDescription>
              Toutes les réservations du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <p className="mt-4 text-muted-foreground">
                Aucune réservation trouvée
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

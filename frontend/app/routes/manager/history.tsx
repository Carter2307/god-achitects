import { AppShell } from "~/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Button } from "~/ui/button";

export default function ManagerHistory() {
  const mockUser = {
    id: "1",
    email: "pierre.durand@example.com",
    firstName: "Pierre",
    lastName: "Durand",
    role: "manager" as const,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <AppShell role="manager" title="Historique" user={mockUser}>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Button variant="secondary" size="sm">
              Toutes
            </Button>
            <Button variant="ghost" size="sm">
              Terminées
            </Button>
            <Button variant="ghost" size="sm">
              Annulées
            </Button>
            <Button variant="ghost" size="sm">
              No-show
            </Button>
          </CardContent>
        </Card>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des réservations</CardTitle>
            <CardDescription>
              Toutes vos réservations passées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="mt-4 text-muted-foreground">
                Aucun historique disponible
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

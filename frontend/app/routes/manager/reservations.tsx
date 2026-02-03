import { Link } from "react-router";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";

export default function ManagerReservations() {
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
    <AppShell
      role="manager"
      title="Mes réservations"
      user={mockUser}
      actions={
        <Button asChild size="sm">
          <Link to="/manager/reservations/new">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouvelle réservation
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <div>
              <p className="font-medium">Privilège Manager</p>
              <p className="text-sm text-muted-foreground">
                En tant que manager, vous pouvez réserver une place pour une durée maximale de 30 jours.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
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
              En attente de check-in
            </Button>
          </CardContent>
        </Card>

        {/* Reservations List */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations actuelles et futures</CardTitle>
            <CardDescription>
              Gérez vos réservations de parking (jusqu'à 30 jours)
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
              <Button variant="link" asChild className="mt-2">
                <Link to="/manager/reservations/new">Faire une réservation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

import { Link } from "react-router";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";

export default function EmployeeReservations() {
  const mockUser = {
    id: "1",
    email: "jean.dupont@example.com",
    firstName: "Jean",
    lastName: "Dupont",
    role: "employee" as const,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <AppShell
      role="employee"
      title="Mes réservations"
      user={mockUser}
      actions={
        <Button asChild size="sm">
          <Link to="/employee/reservations/new">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouvelle réservation
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
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
              Gérez vos réservations de parking
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
                <Link to="/employee/reservations/new">Faire une réservation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

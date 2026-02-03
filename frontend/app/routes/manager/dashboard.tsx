import { Link } from "react-router";
import { AppShell } from "~/components/layouts";
import { StatCard } from "~/components/dashboard/stat-card";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";

export default function ManagerDashboard() {
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
    <AppShell role="manager" title="Tableau de bord" user={mockUser}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bonjour, {mockUser.firstName}!</h2>
            <p className="text-muted-foreground">
              Voici les métriques clés du parking.
            </p>
          </div>
          <Button asChild>
            <Link to="/manager/reservations/new">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nouvelle réservation
            </Link>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Utilisateurs actifs"
            value="24"
            description="sur 30 inscrits"
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
          />
          <StatCard
            title="Taux d'occupation moyen"
            value="68%"
            description="sur les 30 derniers jours"
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            }
            variant="success"
          />
          <StatCard
            title="Taux de no-show"
            value="8%"
            description="réservations non utilisées"
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            }
            variant="warning"
          />
          <StatCard
            title="Places avec chargeur"
            value="33%"
            description="10 sur 30 places"
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            }
          />
        </div>

        {/* Reservation Volume Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de réservations</CardTitle>
            <CardDescription>
              Évolution des réservations sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/50">
              <div className="text-center">
                <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                <p className="mt-4 text-muted-foreground">
                  Graphique à implémenter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Peak Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Heures de pointe</CardTitle>
              <CardDescription>
                Répartition des arrivées par tranche horaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm text-muted-foreground">7h-9h</span>
                  <div className="flex-1 rounded-full bg-muted">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                  <span className="w-10 text-sm font-medium">75%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm text-muted-foreground">9h-11h</span>
                  <div className="flex-1 rounded-full bg-muted">
                    <div className="h-2 w-1/4 rounded-full bg-primary" />
                  </div>
                  <span className="w-10 text-sm font-medium">20%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm text-muted-foreground">11h+</span>
                  <div className="flex-1 rounded-full bg-muted">
                    <div className="h-2 w-[5%] rounded-full bg-primary" />
                  </div>
                  <span className="w-10 text-sm font-medium">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charger Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisation des bornes</CardTitle>
              <CardDescription>
                Taux d'utilisation des places avec chargeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-warning">85%</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Taux d'utilisation
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">42</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sessions ce mois
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

import { Link } from "react-router";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { useApiQuery } from "~/hooks/use-api";
import type { ReservationWithDetails } from "~/types/reservation";
import {useCurrentUser} from "~/hooks";
import type {User} from "~/types";

const MOCK_USER_ID = "employe@parking.com"; // Will be replaced by actual user ID after seed

export default function EmployeeReservations() {
  const {data:user} = useCurrentUser(MOCK_USER_ID);

  // Récupère les réservations pour l'utilisateur mocké
  const { data: reservations, isLoading, error } = useApiQuery<ReservationWithDetails[]>(
    ["reservations", user?.id],
    `/reservations?userId=${user?.id}`
  );


  console.log(reservations)

  return (
    <AppShell
      role="employee"
      title="Mes réservations"
      user={user ? (user as unknown as User) : null }
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
            <CardDescription>Gérez vos réservations de parking</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Chargement des réservations...</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">Erreur lors du chargement des réservations</div>
            ) : !reservations || reservations.length === 0 ? (
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <p className="mt-4 text-muted-foreground">Aucune réservation trouvée</p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/employee/reservations/new">Faire une réservation</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(r.date).toLocaleDateString()} — Place {r.parkingSpot?.row ?? ""}{r.parkingSpot ? ` / ${r.parkingSpot.number}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Statut: {r.statut}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Chargement requis: {r.besoinChargeur ? "Oui" : "Non"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/employee/reservations/${r.id}`} className="text-sm text-primary">Détails</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

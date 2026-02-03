import { useState } from "react";
import { Link } from "react-router";
import { AppShell } from "~/components/layouts";
import { ParkingGrid } from "~/components/parking/parking-grid";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Input } from "~/ui/input";

export default function ManagerNewReservation() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [needsCharger, setNeedsCharger] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement reservation creation
    console.log({ startDate, endDate, needsCharger, selectedSpot });
  };

  return (
    <AppShell
      role="manager"
      title="Nouvelle réservation"
      user={mockUser}
      actions={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/manager/reservations">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Annuler
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Manager Privilege Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <div>
              <p className="font-medium">Privilège Manager</p>
              <p className="text-sm text-muted-foreground">
                Vous pouvez réserver jusqu'à 30 jours consécutifs.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
              <CardDescription>
                Maximum 30 jours consécutifs (privilège manager)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Date de début
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  Date de fin
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
              <CardDescription>
                Configurez votre réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                <input
                  type="checkbox"
                  checked={needsCharger}
                  onChange={(e) => setNeedsCharger(e.target.checked)}
                  className="size-4 rounded border-gray-300"
                />
                <div>
                  <p className="font-medium">Borne de recharge</p>
                  <p className="text-sm text-muted-foreground">
                    Places en rangée A ou F uniquement
                  </p>
                </div>
                <svg className="ml-auto size-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
              </label>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
              <CardDescription>
                Vérifiez votre réservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates:</span>
                  <span>{startDate && endDate ? `${startDate} - ${endDate}` : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Place:</span>
                  <span>{selectedSpot || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Borne:</span>
                  <span>{needsCharger ? "Oui" : "Non"}</span>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!selectedSpot || !startDate || !endDate}>
                Confirmer la réservation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Parking Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Sélectionner une place</CardTitle>
            <CardDescription>
              Cliquez sur une place disponible pour la sélectionner.
              Les rangées A et F disposent de bornes de recharge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ParkingGrid
              selectedSpot={selectedSpot}
              onSelectSpot={setSelectedSpot}
              needsCharger={needsCharger}
            />
          </CardContent>
        </Card>
      </form>
    </AppShell>
  );
}

import { useState } from "react";
import { AppShell } from "~/components/layouts";
import { ParkingGrid } from "~/components/parking/parking-grid";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";

export default function ParkingSpots() {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

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
    <AppShell role="secretary" title="Gestion des places" user={mockUser}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">30</div>
              <p className="text-sm text-muted-foreground">Places totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">18</div>
              <p className="text-sm text-muted-foreground">Disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">12</div>
              <p className="text-sm text-muted-foreground">Réservées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">10</div>
              <p className="text-sm text-muted-foreground">Avec chargeur</p>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="flex flex-wrap items-center gap-6 pt-6">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-green-100 border border-green-300" />
              <span className="text-sm">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-blue-100 border border-blue-300" />
              <span className="text-sm">Réservée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-orange-100 border border-orange-300" />
              <span className="text-sm">Occupée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-gray-100 border border-gray-300" />
              <span className="text-sm">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="size-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              <span className="text-sm">Borne de recharge</span>
            </div>
          </CardContent>
        </Card>

        {/* Parking Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Plan du parking</CardTitle>
            <CardDescription>
              Cliquez sur une place pour voir les détails ou la modifier.
              Les rangées A et F disposent de bornes de recharge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ParkingGrid
              selectedSpot={selectedSpot}
              onSelectSpot={setSelectedSpot}
              showStatus
            />
          </CardContent>
        </Card>

        {/* Selected Spot Details */}
        {selectedSpot && (
          <Card>
            <CardHeader>
              <CardTitle>Place {selectedSpot}</CardTitle>
              <CardDescription>
                Détails et actions pour cette place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="font-medium">Disponible</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Borne de recharge</p>
                  <p className="font-medium">
                    {selectedSpot.startsWith("A") || selectedSpot.startsWith("F") ? "Oui" : "Non"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Réservation actuelle</p>
                  <p className="font-medium">Aucune</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Mettre en maintenance
                </Button>
                <Button variant="outline" size="sm">
                  Voir l'historique
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

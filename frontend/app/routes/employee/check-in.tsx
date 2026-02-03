import { useState } from "react";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Input } from "~/ui/input";

export default function EmployeeCheckIn() {
  const [manualCode, setManualCode] = useState("");

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

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement manual check-in
    console.log("Manual check-in:", manualCode);
  };

  return (
    <AppShell role="employee" title="Check-in" user={mockUser}>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Active Reservation */}
        <Card>
          <CardHeader>
            <CardTitle>Réservation active</CardTitle>
            <CardDescription>
              Confirmez votre arrivée au parking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <p className="mt-4 text-muted-foreground">
                Aucune réservation à confirmer aujourd'hui
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
              </svg>
              Scanner le QR code
            </CardTitle>
            <CardDescription>
              Scannez le QR code affiché sur votre place de parking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-square max-w-xs mx-auto items-center justify-center rounded-xl border-2 border-dashed bg-muted/50">
              <div className="text-center">
                <svg className="mx-auto size-16 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <p className="mt-2 text-sm text-muted-foreground">
                  Caméra non disponible
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Activer la caméra
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Code Entry */}
        <Card>
          <CardHeader>
            <CardTitle>Code manuel</CardTitle>
            <CardDescription>
              Ou entrez le code de la place manuellement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualCheckIn} className="flex gap-2">
              <Input
                placeholder="Ex: A-12"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!manualCode}>
                Valider
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

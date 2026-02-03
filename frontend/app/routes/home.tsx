import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ParkRes - Système de réservation de parking" },
    { name: "description", content: "Réservez votre place de parking facilement" },
  ];
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-xl bg-primary">
            <svg className="size-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <CardTitle className="text-2xl">ParkRes</CardTitle>
          <CardDescription>
            Système de réservation de parking
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Réservez votre place de parking en quelques clics.
            Check-in facile via QR code.
          </p>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Accès rapide (dev):</p>
            <div className="mt-2 flex justify-center gap-2">
              <Button variant="outline" size="xs" asChild>
                <Link to="/employee">Employé</Link>
              </Button>
              <Button variant="outline" size="xs" asChild>
                <Link to="/secretary">Secrétaire</Link>
              </Button>
              <Button variant="outline" size="xs" asChild>
                <Link to="/manager">Manager</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

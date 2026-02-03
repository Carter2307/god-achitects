import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";

type CheckInStatus = "loading" | "success" | "error" | "not_found" | "already_checked_in" | "expired";

export default function CheckInPage() {
  const { code } = useParams();
  const [status, setStatus] = useState<CheckInStatus>("loading");

  useEffect(() => {
    // TODO: Implement actual check-in via API
    // Simulate API call
    const timer = setTimeout(() => {
      // For demo, show different statuses based on code
      if (code === "success") {
        setStatus("success");
      } else if (code === "expired") {
        setStatus("expired");
      } else if (code === "already") {
        setStatus("already_checked_in");
      } else {
        setStatus("not_found");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${
            status === "success" ? "bg-success/10" :
            status === "loading" ? "bg-muted" :
            "bg-destructive/10"
          }`}>
            {status === "loading" && (
              <svg className="size-8 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {status === "success" && (
              <svg className="size-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
            {(status === "error" || status === "not_found" || status === "expired") && (
              <svg className="size-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
            {status === "already_checked_in" && (
              <svg className="size-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            )}
          </div>

          <CardTitle className="text-2xl">
            {status === "loading" && "Vérification..."}
            {status === "success" && "Check-in réussi!"}
            {status === "error" && "Erreur"}
            {status === "not_found" && "Place non trouvée"}
            {status === "already_checked_in" && "Déjà enregistré"}
            {status === "expired" && "Réservation expirée"}
          </CardTitle>

          <CardDescription>
            {status === "loading" && "Validation de votre check-in en cours..."}
            {status === "success" && "Votre arrivée a été confirmée avec succès."}
            {status === "error" && "Une erreur est survenue. Veuillez réessayer."}
            {status === "not_found" && `Aucune réservation trouvée pour le code ${code}.`}
            {status === "already_checked_in" && "Vous êtes déjà enregistré pour cette réservation."}
            {status === "expired" && "Cette réservation a expiré ou n'est plus valide."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Place:</span>
                  <span className="font-medium">{code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heure:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/employee">Accéder à mon espace</Link>
            </Button>
            {(status === "error" || status === "not_found") && (
              <Button variant="outline" asChild>
                <Link to="/employee/check-in">Check-in manuel</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

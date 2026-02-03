import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";

interface ReservationSummaryProps {
  selectedDate: Date | null;
  selectedSpot: string | null;
  needsCharger: boolean;
  onConfirm: () => void;
  onEdit: (step: number) => void;
  isSubmitting?: boolean;
}

export function ReservationSummary({
  selectedDate,
  selectedSpot,
  needsCharger,
  onConfirm,
  onEdit,
  isSubmitting = false,
}: ReservationSummaryProps) {
  const formatDate = () => {
    if (!selectedDate) return "-";
    return selectedDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif de votre réservation</CardTitle>
          <CardDescription>
            Vérifiez les informations avant de confirmer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date */}
          <div className="flex items-start justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date de réservation</p>
              <p className="text-lg font-semibold">{formatDate()}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              Modifier
            </Button>
          </div>

          {/* Spot */}
          <div className="flex items-start justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Place de parking</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{selectedSpot || "-"}</p>
                {needsCharger && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>
                    Borne de recharge
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
              Modifier
            </Button>
          </div>

          {/* Important Info */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex gap-3">
              <svg className="size-5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <div className="space-y-1 text-sm">
                <p className="font-medium">Informations importantes</p>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Check-in obligatoire avant 10h00</li>
                  <li>En cas de non check-in, la place sera libérée</li>
                  <li>Annulation possible jusqu'à la veille à 18h00</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={onConfirm}
            disabled={isSubmitting || !selectedSpot || !selectedDate}
          >
            {isSubmitting ? (
              <>
                <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Confirmation en cours...
              </>
            ) : (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Confirmer la réservation
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

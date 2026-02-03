import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AppShell } from "~/components/layouts";
import { ParkingGrid } from "~/components/parking/parking-grid";
import {
  DateCalendar,
  ReservationStepper,
  ReservationSummary,
} from "~/components/reservation";
import { useToastContext } from "~/contexts/toast-context";
import { cn } from "~/lib/utils";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";

const STEPS = [
  { number: 1, title: "Dates", description: "Choisir les jours" },
  { number: 2, title: "Place", description: "Sélectionner l'emplacement" },
  { number: 3, title: "Confirmation", description: "Valider la réservation" },
];

export default function NewReservation() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [needsCharger, setNeedsCharger] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDate !== null;
      case 2:
        return selectedSpot !== null;
      case 3:
        return selectedDate !== null && selectedSpot !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    // TODO: Implement actual reservation creation
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success toast
    toast.success(
      "Réservation confirmée!",
      `Place ${selectedSpot} réservée pour le ${selectedDate?.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}.`
    );

    // Navigate to reservations page
    navigate("/employee/reservations");
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <AppShell
      role="employee"
      title="Nouvelle réservation"
      user={mockUser}
      actions={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/employee/reservations">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Annuler
          </Link>
        </Button>
      }
    >
      {/* Mobile Step Indicator */}
      <div className="mb-6 md:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Étape {currentStep} sur {STEPS.length}</span>
          <span className="text-muted-foreground">{STEPS[currentStep - 1].title}</span>
        </div>
        <div className="mt-2 flex gap-1">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                currentStep >= step.number ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-8 max-w-215 mx-auto">
        {/* Stepper - Left Side (Desktop) */}
        <div className="hidden md:block w-48 shrink-0">
          <ReservationStepper currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Step Content - Right Side */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
            <Card className={"shadow-none"}>
              <CardHeader className={'border-b'}>
                <CardTitle>Choisissez votre date de réservation</CardTitle>
                <CardDescription>
                  Sélectionnez un jour ouvrable. Les samedis et dimanches ne sont pas disponibles.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <DateCalendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />

                {/* Charger Option */}
                <div className="border-t pt-6">
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={needsCharger}
                      onChange={(e) => {
                        setNeedsCharger(e.target.checked);
                        // Reset spot selection if charger preference changes
                        setSelectedSpot(null);
                      }}
                      className="size-5 rounded border-border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">J'ai besoin d'une borne de recharge</p>
                      <p className="text-sm text-muted-foreground">
                        Places en rangée A ou F uniquement
                      </p>
                    </div>
                    <svg className="size-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Spot Selection */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Sélectionnez votre place de parking</CardTitle>
                <CardDescription>
                  {needsCharger
                    ? "Les places avec borne de recharge sont en rangée A et F."
                    : "Cliquez sur une place disponible pour la sélectionner."
                  }
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
          )}

          {/* Step 3: Summary & Confirmation */}
          {currentStep === 3 && (
            <ReservationSummary
              selectedDate={selectedDate}
              selectedSpot={selectedSpot}
              needsCharger={needsCharger}
              onConfirm={handleConfirm}
              onEdit={handleEditStep}
              isSubmitting={isSubmitting}
            />
          )}
          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="flex items-center justify-between border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Retour
              </Button>

              <div className="flex items-center gap-4">
                {currentStep === 1 && selectedDate && (
                  <p className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </p>
                )}
                {currentStep === 2 && selectedSpot && (
                  <p className="text-sm text-muted-foreground">
                    Place {selectedSpot} sélectionnée
                  </p>
                )}
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Continuer
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

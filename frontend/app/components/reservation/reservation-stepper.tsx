import { cn } from "~/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ReservationStepperProps {
  currentStep: number;
  steps: Step[];
}

export function ReservationStepper({ currentStep, steps }: ReservationStepperProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-start gap-4">
          {/* Step indicator and line */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                currentStep > step.number
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === step.number
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
              )}
            >
              {currentStep > step.number ? (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            {/* Vertical line connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-12 transition-colors",
                  currentStep > step.number ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>

          {/* Step content */}
          <div className="pt-2 pb-8">
            <p
              className={cn(
                "text-sm font-medium",
                currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

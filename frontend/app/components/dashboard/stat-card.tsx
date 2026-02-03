import { cn } from "~/lib/utils";
import { Card, CardContent } from "~/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p
              className={cn(
                "text-2xl font-bold",
                variant === "success" && "text-success",
                variant === "warning" && "text-warning",
                variant === "destructive" && "text-destructive"
              )}
            >
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                "rounded-lg p-2",
                variant === "default" && "bg-muted text-muted-foreground",
                variant === "success" && "bg-success/10 text-success",
                variant === "warning" && "bg-warning/10 text-warning",
                variant === "destructive" && "bg-destructive/10 text-destructive"
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

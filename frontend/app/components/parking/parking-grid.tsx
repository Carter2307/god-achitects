import { cn } from "~/lib/utils";
import type { SpotRow, SpotStatus } from "~/types";

interface ParkingSpot {
  id: string;
  row: SpotRow;
  number: number;
  hasCharger: boolean;
  status: SpotStatus;
}

interface ParkingGridProps {
  selectedSpot: string | null;
  onSelectSpot: (spotId: string | null) => void;
  needsCharger?: boolean;
  showStatus?: boolean;
  spots?: ParkingSpot[];
  isLoading?: boolean;
}

// Generate mock parking spots - all available by default
const generateSpots = (allAvailable = false): ParkingSpot[] => {
  const rows: SpotRow[] = ["A", "B", "C", "D", "E", "F"];
  const spotsPerRow = 5;
  const spots: ParkingSpot[] = [];

  rows.forEach((row) => {
    for (let i = 1; i <= spotsPerRow; i++) {
      spots.push({
        id: `${row}-${i}`,
        row,
        number: i,
        hasCharger: row === "A" || row === "F",
        status: allAvailable ? "available" : (Math.random() > 0.6 ? "available" : Math.random() > 0.5 ? "reserved" : "occupied"),
      });
    }
  });

  return spots;
};

const defaultSpots = generateSpots(true);

const statusColors: Record<SpotStatus, string> = {
  available: "bg-green-100 border-green-300 hover:bg-green-200",
  reserved: "bg-blue-100 border-blue-300",
  occupied: "bg-orange-100 border-orange-300",
  maintenance: "bg-gray-100 border-gray-300",
};

const statusColorsSelected: Record<SpotStatus, string> = {
  available: "bg-green-500 border-green-600 text-white",
  reserved: "bg-blue-500 border-blue-600 text-white",
  occupied: "bg-orange-500 border-orange-600 text-white",
  maintenance: "bg-gray-500 border-gray-600 text-white",
};

export function ParkingGrid({
  selectedSpot,
  onSelectSpot,
  needsCharger = false,
  showStatus = false,
  spots = defaultSpots,
  isLoading = false,
}: ParkingGridProps) {
  const rows: SpotRow[] = ["A", "B", "C", "D", "E", "F"];
  const parkingSpots = spots;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <svg className="size-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-muted-foreground">Chargement des places...</p>
        </div>
      </div>
    );
  }

  const handleSpotClick = (spot: ParkingSpot) => {
    if (showStatus) {
      // In admin mode, allow selecting any spot
      onSelectSpot(selectedSpot === spot.id ? null : spot.id);
    } else {
      // In reservation mode, only allow selecting available spots
      if (spot.status !== "available") return;
      if (needsCharger && !spot.hasCharger) return;
      onSelectSpot(selectedSpot === spot.id ? null : spot.id);
    }
  };

  const isSpotSelectable = (spot: ParkingSpot) => {
    if (showStatus) return true;
    if (spot.status !== "available") return false;
    if (needsCharger && !spot.hasCharger) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Parking Layout */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px] space-y-4">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-4">
              {/* Row Label */}
              <div className="flex w-8 items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground">{row}</span>
              </div>

              {/* Spots */}
              <div className="flex flex-1 gap-2">
                {parkingSpots
                  .filter((spot) => spot.row === row)
                  .map((spot) => {
                    const isSelected = selectedSpot === spot.id;
                    const isSelectable = isSpotSelectable(spot);

                    return (
                      <button
                        key={spot.id}
                        onClick={() => handleSpotClick(spot)}
                        disabled={!isSelectable && !showStatus}
                        className={cn(
                          "relative flex h-16 flex-1 flex-col items-center justify-center rounded-lg border-2 transition-all",
                          isSelected
                            ? statusColorsSelected[spot.status]
                            : statusColors[spot.status],
                          isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                          !showStatus && needsCharger && !spot.hasCharger && "opacity-30"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-white" : "text-foreground"
                        )}>
                          {spot.number}
                        </span>
                        {spot.hasCharger && (
                          <svg
                            className={cn(
                              "absolute bottom-1 right-1 size-3",
                              isSelected ? "text-white" : "text-warning"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Charger indicator for A and F rows */}
              {(row === "A" || row === "F") && (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      {!showStatus && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded bg-green-100 border border-green-300" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded bg-blue-100 border border-blue-300" />
            <span>Réservée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded bg-orange-100 border border-orange-300" />
            <span>Occupée</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="size-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
            <span>Borne de recharge</span>
          </div>
        </div>
      )}
    </div>
  );
}

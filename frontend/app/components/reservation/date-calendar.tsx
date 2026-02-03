import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/ui/button";

interface DateCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Add empty cells for days before the first day
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}

export function DateCalendar({
  selectedDate,
  onSelectDate,
}: DateCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = getMonthDays(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    if (isWeekend(date) || isPastDate(date)) return;

    if (selectedDate && isSameDay(selectedDate, date)) {
      // Deselect the date
      onSelectDate(null);
    } else {
      // Select the date
      onSelectDate(date);
    }
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDate !== null && isSameDay(selectedDate, date);
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </Button>
        <h3 className="text-lg font-semibold">
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Button>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day, index) => (
          <div
            key={day}
            className={cn(
              "py-2 text-center text-sm font-medium",
              index >= 5 ? "text-muted-foreground/50" : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-10" />;
          }

          const weekend = isWeekend(date);
          const past = isPastDate(date);
          const selected = isDateSelected(date);
          const disabled = weekend || past;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={cn(
                "flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : isToday
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent",
                disabled && "cursor-not-allowed opacity-30",
                weekend && "text-muted-foreground/50"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <span className="font-medium">
              {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelectDate(null)}
          >
            Effacer
          </Button>
        </div>
      )}

      {/* Weekend Note */}
      <p className="text-xs text-muted-foreground">
        Les samedis et dimanches ne sont pas disponibles pour la réservation.
      </p>
    </div>
  );
}

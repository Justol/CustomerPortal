import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<"div">;

export function Calendar({ className }: CalendarProps) {
  return (
    <div className={cn("p-3", className)}>
      <div className="space-y-4">
        {/* Simplified calendar implementation without react-day-picker */}
        <div className="grid grid-cols-7 gap-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
              )}
            >
              <span className="text-sm">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
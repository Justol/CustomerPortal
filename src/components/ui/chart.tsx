import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: number[];
}

export function Chart({ className, data = [], ...props }: ChartProps) {
  return (
    <div className={cn("w-full h-[200px]", className)} {...props}>
      {/* Simplified chart implementation */}
      <div className="flex items-end justify-between h-full w-full gap-2">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-primary/90 rounded-t w-full"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import { Attack } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Brush } from "recharts";

interface TimelineProps {
  attacks: Attack[];
  selectedRange: [string, string];
  onRangeChange: (from: string, to: string) => void;
}

export function Timeline({ attacks, selectedRange, onRangeChange }: TimelineProps) {
  const timelineData = useMemo(() => {
    const yearCounts = new Map<number, number>();
    
    attacks.forEach(attack => {
      const year = new Date(attack.date).getFullYear();
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    });

    const sortedYears = Array.from(yearCounts.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, count]) => ({
        year: year.toString(),
        count,
      }));

    if (sortedYears.length === 0) {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 5 }, (_, i) => ({
        year: (currentYear - 4 + i).toString(),
        count: 0,
      }));
    }

    return sortedYears;
  }, [attacks]);

  const maxCount = Math.max(...timelineData.map(d => d.count), 1);

  const selectedStartIndex = useMemo(() => {
    const fromYear = new Date(selectedRange[0]).getFullYear().toString();
    return timelineData.findIndex(d => d.year === fromYear);
  }, [selectedRange, timelineData]);

  const selectedEndIndex = useMemo(() => {
    const toYear = new Date(selectedRange[1]).getFullYear().toString();
    const index = timelineData.findIndex(d => d.year === toYear);
    return index >= 0 ? index : timelineData.length - 1;
  }, [selectedRange, timelineData]);

  const handleBrushChange = (e: any) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      const startYear = timelineData[e.startIndex]?.year;
      const endYear = timelineData[e.endIndex]?.year;
      
      if (startYear && endYear) {
        onRangeChange(`${startYear}-01-01`, `${endYear}-12-31`);
      }
    }
  };

  const handleBarClick = (data: any, index: number) => {
    if (data && data.year) {
      onRangeChange(`${data.year}-01-01`, `${data.year}-12-31`);
    }
  };

  return (
    <div className="w-full" data-testid="timeline-container">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Attack Frequency Timeline
        </h3>
        <div className="text-xs text-muted-foreground">
          Total: {attacks.length} attacks | Click or drag to filter by year
        </div>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={timelineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
            cursor={{ fill: "hsl(var(--accent))" }}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            onClick={handleBarClick}
            cursor="pointer"
          >
            {timelineData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(0 ${72 - (entry.count / maxCount) * 20}% ${35 + (entry.count / maxCount) * 10}%)`}
              />
            ))}
          </Bar>
          {timelineData.length > 0 && (
            <Brush
              dataKey="year"
              height={20}
              stroke="hsl(var(--primary))"
              fill="hsl(var(--muted))"
              startIndex={selectedStartIndex >= 0 ? selectedStartIndex : 0}
              endIndex={selectedEndIndex >= 0 ? selectedEndIndex : timelineData.length - 1}
              onChange={handleBrushChange}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, MapPin, Skull, AlertTriangle } from "lucide-react";

interface StatsData {
  totalAttacks: number;
  totalKilled: number;
  totalWounded: number;
  topRegion: string;
  topCountry: string;
  topAttackType: string;
}

interface StatsPanelProps {
  stats?: StatsData;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-16 bg-muted rounded-md animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="stats-panel">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Attacks</div>
              <div className="text-2xl font-mono font-medium" data-testid="stat-total-attacks">
                {stats.totalAttacks.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-md">
              <Skull className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Killed</div>
              <div className="text-2xl font-mono font-medium" data-testid="stat-total-killed">
                {stats.totalKilled.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Wounded</div>
              <div className="text-2xl font-mono font-medium" data-testid="stat-total-wounded">
                {stats.totalWounded.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Most Affected</div>
              <div className="text-sm font-medium truncate" data-testid="stat-top-region">
                {stats.topCountry}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Attack } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Skull, User } from "lucide-react";

interface AttackCardProps {
  attack: Attack;
  onClick: () => void;
}

const getSeverityVariant = (severity: string): "default" | "secondary" | "destructive" => {
  switch (severity.toLowerCase()) {
    case "critical":
    case "high":
      return "destructive";
    case "medium":
      return "default";
    default:
      return "secondary";
  }
};

export function AttackCard({ attack, onClick }: AttackCardProps) {
  const totalCasualties = attack.killed + attack.wounded;

  return (
    <Card
      className="cursor-pointer transition-shadow hover-elevate active-elevate-2 border-l-4"
      style={{
        borderLeftColor: getSeverityVariant(attack.severity) === "destructive" 
          ? "hsl(var(--destructive))"
          : getSeverityVariant(attack.severity) === "default"
          ? "hsl(var(--primary))"
          : "hsl(var(--muted))",
      }}
      onClick={onClick}
      data-testid={`card-attack-${attack.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base leading-tight mb-1 truncate" data-testid={`text-location-${attack.id}`}>
              {attack.city}, {attack.country}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span data-testid={`text-date-${attack.id}`}>{attack.date}</span>
            </div>
          </div>
          <Badge
            variant={getSeverityVariant(attack.severity)}
            className="shrink-0"
            data-testid={`badge-severity-${attack.id}`}
          >
            {attack.severity}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Region:</span>
          <span className="font-medium" data-testid={`text-region-${attack.id}`}>{attack.region}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Type:</span>
          </div>
          <span className="font-medium" data-testid={`text-type-${attack.id}`}>{attack.attackType}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-md p-2">
            <Skull className="h-4 w-4 text-destructive" />
            <div>
              <div className="text-xs text-muted-foreground">Killed</div>
              <div className="font-mono font-medium" data-testid={`text-killed-${attack.id}`}>
                {attack.killed}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-md p-2">
            <User className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Wounded</div>
              <div className="font-mono font-medium" data-testid={`text-wounded-${attack.id}`}>
                {attack.wounded}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${attack.id}`}>
          {attack.description}
        </p>

        <div className="pt-2 text-xs text-primary hover:underline">
          View full details →
        </div>
      </CardContent>
    </Card>
  );
}

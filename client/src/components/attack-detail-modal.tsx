import { Attack } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Skull, User, Target } from "lucide-react";

interface AttackDetailModalProps {
  attack: Attack;
  onClose: () => void;
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

export function AttackDetailModal({ attack, onClose }: AttackDetailModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-attack-detail">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-medium" data-testid="modal-title">
              {attack.city}, {attack.country}
            </DialogTitle>
            <Badge variant={getSeverityVariant(attack.severity)} data-testid="modal-severity-badge">
              {attack.severity}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-medium" data-testid="modal-date">{attack.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Region</div>
                <div className="font-medium" data-testid="modal-region">{attack.region}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Attack Type</div>
                <div className="font-medium" data-testid="modal-attack-type">{attack.attackType}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Coordinates</div>
                <div className="font-mono text-sm" data-testid="modal-coordinates">
                  {attack.latitude.toFixed(4)}, {attack.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Casualties</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-muted/50 rounded-md p-4">
                <div className="p-3 bg-destructive/10 rounded-md">
                  <Skull className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Killed</div>
                  <div className="text-3xl font-mono font-medium" data-testid="modal-killed">
                    {attack.killed}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-muted/50 rounded-md p-4">
                <div className="p-3 bg-primary/10 rounded-md">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Wounded</div>
                  <div className="text-3xl font-mono font-medium" data-testid="modal-wounded">
                    {attack.wounded}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="modal-description">
              {attack.description}
            </p>
          </div>

          <div className="h-64 bg-muted rounded-md overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${attack.longitude-0.01},${attack.latitude-0.01},${attack.longitude+0.01},${attack.latitude+0.01}&layer=mapnik&marker=${attack.latitude},${attack.longitude}`}
              title="Attack Location Map"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

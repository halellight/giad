import { Attack } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, Skull, User, Target, X } from "lucide-react";

interface AttackDetailPanelProps {
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

export function AttackDetailPanel({ attack, onClose }: AttackDetailPanelProps) {
    return (
        <div className="absolute bottom-4 right-4 w-96 max-h-[calc(100vh-8rem)] bg-background border rounded-lg shadow-xl z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-right-10 fade-in duration-200">
            <div className="p-4 border-b flex items-start justify-between bg-muted/30">
                <div>
                    <h2 className="text-lg font-semibold leading-tight mb-1">
                        {attack.city}, {attack.country}
                    </h2>
                    <Badge variant={getSeverityVariant(attack.severity)} className="mt-1">
                        {attack.severity}
                    </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-xs text-muted-foreground">Date</div>
                                <div className="font-medium">{attack.date}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-xs text-muted-foreground">Type</div>
                                <div className="font-medium truncate" title={attack.attackType}>{attack.attackType}</div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xs font-medium uppercase text-muted-foreground mb-3">Casualties</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/50 rounded-md p-3 flex items-center gap-3">
                                <div className="p-2 bg-destructive/10 rounded-full">
                                    <Skull className="h-4 w-4 text-destructive" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Killed</div>
                                    <div className="text-xl font-mono font-bold">{attack.killed}</div>
                                </div>
                            </div>

                            <div className="bg-muted/50 rounded-md p-3 flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Wounded</div>
                                    <div className="text-xl font-mono font-bold">{attack.wounded}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xs font-medium uppercase text-muted-foreground mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {attack.description}
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

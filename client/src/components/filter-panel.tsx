import { useMemo } from "react";
import { Attack } from "@shared/schema";
import { FilterState } from "@/pages/home";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  attacks: Attack[];
}

export function FilterPanel({ filters, onFilterChange, attacks }: FilterPanelProps) {
  const availableCountries = useMemo(() => {
    const countries = new Set(attacks.map(a => a.country));
    return Array.from(countries).sort();
  }, [attacks]);

  const availableAttackTypes = useMemo(() => {
    const types = new Set(attacks.map(a => a.attackType));
    return Array.from(types).sort();
  }, [attacks]);

  const availableSeverities = ["Low", "Medium", "High", "Critical"];

  const handleReset = () => {
    onFilterChange({
      dateFrom: "2000-01-01",
      dateTo: new Date().toISOString().split('T')[0],
      countries: [],
      attackTypes: [],
      severities: [],
      casualtyMin: 0,
      casualtyMax: 1000,
      searchQuery: "",
    });
  };

  const activeFiltersCount = 
    filters.countries.length + 
    filters.attackTypes.length + 
    filters.severities.length;

  return (
    <div className="flex h-full flex-col" data-testid="filter-panel">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">Filters</h2>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              data-testid="button-reset-filters"
            >
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="date-from" className="text-xs text-muted-foreground">
                  From
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
                  data-testid="input-date-from"
                />
              </div>
              <div>
                <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                  To
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => onFilterChange({ dateTo: e.target.value })}
                  data-testid="input-date-to"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Countries ({filters.countries.length} selected)
            </Label>
            <div className="space-y-2">
              {availableCountries.slice(0, 10).map(country => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={filters.countries.includes(country)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange({
                          countries: [...filters.countries, country],
                        });
                      } else {
                        onFilterChange({
                          countries: filters.countries.filter(c => c !== country),
                        });
                      }
                    }}
                    data-testid={`checkbox-country-${country.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`country-${country}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {country}
                  </Label>
                </div>
              ))}
              {availableCountries.length > 10 && (
                <p className="text-xs text-muted-foreground">
                  +{availableCountries.length - 10} more countries
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Attack Type ({filters.attackTypes.length} selected)
            </Label>
            <div className="space-y-2">
              {availableAttackTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.attackTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange({
                          attackTypes: [...filters.attackTypes, type],
                        });
                      } else {
                        onFilterChange({
                          attackTypes: filters.attackTypes.filter(t => t !== type),
                        });
                      }
                    }}
                    data-testid={`checkbox-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Severity ({filters.severities.length} selected)
            </Label>
            <div className="space-y-2">
              {availableSeverities.map(severity => (
                <div key={severity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`severity-${severity}`}
                    checked={filters.severities.includes(severity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFilterChange({
                          severities: [...filters.severities, severity],
                        });
                      } else {
                        onFilterChange({
                          severities: filters.severities.filter(s => s !== severity),
                        });
                      }
                    }}
                    data-testid={`checkbox-severity-${severity.toLowerCase()}`}
                  />
                  <Label
                    htmlFor={`severity-${severity}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {severity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

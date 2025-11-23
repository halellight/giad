import { FilterState } from "@/pages/home";
import { Attack } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { X, Check } from "lucide-react";
import { useMemo } from "react";

interface AppSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onApplyFilters: (filtersToApply?: FilterState) => void;
  attacks: Attack[];
}

export function AppSidebar({ filters, onFilterChange, onApplyFilters, attacks }: AppSidebarProps) {
  const availableCountries = useMemo(() => {
    const countries = new Set(attacks.map(a => a.country));
    return Array.from(countries).sort();
  }, [attacks]);

  const availableRegions = useMemo(() => {
    const regions = new Set(attacks.map(a => a.region));
    return Array.from(regions).sort();
  }, [attacks]);

  const availableAttackTypes = useMemo(() => {
    const types = new Set(attacks.map(a => a.attackType));
    return Array.from(types).sort();
  }, [attacks]);

  const availableSeverities = ["Low", "Medium", "High", "Critical"];

  const handleReset = () => {
    const defaultFilters: FilterState = {
      dateFrom: "2000-01-01",
      dateTo: new Date().toISOString().split('T')[0],
      countries: [],
      regions: [],
      attackTypes: [],
      severities: [],
      casualtyMin: 0,
      casualtyMax: 3000,
      searchQuery: "",
    };
    onApplyFilters(defaultFilters);
  };

  const activeFiltersCount = 
    filters.countries.length + 
    filters.regions.length +
    filters.attackTypes.length + 
    filters.severities.length;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Filters</h2>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              data-testid="button-reset-filters"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-4 space-y-6">
          <SidebarGroup>
            <SidebarGroupLabel>Date Range</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
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
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          <SidebarGroup>
            <SidebarGroupLabel>
              Casualty Range ({filters.casualtyMin} - {filters.casualtyMax})
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2 pt-2">
              <Slider
                min={0}
                max={3000}
                step={10}
                value={[filters.casualtyMin, filters.casualtyMax]}
                onValueChange={([min, max]) => onFilterChange({ casualtyMin: min, casualtyMax: max })}
                data-testid="slider-casualties"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>3000</span>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          <SidebarGroup>
            <SidebarGroupLabel>
              Regions ({filters.regions?.length || 0} selected)
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {availableRegions.map(region => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={filters.regions?.includes(region)}
                    onCheckedChange={(checked) => {
                      const regions = filters.regions || [];
                      if (checked) {
                        onFilterChange({
                          regions: [...regions, region],
                        });
                      } else {
                        onFilterChange({
                          regions: regions.filter(r => r !== region),
                        });
                      }
                    }}
                    data-testid={`checkbox-region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label
                    htmlFor={`region-${region}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {region}
                  </Label>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          <SidebarGroup>
            <SidebarGroupLabel>
              Countries ({filters.countries.length} selected)
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
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
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          <SidebarGroup>
            <SidebarGroupLabel>
              Attack Type ({filters.attackTypes.length} selected)
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
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
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          <SidebarGroup>
            <SidebarGroupLabel>
              Severity ({filters.severities.length} selected)
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
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
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="pt-4 space-y-2">
            <Button
              onClick={() => onApplyFilters()}
              className="w-full"
              data-testid="button-apply-filters"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full"
              data-testid="button-reset-all-filters"
            >
              <X className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

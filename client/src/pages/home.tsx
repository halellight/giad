import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Attack } from "@shared/schema";
import { MapView } from "@/components/map-view";
import { Timeline } from "@/components/timeline";
import { AttackCard } from "@/components/attack-card";
import { StatsPanel } from "@/components/stats-panel";
import type { StatsData } from "@/components/stats-panel";
import { AttackDetailPanel } from "@/components/attack-detail-panel";
import { SearchBar } from "@/components/search-bar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map as MapIcon, BarChart3, Grid3x3 } from "lucide-react";

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  countries: string[];
  regions: string[];
  attackTypes: string[];
  severities: string[];
  casualtyMin: number;
  casualtyMax: number;
  searchQuery: string;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "2000-01-01",
    dateTo: new Date().toISOString().split('T')[0],
    countries: [],
    regions: [],
    attackTypes: [],
    severities: [],
    casualtyMin: 0,
    casualtyMax: 3000,
    searchQuery: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [view, setView] = useState<"map" | "grid">("map");

  // Client-side filtering logic
  const { data: allAttacks = [], isLoading } = useQuery<Attack[]>({
    queryKey: ["/attacks.json"],
    queryFn: async () => {
      const res = await fetch("/attacks.json");
      if (!res.ok) throw new Error("Failed to load attacks data");
      return res.json();
    }
  });

  const attacks = useMemo(() => {
    if (!Array.isArray(allAttacks)) return [];
    let filtered = [...allAttacks];
    const f = appliedFilters;

    if (f.dateFrom) filtered = filtered.filter(a => a.date >= f.dateFrom);
    if (f.dateTo) filtered = filtered.filter(a => a.date <= f.dateTo);

    if (f.countries.length > 0) filtered = filtered.filter(a => f.countries.includes(a.country));
    if (f.regions.length > 0) filtered = filtered.filter(a => f.regions.includes(a.region));
    if (f.attackTypes.length > 0) filtered = filtered.filter(a => f.attackTypes.includes(a.attackType));
    if (f.severities.length > 0) filtered = filtered.filter(a => f.severities.includes(a.severity));

    if (f.casualtyMin > 0) filtered = filtered.filter(a => (a.killed + a.wounded) >= f.casualtyMin);
    if (f.casualtyMax < 3000) filtered = filtered.filter(a => (a.killed + a.wounded) <= f.casualtyMax);

    if (f.searchQuery) {
      const q = f.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.attackType.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [allAttacks, appliedFilters]);

  const stats = useMemo(() => {
    if (!Array.isArray(allAttacks) || !allAttacks.length) return undefined;

    const totalKilled = allAttacks.reduce((sum, a) => sum + a.killed, 0);
    const totalWounded = allAttacks.reduce((sum, a) => sum + a.wounded, 0);

    const regionCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();

    allAttacks.forEach(attack => {
      regionCounts.set(attack.region, (regionCounts.get(attack.region) || 0) + 1);
      countryCounts.set(attack.country, (countryCounts.get(attack.country) || 0) + 1);
      typeCounts.set(attack.attackType, (typeCounts.get(attack.attackType) || 0) + 1);
    });

    const topRegion = Array.from(regionCounts.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";
    const topCountry = Array.from(countryCounts.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";
    const topAttackType = Array.from(typeCounts.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    return {
      totalAttacks: allAttacks.length,
      totalKilled,
      totalWounded,
      topRegion,
      topCountry,
      topAttackType,
    };
  }, [allAttacks]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = (filtersToApply?: FilterState) => {
    if (filtersToApply) {
      setFilters(filtersToApply);
      setAppliedFilters(filtersToApply);
    } else {
      setAppliedFilters(filters);
    }
  };

  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const handleTimelineRangeChange = (from: string, to: string) => {
    setFilters(prev => ({ ...prev, dateFrom: from, dateTo: to }));
  };

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          attacks={attacks}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-50 border-b bg-background px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center gap-2">
                  <MapIcon className="h-6 w-6 text-primary" data-testid="icon-logo" />
                  <h1 className="text-xl font-medium" data-testid="text-app-title">
                    Global Attacks Database
                  </h1>
                </div>
              </div>

              <div className="flex flex-1 max-w-md">
                <SearchBar
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search attacks by location, type, or description..."
                />
              </div>

              <div className="flex items-center gap-2">
                <Tabs value={view} onValueChange={(v) => setView(v as "map" | "grid")}>
                  <TabsList data-testid="tabs-view-switcher">
                    <TabsTrigger value="map" data-testid="tab-map-view">
                      <MapIcon className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="grid" data-testid="tab-grid-view">
                      <Grid3x3 className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden">
            {view === "map" ? (
              <>
                <div className="relative h-[65vh] md:h-[60vh]" data-testid="container-map">
                  <MapView
                    attacks={attacks}
                    onAttackClick={setSelectedAttack}
                    onMapClick={() => setSelectedAttack(null)}
                    isLoading={isLoading}
                    isDetailOpen={!!selectedAttack}
                  />
                </div>

                {selectedAttack && (
                  <AttackDetailPanel
                    attack={selectedAttack}
                    onClose={() => setSelectedAttack(null)}
                  />
                )}

                <div className="border-t p-4 bg-card" data-testid="container-timeline">
                  <Timeline
                    attacks={attacks}
                    selectedRange={[appliedFilters.dateFrom, appliedFilters.dateTo]}
                    onRangeChange={handleTimelineRangeChange}
                  />
                </div>

                <div className="flex-1 overflow-y-auto border-t p-4">
                  <div className="mx-auto max-w-7xl">
                    <div className="mb-4">
                      <StatsPanel stats={stats} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-48 bg-muted rounded-md animate-pulse"
                            data-testid={`skeleton-attack-card-${i}`}
                          />
                        ))
                      ) : attacks.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-medium text-foreground" data-testid="text-no-results">
                            No attacks found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search query
                          </p>
                        </div>
                      ) : (
                        attacks.map(attack => (
                          <AttackCard
                            key={attack.id}
                            attack={attack}
                            onClick={() => setSelectedAttack(attack)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto max-w-7xl">
                  <div className="mb-4">
                    <StatsPanel stats={stats} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                      Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-48 bg-muted rounded-md animate-pulse"
                          data-testid={`skeleton-attack-card-${i}`}
                        />
                      ))
                    ) : attacks.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground" data-testid="text-no-results">
                          No attacks found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters or search query
                        </p>
                      </div>
                    ) : (
                      attacks.map(attack => (
                        <AttackCard
                          key={attack.id}
                          attack={attack}
                          onClick={() => setSelectedAttack(attack)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

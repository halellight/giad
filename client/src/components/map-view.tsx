import { useEffect, useRef } from "react";
import L from "leaflet";
// @ts-ignore
window.L = L;
import "leaflet.markercluster";
import { Attack } from "@shared/schema";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

interface MapViewProps {
  attacks: Attack[];
  onAttackClick: (attack: Attack) => void;
  onMapClick?: () => void;
  isLoading: boolean;
  isDetailOpen: boolean;
}

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "#991b1b";
    case "high":
      return "#dc2626";
    case "medium":
      return "#ea580c";
    case "low":
      return "#d97706";
    default:
      return "#6b7280";
  }
};

const createCustomIcon = (severity: string) => {
  const color = getSeverityColor(severity);
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

export function MapView({ attacks, onAttackClick, onMapClick, isLoading, isDetailOpen }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapRef.current);

      markerClusterGroupRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 80,
      });

      mapRef.current.addLayer(markerClusterGroupRef.current);

      mapRef.current.on("click", () => {
        onMapClick?.();
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerClusterGroupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerClusterGroupRef.current) return;

    markerClusterGroupRef.current.clearLayers();

    attacks.forEach(attack => {
      const marker = L.marker([attack.latitude, attack.longitude], {
        icon: createCustomIcon(attack.severity),
      });

      if (!isDetailOpen) {
        marker.bindTooltip(`
          <div style="font-family: Roboto, sans-serif; min-width: 200px;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px;">${attack.city}, ${attack.country}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${attack.date}</div>
            <div style="font-size: 12px; margin-bottom: 4px;">Type: ${attack.attackType}</div>
            <div style="font-size: 12px; margin-bottom: 4px;">Casualties: ${attack.killed + attack.wounded}</div>
          </div>
        `, {
          direction: "top",
          offset: [0, -10],
          opacity: 1,
        });
      }

      marker.on("click", () => {
        onAttackClick(attack);
      });

      markerClusterGroupRef.current?.addLayer(marker);
    });

    if (attacks.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(
        attacks.map(a => [a.latitude, a.longitude] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [attacks, onAttackClick, isDetailOpen]);

  return (
    <div className="relative h-full w-full" data-testid="map-container">
      <div ref={mapContainerRef} className="h-full w-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="bg-card border rounded-md p-4 shadow-lg">
            <div className="text-sm font-medium" data-testid="text-loading">
              Loading map data...
            </div>
          </div>
        </div>
      )}

      {!isLoading && attacks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-card border rounded-md p-6 shadow-lg">
            <p className="text-sm text-muted-foreground">
              No attacks to display on map
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

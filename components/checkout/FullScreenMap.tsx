"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface ItineraryItem {
  id: string;
  title: string;
  type: "start" | "stop" | "end";
  duration?: string;
  distance?: string;
  time?: string;
  description: string;
  image?: string;
  location?: string;
  locationLink?: string;
  attractions?: number;
  ticketsIncluded?: boolean;
  highlights?: string[];
  thingsToDo?: Array<{
    title: string;
    category: string;
    icon?: string;
  }>;
  nearbyThings?: Array<{
    title: string;
    image: string;
  }>;
}

interface FullScreenMapProps {
  isOpen: boolean;
  onClose: () => void;
  itineraryData: ItineraryItem[];
  tripTitle: string;
}

const FullScreenMap: React.FC<FullScreenMapProps> = ({
  isOpen,
  onClose,
  itineraryData,
  tripTitle,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Leaflet map
  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    console.log("Initializing full-screen map...");

    // Clean up existing map if it exists
    if (mapRef.current) {
      console.log("Cleaning up existing map...");
      if ((mapRef.current as any).routingControl) {
        try {
          (mapRef.current as any).routingControl.remove();
        } catch (error) {
          console.log("Error removing routing control:", error);
        }
      }
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Clear any existing content in the container
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = "";
    }

    // Wait a bit to ensure cleanup is complete
    setTimeout(() => {
      try {
        if (!mapContainerRef.current) {
          console.error("Map container not found after cleanup");
          setMapError(true);
          setMapLoaded(false);
          return;
        }

        // Fix default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Create map - centered to show Italy region like in the second image
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          center: [41.5, 13.0], // Centered to show central/southern Italy
          zoom: 7, // Zoom level to show the region like in the second image
          attributionControl: true,
        });

        console.log("Map created successfully");

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        console.log("Tiles added to map");

        // Add markers and route for itinerary locations
        const locationCoordinates: { [key: string]: [number, number] } = {
          "Central Rome": [41.9022, 12.4823],
          "Cassino, Italy": [41.4928, 13.83],
          "Pompeii, Italy": [40.7489, 14.5038],
          "Sorrento, Italy": [40.6263, 14.3754],
          "Positano, Italy": [40.6281, 14.4844],
          "Amalfi, Italy": [40.634, 14.6027],
          "Naples, Italy": [40.8518, 14.2681],
        };

        // Collect coordinates for route line
        const routeCoordinates: [number, number][] = [];
        const markers: L.Marker[] = [];
        let stopCounter = 1;

        itineraryData.forEach((item, index) => {
          if (item.location && locationCoordinates[item.location]) {
            const coords = locationCoordinates[item.location];

            // Add to route coordinates only if it's not the end point
            if (item.type !== "end") {
              routeCoordinates.push(coords);
            }

            // Create custom markers based on type
            let marker: L.Marker;

            if (item.type === "start") {
              // Start marker - arrow icon
              const startIcon = L.divIcon({
                className: "custom-start-marker",
                html: `
                <div style="
                  width: 30px; 
                  height: 30px; 
                  background: #8B5CF6; 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  border: 3px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              `,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              });
              marker = L.marker(coords, { icon: startIcon });
            } else if (item.type === "end") {
              // End marker - different style
              const endIcon = L.divIcon({
                className: "custom-end-marker",
                html: `
                <div style="
                  width: 28px; 
                  height: 28px; 
                  background: white; 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  border: 4px solid #8B5CF6;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              `,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              });
              marker = L.marker(coords, { icon: endIcon });
            } else {
              // Numbered markers for stops
              const stopIcon = L.divIcon({
                className: "custom-stop-marker",
                html: `
                <div style="
                  width: 32px; 
                  height: 32px; 
                  background: white; 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  border: 4px solid #8B5CF6;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  font-weight: bold;
                  color: #8B5CF6;
                  font-size: 14px;
                ">
                  ${stopCounter}
                </div>
              `,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              });
              marker = L.marker(coords, { icon: stopIcon });
              stopCounter++;
            }

            marker.addTo(map);
            markers.push(marker);

            marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${item.title}</h3>
              <p class="text-xs text-gray-600">${item.description || ""}</p>
            </div>
          `);
          }
        });

        // Add realistic driving route
        if (routeCoordinates.length > 1) {
          try {
            const plan = L.Routing.plan(
              routeCoordinates.map((coord) => L.latLng(coord[0], coord[1])),
              {
                createMarker: function () {
                  return false;
                },
                routeWhileDragging: false,
                addWaypoints: false,
              }
            );

            const routingControl = L.Routing.control({
              plan: plan,
              lineOptions: {
                styles: [
                  {
                    color: "#8B5CF6",
                    weight: 4,
                    opacity: 0.8,
                  },
                ],
                extendToWaypoints: false,
                missingRouteTolerance: 0,
              },
              show: false,
              collapsible: false,
              addWaypoints: false,
            }).addTo(map);

            (map as any).routingControl = routingControl;
            routingControl.hide();

            setTimeout(() => {
              const routingContainer = document.querySelector(
                ".leaflet-routing-container"
              );
              if (routingContainer) {
                routingContainer.remove();
              }
            }, 100);
          } catch (error) {
            console.log(
              "Routing machine not available, using straight line fallback"
            );
            const routeLine = L.polyline(routeCoordinates, {
              color: "#8B5CF6",
              weight: 4,
              opacity: 0.8,
              smoothFactor: 1,
            }).addTo(map);
          }
        }

        // Fit map to show all markers
        if (markers.length > 0) {
          const group = new L.FeatureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        mapRef.current = map;
        setMapLoaded(true);
        setMapError(false);

        console.log("Full-screen map initialization complete");

        // Invalidate size after a short delay
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
            console.log("Map invalidateSize called");
          }
        }, 100);
      } catch (error) {
        console.error("Map initialization failed:", error);
        setMapError(true);
        setMapLoaded(false);
      }
    }, 100);
  };

  // Initialize map when component opens
  useEffect(() => {
    if (isOpen && mapContainerRef.current) {
      setMapLoaded(false);
      setMapError(false);
      initializeMap();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle recenter button
  const handleRecenter = () => {
    if (mapRef.current) {
      const allMarkers: L.Marker[] = [];
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          allMarkers.push(layer);
        }
      });

      if (allMarkers.length > 0) {
        const group = new L.FeatureGroup(allMarkers);
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Drawer Content - Slides up from bottom */}
      <div className="absolute bottom-0 left-0 top-0 right-0 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col">
        {/* Header Bar */}
        <div className="flex border-b border-[#E2E2E2] pb-4 items-center justify-between p-6">
          <h3 className="text-lg font-semibold text-[#444444] !font-halyard-text">
            {tripTitle}
          </h3>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div 
          ref={mapContainerRef} 
          className="w-full relative flex-1"
          style={{ height: 'calc(100vh - 120px)', minHeight: 'calc(100vh - 120px)' }}
        />

        {/* Recenter Button - Positioned over map */}
        <button
          onClick={handleRecenter}
          className="absolute top-24 right-4 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 border-2 border-gray-300"
          title="Recenter map"
          style={{zIndex: 9999}}
        >
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </button>

        {/* Error state */}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm" style={{ marginTop: '120px' }}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p>Map unavailable</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenMap;

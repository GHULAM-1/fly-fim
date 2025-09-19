"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Clock,
  Plus,
  Minus,
  Bus,
  List,
  Map,
  MoveRight,
  ArrowRight,
  CheckCircle,
  Building,
  ChevronRight,
  X,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import FullScreenMap from "./FullScreenMap";
import { ExperienceResponse } from "@/types/experience/experience-types";

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
  lat?: number;        // Add latitude from API
  lng?: number;        // Add longitude from API
  locationLink?: string;
  attractions?: number;
  ticketsIncluded?: boolean;
  highlights?: string[];
  order?: number;      // Add order from API
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

interface ItineraryData {
  id: string;
  title: string;
  totalDuration: string;
  modeOfTransfer: string;
  items: ItineraryItem[];
}

interface ItinerarySectionProps {
  experience?: ExperienceResponse | null;
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({ experience }) => {
  // Transform new Itinerary structure to existing component format
  const transformItineraryData = (): ItineraryData[] => {
    if (!experience?.data?.itinerary) {
      return []; // Return empty array if no itinerary data
    }

    const itinerary = experience.data.itinerary;
    const transformedData: ItineraryData = {
      id: "api-itinerary",
      title: itinerary.title,
      totalDuration: itinerary.totalDuration || "Duration not specified",
      modeOfTransfer: itinerary.modeOfTransport || "Transport not specified",
      items: []
    };

    // Add start point
    transformedData.items.push({
      id: "start",
      title: itinerary.startPoint.name,
      type: "start",
      duration: itinerary.startPoint.duration,
      description: itinerary.startPoint.description || "",
      image: itinerary.startPoint.image,
      location: itinerary.startPoint.location.address,
      lat: itinerary.startPoint.location.lat,
      lng: itinerary.startPoint.location.lng,
      locationLink: `https://maps.google.com/?q=${itinerary.startPoint.location.lat},${itinerary.startPoint.location.lng}`,
      highlights: itinerary.startPoint.highlights,
      thingsToDo: itinerary.startPoint.thingsToDo?.map(item => ({ title: item, category: "Activity" })),
      nearbyThings: itinerary.startPoint.nearbyThingsToDo?.map(item => ({
        title: item.name,
        image: item.image || "/mob-banner.jpg"
      })),
    });

    // Add intermediate points
    itinerary.points.forEach((point, index) => {
      transformedData.items.push({
        id: `point-${index}`,
        title: point.name,
        type: "stop",
        duration: point.duration,
        distance: point.distance,
        time: point.travelTime,
        description: point.description || "",
        image: point.image || "/mob-banner.jpg", // Add image with fallback
        location: point.location.address,
        lat: point.location.lat,
        lng: point.location.lng,
        locationLink: `https://maps.google.com/?q=${point.location.lat},${point.location.lng}`,
        attractions: point.attractions,
        ticketsIncluded: point.ticketsIncluded,
        highlights: point.highlights,
        order: point.order, // Add order from API
        thingsToDo: point.thingsToDo?.map(item => ({ title: item, category: "Activity" })),
        nearbyThings: point.nearbyThingsToDo?.map(item => ({
          title: item.name,
          image: item.image || "/mob-banner.jpg"
        })),
      });
    });

    // Add end point
    transformedData.items.push({
      id: "end",
      title: itinerary.endPoint.name,
      type: "end",
      description: itinerary.endPoint.description || "",
      location: itinerary.endPoint.location.address,
      lat: itinerary.endPoint.location.lat,
      lng: itinerary.endPoint.location.lng,
      locationLink: `https://maps.google.com/?q=${itinerary.endPoint.location.lat},${itinerary.endPoint.location.lng}`,
    });

    return [transformedData];
  };

  // Initialize activeTab based on available data
  const [activeTab, setActiveTab] = useState(() => {
    if (experience?.data?.itinerary) {
      return "api-itinerary";
    }
    return ""; // no fallback
  });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedHighlights, setExpandedHighlights] = useState<Set<string>>(
    new Set()
  );
  const [expandedThingsToDo, setExpandedThingsToDo] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<"timeline" | "map">("timeline");
  const [showSidebar, setShowSidebar] = useState(false);
  const [barPosition, setBarPosition] = useState({ left: 0, width: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapInitializing, setMapInitializing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showMapDrawer, setShowMapDrawer] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const drawerMapRef = useRef<L.Map | null>(null);
  const drawerMapContainerRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Initialize drawer map
  const initializeDrawerMap = () => {
    if (!drawerMapContainerRef.current) return;

    // Clean up existing map
    if (drawerMapRef.current) {
      drawerMapRef.current.remove();
      drawerMapRef.current = null;
    }

    const map = L.map(drawerMapContainerRef.current, {
      center: [41.9028, 12.4964], // Rome coordinates
      zoom: 8,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    drawerMapRef.current = map;
  };

  // Initialize Leaflet map
  const initializeMap = () => {
    if (!mapContainerRef.current) return;


    // Clean up existing map if it exists
    if (mapRef.current) {

      // Clean up routing control if it exists
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

    // Clear any existing content in the container and reset it
    if (mapContainerRef.current) {
      // Get the parent element
      const parent = mapContainerRef.current.parentElement;
      if (parent) {
        // Create a new container element
        const newContainer = document.createElement("div");
        newContainer.className = mapContainerRef.current.className;
        newContainer.style.cssText = mapContainerRef.current.style.cssText;

        // Replace the old container with the new one
        parent.replaceChild(newContainer, mapContainerRef.current);
        mapContainerRef.current = newContainer;
      } else {
        // Fallback: just clear the content
        mapContainerRef.current.innerHTML = "";
        mapContainerRef.current.className =
          mapContainerRef.current.className.replace(/leaflet-container/g, "");
        mapContainerRef.current.removeAttribute("tabindex");
      }
    }

    // Wait a bit to ensure cleanup is complete
    setTimeout(() => {
      try {
        // Check if container still exists after cleanup
        if (!mapContainerRef.current) {
          console.error("Map container not found after cleanup");
          setMapError(true);
          setMapLoaded(false);
          setMapInitializing(false);
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

        // Create map with disabled zoom controls
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: true,
          touchZoom: true,
          boxZoom: true,
          keyboard: false,
          dragging: true,
          center: [41.9022, 12.4823],
          zoom: 10,
          attributionControl: false,
        });

        // Remove any existing controls (only if they exist)
        if (map.zoomControl) {
          map.removeControl(map.zoomControl);
        }
        if (map.attributionControl) {
          map.removeControl(map.attributionControl);
        }


        // Prevent map from interfering with page scroll
        const mapContainer = mapContainerRef.current;
        if (mapContainer) {
          mapContainer.addEventListener('wheel', (e) => {
            // Allow page scroll to work normally when over the map
            e.stopPropagation();
          }, { passive: true });
        }

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        // Add markers and route for itinerary locations
        const currentItinerary = itineraryData.find(
          (data) => data.id === activeTab
        );
        if (currentItinerary) {
          // Collect coordinates for route line (start to last point before end)
          const routeCoordinates: [number, number][] = [];
          const markers: L.Marker[] = [];

          currentItinerary.items.forEach((item, index) => {
            if (item.lat !== undefined && item.lng !== undefined) {
              const coords: [number, number] = [item.lat, item.lng];

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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                  </svg>
                  </svg>
                  </div>
                `,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                });
                marker = L.marker(coords, { icon: endIcon });
              } else {
                // Numbered markers for stops (excluding start and end)
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
                    ${item.order || (index + 1)}
                  </div>
                `,
                  iconSize: [32, 32],
                  iconAnchor: [16, 16],
                });
                marker = L.marker(coords, { icon: stopIcon });
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

          // Add realistic driving route (from start to last point before end)
          if (routeCoordinates.length > 1) {
            try {
              // Use L.Routing.plan to get route without control panel
              const plan = L.Routing.plan(
                routeCoordinates.map((coord) => L.latLng(coord[0], coord[1])),
                {
                  createMarker: function () {
                    return false;
                  }, // Don't create any markers
                  routeWhileDragging: false,
                  addWaypoints: false,
                }
              );

              // Create routing control with no markers
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
                show: false, // Hide the routing control panel
                collapsible: false,
                addWaypoints: false,
              }).addTo(map);

              // Store routing control reference for proper cleanup
              (map as any).routingControl = routingControl;

              // Hide the routing control panel and remove it from DOM
              routingControl.hide();

              // Force remove the control panel from DOM after a short delay
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
              // Fallback to straight line if routing machine fails
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
            map.fitBounds(group.getBounds().pad(0.1), { animate: false });
          }
        }

        mapRef.current = map;
        setMapLoaded(true);
        setMapError(false);
        setMapInitializing(false);

      } catch (error) {
        console.error("Map initialization failed:", error);
        setMapError(true);
        setMapLoaded(false);
        setMapInitializing(false);
      }
    }, 100); // Wait 100ms before initializing
  };

  // Cleanup map when component unmounts or tab changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      setMapLoaded(false);
      setMapError(false);
      setMapInitializing(false);
    }
  }, [activeTab]);

  // Initialize map when viewMode changes to map
  useEffect(() => {
    if (viewMode === "map" && !mapInitializing) {
      // Reset states first
      setMapLoaded(false);
      setMapError(false);
      setMapInitializing(true);

      // Simple approach - wait for DOM to be ready
      const initMap = () => {
        if (mapContainerRef.current) {
          // Ensure container is visible
          mapContainerRef.current.style.display = "block";
          mapContainerRef.current.style.visibility = "visible";
          initializeMap();
        }
      };

      // Wait for next tick to ensure DOM is updated
      setTimeout(initMap, 300);
    } else if (viewMode !== "map" && mapRef.current) {
      // Clean up map when switching away from map view
      mapRef.current.remove();
      mapRef.current = null;
      setMapLoaded(false);
      setMapError(false);
      setMapInitializing(false);
    }
  }, [viewMode, activeTab]);

  // Adjust map bounds when sidebar opens/closes
  useEffect(() => {
    if (mapRef.current && viewMode === "map") {
      // Small delay to ensure sidebar animation completes
      setTimeout(() => {
        if (mapRef.current) {
          // Get all markers
          const allMarkers: L.Marker[] = [];
          mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              allMarkers.push(layer);
            }
          });

          if (allMarkers.length > 0) {
            // Invalidate size to account for container resize
            mapRef.current.invalidateSize();

            // Wait for resize to complete, then fit bounds
            setTimeout(() => {
              if (mapRef.current) {
                const group = new L.FeatureGroup(allMarkers);
                const bounds = group.getBounds();

                mapRef.current.fitBounds(bounds, {
                  padding: L.point(20, 20),
                  animate: false,
                });
              }
            }, 300);
          }
        }
      }, 350); // Wait for sidebar animation to complete
    }
  }, [showSidebar, viewMode]);

  // Effect to update marker styles when selected location changes
  useEffect(() => {
    if (mapRef.current && viewMode === "map" && selectedLocation) {
      // Just update the view to the selected location, don't re-initialize the entire map
      const currentItinerary = itineraryData.find(
        (data) => data.id === activeTab
      );
      if (currentItinerary) {
        const selectedItem = currentItinerary.items.find(
          (item) => item.id === selectedLocation
        );
        if (
          selectedItem &&
          selectedItem.lat !== undefined &&
          selectedItem.lng !== undefined
        ) {
          const coords: [number, number] = [selectedItem.lat, selectedItem.lng];
          mapRef.current.setView(coords, 15, {
            animate: false,
          });
        }
      }
    }
  }, [selectedLocation, viewMode, activeTab]);

  // Initialize drawer map when drawer opens
  useEffect(() => {
    if (showMapDrawer && drawerMapContainerRef.current) {
      // Small delay to ensure the drawer is fully rendered
      setTimeout(() => {
        initializeDrawerMap();
      }, 100);
    }
  }, [showMapDrawer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Get the transformed itinerary data
  const itineraryData = transformItineraryData();

  // If no itinerary data, don't render anything
  if (itineraryData.length === 0) {
    return null;
  }

  const currentData = itineraryData.find((data) => data.id === activeTab) || itineraryData[0];

  // Handle sliding bar animation
  useEffect(() => {
    const updateBar = () => {
      if (tabsRef.current) {
        const activeButton = tabsRef.current.querySelector(
          `button[data-tab-id="${activeTab}"]`
        );
        if (activeButton) {
          const left =
            (activeButton as HTMLElement).offsetLeft -
            tabsRef.current.scrollLeft;
          const width = (activeButton as HTMLElement).offsetWidth;
          setBarPosition({ left, width });

          // Scroll active tab into view within the tab container only (don't scroll the page)
          const tabContainer = tabsRef.current;
          const buttonLeft = (activeButton as HTMLElement).offsetLeft;
          const buttonWidth = (activeButton as HTMLElement).offsetWidth;
          const containerWidth = tabContainer.clientWidth;
          const currentScroll = tabContainer.scrollLeft;

          // Calculate if button is outside visible area
          const buttonRight = buttonLeft + buttonWidth;
          const visibleLeft = currentScroll;
          const visibleRight = currentScroll + containerWidth;

          // Only scroll the tab container, not the page
          if (buttonLeft < visibleLeft) {
            tabContainer.scrollTo({
              left: buttonLeft - 20,
              behavior: "smooth"
            });
          } else if (buttonRight > visibleRight) {
            tabContainer.scrollTo({
              left: buttonRight - containerWidth + 20,
              behavior: "smooth"
            });
          }
        }
      }
    };

    const handleScroll = () => {
      updateBar();
    };

    // Debounce the updateBar call to prevent rapid triggers
    const timeoutId = setTimeout(() => {
      updateBar();
    }, 100);

    window.addEventListener("resize", updateBar);

    if (tabsRef.current) {
      tabsRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateBar);
      if (tabsRef.current) {
        tabsRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeTab]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleHighlight = (highlightKey: string) => {
    setExpandedHighlights((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(highlightKey)) {
        newSet.delete(highlightKey);
      } else {
        newSet.add(highlightKey);
      }
      return newSet;
    });
  };

  const toggleThingToDo = (thingKey: string) => {
    setExpandedThingsToDo((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(thingKey)) {
        newSet.delete(thingKey);
      } else {
        newSet.add(thingKey);
      }
      return newSet;
    });
  };

  // Function to handle location click and move map
  const handleLocationClick = (item: ItineraryItem) => {
    if (viewMode !== "map" || !mapRef.current || !item.location) return;

    // Set selected location for visual feedback
    setSelectedLocation(item.id);

    // Reset selection after 3 seconds
    setTimeout(() => {
      setSelectedLocation(null);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg pt-3">
      {/* Tabs - Only show if multiple itineraries */}
      {itineraryData.length > 1 && (
        <div className="relative mb-6">
          <div
            ref={tabsRef}
            className="flex gap-6 border-b overflow-x-auto scrollbar-hide border-gray-200 pb-1"
          >
            {itineraryData.map((data) => (
              <button
                key={data.id}
                data-tab-id={data.id}
                onClick={() => setActiveTab(data.id)}
                className={`pb-2 font-halyard-text hover:cursor-pointer text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === data.id
                    ? "text-[#444444]"
                    : "text-gray-500 hover:text-[#444444]"
                }`}
              >
                {data.title}
              </button>
            ))}
          </div>
          {/* Sliding Bar */}
          <div
            className="absolute bottom-0 h-[0.8px] bg-[#444444] transition-all duration-300"
            style={{
              left: `${barPosition.left}px`,
              width: `${barPosition.width}px`,
            }}
          />
        </div>
      )}

      {/* Trip Overview */}
      <div className="flex md:gap-32 gap-6 mb-6">
        <div className="flex md:flex-row flex-col items-start md:items-center gap-2 ">
          <div className="w-8 h-8 flex items-center justify-center bg-[#f8f8f8] rounded-sm">
            <Clock className="w-4 h-4 text-[#666666]" />
          </div>
          <div className="flex flex-col font-halyard-text">
            <p className="text-[12px] text-[#666666]">TOTAL DURATION</p>
            <p className="text-sm  text-[#444444]">
              {currentData.totalDuration}
            </p>
          </div>
        </div>
        <div className="flex md:hidden items-center">
          <div className="border-r-[1px] h-[70%] border-gray-200"></div>
        </div>
        <div className="flex md:flex-row flex-col items-start md:items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-[#f8f8f8] rounded-sm">
            <Bus className="w-4 h-4 text-[#666666]" />
          </div>
          <div className="flex flex-col font-halyard-text">
            <p className="text-[12px] text-[#666666]">MODE OF TRANSFER</p>
            <p className="text-sm  text-[#444444]">
              {currentData.modeOfTransfer}
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="md:flex font-halyard-text  hidden items-center gap-4 mb-6">
        <span className="text-[15px] text-[#666666]">Timeline</span>
        <div className="relative -mb-1">
          <button
            onClick={() =>
              setViewMode(viewMode === "timeline" ? "map" : "timeline")
            }
            className={`w-10 h-6  ${viewMode === "timeline" ? "bg-[#444444]" : "bg-purple-600"} rounded-full relative transition-colors`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform flex items-center justify-center ${
                viewMode === "timeline" ? "left-1" : "left-5"
              }`}
            >
              {viewMode === "timeline" ? (
                <List className="w-3 h-3 text-[#444444]" />
              ) : (
                <Map className="w-3 h-3 text-purple-600" />
              )}
            </div>
          </button>
        </div>
        <span className="text-[15px] text-[#666666]">Map</span>
      </div>

      {/* Map Preview Section */}
      <div className="bg-[#fff8ef] relative font-halyard-text  rounded-lg  mb-6 flex md:hidden items-stretch justify-between">
        <div className="flex p-4 flex-col">
          <p className="text-[#444444] text-sm font-medium mb-1">
            View your experience all mapped out.
          </p>
          <button
            onClick={() => setShowFullScreenMap(true)}
            className="text-[#444444] text-sm font-semibold hover:text-purple-600 transition-colors flex items-center gap-1"
          >
            Open map
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-0 right-0 bottom-0 z-0">
          <img src="/map2.png" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex items-center justify-center w-[20%]">
          <img 
            src="/map1.svg" 
            alt="Map preview" 
            className="w-14 rounded-sm relative z-10 cursor-pointer" 
            style={{boxShadow: '0 2px 15px #ff9f244d'}} 
            onClick={() => setShowMapDrawer(true)}
          />
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" ? (
        <div className="relative z-0">
          {/* Toggle Button - Fixed position relative to viewport */}
          <div
            className={`absolute top-4 z-1 transition-all duration-300 ease-in-out ${
              showSidebar ? "left-82" : "left-4"
            }`}
          >
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 border-2 border-gray-300"
            >
              {showSidebar ? (
                <ArrowRight className="w-5 h-5 text-gray-700 rotate-180" />
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Recenter Button - Top right of map */}
          <div
            className={`absolute top-4 z-1 transition-all duration-300 ease-in-out ${
              showSidebar ? "right-4" : "right-4"
            }`}
          >
            <button
              onClick={() => {
                if (mapRef.current) {
                  // Get all markers
                  const allMarkers: L.Marker[] = [];
                  mapRef.current.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                      allMarkers.push(layer);
                    }
                  });

                  if (allMarkers.length > 0) {
                    const group = new L.FeatureGroup(allMarkers);
                    mapRef.current.fitBounds(group.getBounds().pad(0.1), { animate: false });
                  }
                }
              }}
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 border-2 border-gray-300"
              title="Recenter map to show all markers"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          {/* Map Container */}
          <div
            className={`bg-gradient-to-br from-blue-100 to-green-100  border border-gray-200 h-[500px] relative overflow-hidden transition-all duration-300 ease-in-out ${
              showSidebar
                ? "w-[calc(100%-20rem)] ml-80 rounded-r-lg"
                : "w-full ml-0 rounded-lg"
            }`}
            style={{ zIndex: 0 }}
          >
            {/* Leaflet Map Container */}
            <div
              className={`w-full h-full ${showSidebar ? "rounded-r-lg" : "rounded-lg"} overflow-hidden relative bg-gray-100`}
            >
              <div
                ref={mapContainerRef}
                className="w-full h-full"
                style={{
                  minHeight: "400px",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "block",
                }}
              />

              {/* Error state - only show when map fails to load */}
              {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
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

          {/* Timeline Sidebar - Same as Timeline View */}
          <div
            className={`absolute top-0 left-0 w-80 h-full bg-white border-2 border-gray-300 rounded-l-lg p-4 max-h-[500px] overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out z-0 ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="relative">
              {/* Vertical Line */}
              <div
                className="absolute left-3 top-0 w-0.5 bg-purple-600 z-0"
                style={{ height: "calc(100% - 2rem)" }}
              ></div>

              <div className="space-y-4 font-halyard-text">
                {currentData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex items-start gap-4 pb-4 cursor-pointer transition-all duration-200 '
                    }`}
                    onClick={() => handleLocationClick(item)}
                  >
                    {/* Icon */}
                    <div className="relative z-1 flex-shrink-0">
                      {item.type === "start" ? (
                        <div className="w-6 h-6 bg-purple-600 rounded-xs flex items-center justify-center">
                          <ArrowRight className="w-3 h-3 text-white" />
                        </div>
                      ) : item.type === "end" ? (
                        <div className="w-6 h-6 bg-pink-500 rounded-sm flex items-center justify-center">
                          <div className="w-[14px] h-[14px] bg-white rounded-xs"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-purple-600 rounded-xs flex items-center justify-center text-white text-xs font-bold">
                          {index}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-[#444444] uppercase tracking-wide mb-1">
                            {item.type === "start"
                              ? "START POINT"
                              : item.type === "end"
                                ? "END POINT"
                                : ``}
                          </div>
                          <h4 className="text-sm font-bold text-[#444444] mb-1">
                            {item.title}
                          </h4>
                          {item.location && index === 0 && (
                            <div className="flex items-center gap-1 mt-[2px]">
                              <MapPin className="w-3 h-3 text-[#e5006e]" />
                              <a
                                href={item.locationLink}
                                className="text-[12px] text-[#e5006e] underline hover:text-red-700"
                              >
                                Get direction
                              </a>
                            </div>
                          )}
                          <div className="flex items-center mt-[4px] gap-1 flex-wrap">
                            {item.duration && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{item.duration}</span>
                              </div>
                            )}
                            {item.attractions && (
                              <span className=" w-[4px] h-[4px] rounded-full bg-[#e2e2e2] inline-block"></span>
                            )}
                            {item.attractions && (
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {item.attractions} attractions
                                </span>
                              </div>
                            )}
                            {item.ticketsIncluded && (
                              <span className=" w-[4px] h-[4px] rounded-full bg-[#e2e2e2] inline-block"></span>
                            )}
                            {item.ticketsIncluded && (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 text-green-600">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="text-xs text-gray-500">
                                  Tickets included
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Plus/Minus Button - Only show if item has expandable content */}
                        {(item.image ||
                          item.thingsToDo ||
                          item.nearbyThings) && (
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="p-1 hover:cursor-pointer hover:bg-gray-100 rounded ml-2"
                          >
                            {expandedItems.has(item.id) ? (
                              <Minus className="w-4 h-4 text-[#666666]" />
                            ) : (
                              <Plus className="w-4 h-4 text-[#666666]" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expanded Content - Only show if item has image or sub-locations */}
                      {expandedItems.has(item.id) &&
                        (item.image ||
                          item.thingsToDo ||
                          item.nearbyThings) && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg max-w-[200px]">
                            {item.image && (
                              <div className="w-16 h-10 bg-gray-200 rounded flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                            <span className="text-sm text-[#444444] whitespace-nowrap">
                              {item.title}
                              <p className="text-xs text-[#666666] font-halyard-text">
                                3 mintues walk
                              </p>
                            </span>
                          </div>
                        )}

                      {/* Travel Info */}
                      {item.distance && item.time && (
                        <div className="mt-8 pt-2 relative border-t border-dashed border-gray-300">
                          <div className="bg-white flex items-center gap-2 text-[#444444] border border-[#e2e2e2] text-[10px] px-2 py-[0px] rounded-full absolute -top-3 left-5">
                            {item.distance}{" "}
                            <span className=" w-[4px] h-[4px] rounded-full bg-[#666666] inline-block"></span>{" "}
                            {item.time}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="relative z-0" ref={timelineContainerRef}>
          {/* Vertical Line - extends to the last item */}
          <div
            className="absolute left-3 top-0 w-0.5 bg-purple-600 z-0"
            style={{ height: "calc(100% - 1rem)" }}
          ></div>

          {currentData.items.map((item, index) => (
            <div
              key={item.id}
              className="relative flex items-start gap-4 mb-8 last:mb-0"
            >
              {/* Icon */}
              <div className="relative z-1 font-halyard-text flex-shrink-0">
                {item.type === "start" ? (
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                ) : item.type === "end" ? (
                  <div className="w-6 h-6 bg-pink-500 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 mt-1 bg-purple-600 rounded-sm flex items-center justify-center text-white text-sm font-bold">
                    {index}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 font-halyard-text min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#444444] uppercase tracking-wide">
                      {item.type === "start"
                        ? "START POINT"
                        : item.type === "end"
                          ? "END POINT"
                          : ""}
                    </div>
                    <h3 className="text-lg font-bold text-[#444444]">
                      {item.title}
                    </h3>
                    {item.location && index === 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#e5006e]" />
                        <a
                          href={item.locationLink}
                          className="text-sm text-[#e5006e] underline hover:text-red-700"
                        >
                          Get direction
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedItems.has(item.id) ? (
                      <Minus className="w-4 h-4 text-[#666666]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#666666]" />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedItems.has(item.id) && (
                  <div className="mt-4 flex gap-6">
                    {item.image && (
                      <div className="mb-4 w-[45%]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="w-[50%]">
                      <p className="text-sm text-[#666666] leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Duration and Additional Info */}
                <div className="flex gap-4 items-center mt-4">
                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {item.duration}
                      </span>
                    </div>
                  )}
                  {item.attractions && (
                    <span className=" w-[4px] h-[4px] rounded-full bg-[#e2e2e2] inline-block"></span>
                  )}
                  {item.attractions && (
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {item.attractions} attractions
                      </span>
                    </div>
                  )}
                  {item.ticketsIncluded && (
                    <span className=" w-[4px] h-[4px] rounded-full bg-[#e2e2e2] inline-block"></span>
                  )}
                  {item.ticketsIncluded && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 text-green-600">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-500">
                        Tickets included
                      </span>
                    </div>
                  )}
                </div>

                {/* Description - only show when not expanded */}
                {!expandedItems.has(item.id) && (
                  <p className="text-sm text-[#666666] mt-4 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-halyard-text font-bold text-purple-600 mb-2">
                      Highlights
                    </h4>
                    <ul className="space-y-1">
                      {item.highlights.map((highlight, idx) => {
                        const highlightKey = `${item.id}-highlight-${idx}`;
                        const isExpanded = expandedHighlights.has(highlightKey);
                        return (
                          <div key={idx}>
                            <div className="flex justify-between items-center">
                              <li className="text-[15px] text-[#444444]">
                                {highlight}
                              </li>
                              <button
                                onClick={() => toggleHighlight(highlightKey)}
                                className="flex items-center gap-1 text-[#666666] hover:text-purple-600 transition-colors"
                              >
                                {isExpanded ? (
                                  <Minus className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="mt-4 flex gap-6">
                                {item.image && (
                                  <div className="mb-4 w-[45%]">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-full h-48 object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                                <div className="w-[50%]">
                                  <p className="text-sm text-[#666666] leading-relaxed mb-4">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Things to Do */}
                {item.thingsToDo && item.thingsToDo.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-halyard-text font-bold text-purple-600 mb-2">
                      Things to do
                    </h4>
                    <div className="space-y-1">
                      {item.thingsToDo.map((thing, idx) => {
                        const thingKey = `${item.id}-thing-${idx}`;
                        const isExpanded = expandedThingsToDo.has(thingKey);
                        return (
                          <div key={idx}>
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col items-start">
                                <span className="text-[15px] text-[#444444]">
                                  {thing.title}
                                </span>
                                <span className="text-[14px] text-gray-500">
                                  {thing.category}
                                </span>
                              </div>
                              <button
                                onClick={() => toggleThingToDo(thingKey)}
                                className="flex items-center gap-1 text-[#666666] hover:text-purple-600 transition-colors"
                              >
                                {isExpanded ? (
                                  <Minus className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="mt-4 flex gap-6">
                                {item.image && (
                                  <div className="mb-4 w-[45%]">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-full h-48 object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                                <div className="w-[50%]">
                                  <p className="text-sm text-[#666666] leading-relaxed mb-4">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Nearby Things */}
                {item.nearbyThings && item.nearbyThings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-halyard-text text-[#666666] mb-2">
                      Nearby things to do
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.nearbyThings.map((thing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-w-[250px]"
                        >
                          <div className="w-10 h-7 bg-gray-200 rounded flex-shrink-0">
                            <img
                              src={thing.image}
                              alt={thing.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <span className="text-sm text-[#444444] whitespace-nowrap">
                            {thing.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Info */}
                {item.distance && item.time && (
                  <div className="mt-8 pt-2 relative border-t border-dashed border-gray-300">
                    <div className="bg-white flex items-center gap-2 text-[#444444] border border-[#e2e2e2] text-xs px-3 py-1 rounded-full absolute -top-3 left-10">
                      {item.distance}{" "}
                      <span className=" w-[4px] h-[4px] rounded-full bg-[#666666] inline-block"></span>{" "}
                      {item.time}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Map */}
      <FullScreenMap
        isOpen={showFullScreenMap}
        onClose={() => setShowFullScreenMap(false)}
        itineraryData={currentData.items}
        tripTitle={currentData.title}
        experience={experience}
      />

      {/* Map Drawer - Full Screen Overlay */}
      {showMapDrawer && (
        <div className="fixed inset-0 bg-black" style={{zIndex: 50}}>
          {/* Close Button */}
          <button
            onClick={() => setShowMapDrawer(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          
          {/* Map Container */}
          <div 
            ref={drawerMapContainerRef} 
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default ItinerarySection;

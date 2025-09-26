"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, ChevronDown, ArrowLeft, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCities, deleteCity } from "@/api/cities/cities-api";
import { City } from "@/types/cities/cities-types";
import NewCity from "./NewCity";
import EditCity from "./EditCity";

interface CityDisplay {
  id: string;
  cityName: string;
  countryName: string;
  imageUrl: string;
}

const Cities = () => {
  const [activeView, setActiveView] = useState<"list" | "new" | "edit">("list");
  const [selectedCity, setSelectedCity] = useState<CityDisplay | null>(null);
  const [cities, setCities] = useState<CityDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Load cities function (can be called multiple times)
  const loadCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await fetchCities();

      // Check if response has the expected structure
      let citiesArray = [];

      if (Array.isArray(response)) {
        citiesArray = response;
      } else if (response.data && Array.isArray(response.data)) {
        citiesArray = response.data;
      } else if (response.success && response.data && Array.isArray(response.data)) {
        citiesArray = response.data;
      } else {
        console.error('Unexpected API response structure:', response);
        setError(`API returned unexpected format. Expected array, got: ${typeof response}`);
        return;
      }


      // Transform API data to display format
      const transformedCities: CityDisplay[] = citiesArray.map((item: any) => {
        const data = item.data || item;
        return {
          id: data._id || data.id || 'unknown',
          cityName: data.cityName || 'Unknown City',
          countryName: data.countryName || 'Unknown Country',
          imageUrl: data.imageUrl || data.image || '',
        };
      });

      setCities(transformedCities);
    } catch (err) {
      console.error('Error loading cities:', err);
      setError('Failed to load cities: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cities on component mount
  useEffect(() => {
    loadCities();
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdownElement = dropdownRefs.current[openDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Handle dropdown actions
  const handleEdit = (city: CityDisplay) => {
    setSelectedCity(city);
    setActiveView("edit");
    setOpenDropdown(null);
  };

  const handleDelete = async (cityId: string) => {
    try {
      setDeleting(cityId);
      await deleteCity(cityId);

      // Remove city from the list
      setCities(cities.filter(city => city.id !== cityId));
      setDeleteConfirm(null);

    } catch (error: any) {
      console.error('Error deleting city:', error);
      setError('Failed to delete city: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (cityId: string) => {
    setDeleteConfirm(cityId);
    setOpenDropdown(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const toggleDropdown = (cityId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === cityId ? null : cityId);
  };

  // Handle successful city creation
  const handleCityCreated = () => {
    setActiveView("list");
    loadCities(); // Refresh the list
  };

  // Handle successful city update
  const handleCityUpdated = () => {
    setActiveView("list");
    loadCities(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }


  const renderCitiesList = () => (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">All Cities</h1>
            <div className="flex items-center space-x-4">
              <Button
                className="bg-purple-600 hover:cursor-pointer hover:bg-purple-700 text-white"
                onClick={() => setActiveView("new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                New City
              </Button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Table */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-[625px] flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CITY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      COUNTRY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cities.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 mr-3 overflow-hidden">
                            {city.imageUrl ? (
                              <img
                                src={city.imageUrl}
                                alt={city.cityName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {city.cityName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.countryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div
                          className="relative"
                          ref={(el) => {
                            dropdownRefs.current[city.id] = el;
                          }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex hover:cursor-pointer items-center space-x-1"
                            onClick={(e) => toggleDropdown(city.id, e)}
                          >
                            <span>Manage</span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>

                          {/* Dropdown Menu */}
                          {openDropdown === city.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(city)}
                                  className="w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit City</span>
                                </button>
                                <button
                                  onClick={() => confirmDelete(city.id)}
                                  className="w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete City</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render function with conditional views
  return (
    <div className="h-full flex flex-col">
      {activeView === "list" && renderCitiesList()}
      {activeView === "new" && (
        <NewCity
          onBack={() => setActiveView("list")}
          onSuccess={handleCityCreated}
        />
      )}
      {activeView === "edit" && selectedCity && (
        <EditCity
          cityName={selectedCity.cityName}
          onBack={() => setActiveView("list")}
          onSuccess={handleCityUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Delete City</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this city? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={deleting === deleteConfirm}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting === deleteConfirm}
              >
                {deleting === deleteConfirm ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cities;
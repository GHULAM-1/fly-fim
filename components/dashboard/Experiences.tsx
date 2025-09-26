"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, ChevronDown, ArrowLeft, Edit, Trash2, MoreVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchAllExperiences, deleteExperience } from "@/api/expereince/expereince-api";
import { ExperienceResponse } from "@/types/experience/experience-types";
import NewExperience from "./NewExperience";
import EditExperience from "./EditExperience";

interface ExperienceDisplay {
  id: string;
  title: string;
  cityName: string;
  categoryName: string;
  subcategoryName: string;
  price: number;
  isPopular: boolean;
  mainImage: string[];
}

const Experiences = () => {
  const [activeView, setActiveView] = useState<"list" | "new" | "edit">("list");
  const [selectedExperience, setSelectedExperience] = useState<ExperienceDisplay | null>(null);
  const [experiences, setExperiences] = useState<ExperienceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Load experiences function (can be called multiple times)
  const loadExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await fetchAllExperiences();
      // Check if response has the expected structure
      let experiencesArray = [];

      if (Array.isArray(response)) {
        experiencesArray = response;
      } else if (response.data && Array.isArray(response.data)) {
        experiencesArray = response.data;
      } else if (response.success && response.data && Array.isArray(response.data)) {
        experiencesArray = response.data;
      } else {
        console.error('Unexpected API response structure:', response);
        setError(`API returned unexpected format. Expected array, got: ${typeof response}`);
        return;
      }


      // Transform API data to display format with only important attributes
      const transformedExperiences: ExperienceDisplay[] = experiencesArray.map((item: any) => {
        const data = item.data || item;
        return {
          id: data._id || data.id || 'unknown',
          title: data.title || 'Untitled Experience',
          cityName: data.cityName || 'Unknown City',
          categoryName: data.categoryName || 'Unknown Category',
          subcategoryName: data.subcategoryName || 'Unknown Subcategory',
          price: data.price || 0,
          isPopular: data.isPopular || false,
          mainImage: data.mainImage || [],
        };
      });

      setExperiences(transformedExperiences);
    } catch (err) {
      console.error('Error loading experiences:', err);
      setError('Failed to load experiences: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch experiences on component mount
  useEffect(() => {
    loadExperiences();
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
  const handleEdit = (experience: ExperienceDisplay) => {
    setSelectedExperience(experience);
    setActiveView("edit");
    setOpenDropdown(null);
  };

  const handleDelete = async (experienceId: string) => {
    try {
      setDeleting(experienceId);
      await deleteExperience(experienceId);

      // Remove experience from the list
      setExperiences(experiences.filter(exp => exp.id !== experienceId));
      setDeleteConfirm(null);

    } catch (error: any) {
      console.error('Error deleting experience:', error);
      setError('Failed to delete experience: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (experienceId: string) => {
    setDeleteConfirm(experienceId);
    setOpenDropdown(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const toggleDropdown = (experienceId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === experienceId ? null : experienceId);
  };

  // Handle successful experience creation
  const handleExperienceCreated = () => {
    setActiveView("list");
    loadExperiences(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experiences...</p>
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

  const renderNewExperienceForm = () => (
    <div className="flex-1 flex flex-col ">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setActiveView("list")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Experiences</span>
              </Button>
              <h1 className="text-2xl  font-bold text-gray-800">New Experience</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Save Experience
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[800px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Experience Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter experience name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Code
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter reference code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="Draft">Draft</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Under Curation">Under Curation</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter experience description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExperiencesList = () => (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">All Experiences</h1>
            <div className="flex items-center space-x-4">
              <Button
                className="bg-purple-600 hover:cursor-pointer hover:bg-purple-700 text-white"
                onClick={() => setActiveView("new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Experience
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

      {/* Experiences Table */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-[625px] flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EXPERIENCE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CITY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CATEGORY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {experiences.map((experience) => (
                    <tr key={experience.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 mr-3 overflow-hidden">
                            {experience.mainImage && experience.mainImage[0] ? (
                              <img
                                src={experience.mainImage[0]}
                                alt={experience.title}
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
                              {experience.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {experience.cityName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{experience.categoryName}</div>
                          <div className="text-xs text-gray-500">{experience.subcategoryName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">${experience.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div
                          className="relative"
                          ref={(el) => {
                            dropdownRefs.current[experience.id] = el;
                          }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex hover:cursor-pointer items-center space-x-1"
                            onClick={(e) => toggleDropdown(experience.id, e)}
                          >
                            <span>Manage</span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>

                          {/* Dropdown Menu - positioned to avoid overflow clipping */}
                          {openDropdown === experience.id && (
                            <div className="fixed bg-white border border-gray-200 mt-2 rounded-md shadow-lg z-[9999] w-48 min-w-max"
                                 style={{
                                   top: `${(dropdownRefs.current[experience.id]?.getBoundingClientRect().bottom || 0) + 4}px`,
                                   right: `${window.innerWidth - (dropdownRefs.current[experience.id]?.getBoundingClientRect().right || 0)}px`
                                 }}>
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(experience)}
                                  className="w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Experience</span>
                                </button>
                                <button
                                  onClick={() => confirmDelete(experience.id)}
                                  className="w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete Experience</span>
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
      {activeView === "list" && renderExperiencesList()}
      {activeView === "new" && (
        <NewExperience
          onBack={() => setActiveView("list")}
          onSuccess={handleExperienceCreated}
        />
      )}
      {activeView === "edit" && selectedExperience && (
        <EditExperience
          experienceId={selectedExperience.id}
          onBack={() => setActiveView("list")}
          onSuccess={handleExperienceCreated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Delete Experience</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this experience? This action cannot be undone.
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

export default Experiences;
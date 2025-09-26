"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, ChevronDown, ArrowLeft, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchSubcategories, deleteSubcategory, Subcategory } from "@/api/subcategory/subcategory-api";
import NewSubcategory from "./NewSubcategory";
import EditSubcategory from "./EditSubcategory";

interface SubcategoryDisplay {
  id: string;
  subcategoryName: string;
  creationTime?: number;
}

const Subcategories = () => {
  const [activeView, setActiveView] = useState<"list" | "new" | "edit">("list");
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryDisplay | null>(null);
  const [subcategories, setSubcategories] = useState<SubcategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Load subcategories function (can be called multiple times)
  const loadSubcategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await fetchSubcategories();

      // Check if response has the expected structure
      let subcategoriesArray = [];

      if (Array.isArray(response)) {
        subcategoriesArray = response;
      } else if (response.data && Array.isArray(response.data)) {
        subcategoriesArray = response.data;
      } else if (response.success && response.data && Array.isArray(response.data)) {
        subcategoriesArray = response.data;
      } else {
        console.error('Unexpected API response structure:', response);
        setError(`API returned unexpected format. Expected array, got: ${typeof response}`);
        return;
      }


      // Transform API data to display format
      const transformedSubcategories: SubcategoryDisplay[] = subcategoriesArray.map((item: any) => {
        const data = item.data || item;
        return {
          id: data._id || data.id || 'unknown',
          subcategoryName: data.subcategoryName || 'Unknown Subcategory',
          creationTime: data._creationTime
        };
      });

      setSubcategories(transformedSubcategories);
    } catch (err) {
      console.error('Error loading subcategories:', err);
      setError('Failed to load subcategories: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories on component mount
  useEffect(() => {
    loadSubcategories();
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
  const handleEdit = (subcategory: SubcategoryDisplay) => {
    setSelectedSubcategory(subcategory);
    setActiveView("edit");
    setOpenDropdown(null);
  };

  const handleDelete = async (subcategoryId: string) => {
    try {
      setDeleting(subcategoryId);
      await deleteSubcategory(subcategoryId);

      // Remove subcategory from the list
      setSubcategories(subcategories.filter(subcategory => subcategory.id !== subcategoryId));
      setDeleteConfirm(null);

    } catch (error: any) {
      console.error('Error deleting subcategory:', error);
      setError('Failed to delete subcategory: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (subcategoryId: string) => {
    setDeleteConfirm(subcategoryId);
    setOpenDropdown(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const toggleDropdown = (subcategoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === subcategoryId ? null : subcategoryId);
  };

  // Handle successful subcategory creation
  const handleSubcategoryCreated = () => {
    setActiveView("list");
    loadSubcategories(); // Refresh the list
  };

  // Handle successful subcategory update
  const handleSubcategoryUpdated = () => {
    setActiveView("list");
    loadSubcategories(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subcategories...</p>
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

  const renderSubcategoriesList = () => (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">All Subcategories</h1>
            <div className="flex items-center space-x-4">
              <Button
                className="bg-purple-600 hover:cursor-pointer hover:bg-purple-700 text-white"
                onClick={() => setActiveView("new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Subcategory
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

      {/* Subcategories Table */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-[625px] flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SUBCATEGORY NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CREATED
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subcategories.map((subcategory) => (
                    <tr key={subcategory.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex-shrink-0 mr-3 flex items-center justify-center">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {subcategory.subcategoryName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {subcategory.subcategoryName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subcategory.creationTime
                          ? new Date(subcategory.creationTime).toLocaleDateString()
                          : 'Unknown'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div
                          className="relative"
                          ref={(el) => {
                            dropdownRefs.current[subcategory.id] = el;
                          }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex hover:cursor-pointer items-center space-x-1"
                            onClick={(e) => toggleDropdown(subcategory.id, e)}
                          >
                            <span>Manage</span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>

                          {/* Dropdown Menu */}
                          {openDropdown === subcategory.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(subcategory)}
                                  className="w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Subcategory</span>
                                </button>
                                <button
                                  onClick={() => confirmDelete(subcategory.id)}
                                  className="w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete Subcategory</span>
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
      {activeView === "list" && renderSubcategoriesList()}
      {activeView === "new" && (
        <NewSubcategory
          onBack={() => setActiveView("list")}
          onSuccess={handleSubcategoryCreated}
        />
      )}
      {activeView === "edit" && selectedSubcategory && (
        <EditSubcategory
          subcategoryId={selectedSubcategory.id}
          onBack={() => setActiveView("list")}
          onSuccess={handleSubcategoryUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Delete Subcategory</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this subcategory? This action cannot be undone.
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

export default Subcategories;
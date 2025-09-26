"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCityBycityName, updateCity } from "@/api/cities/cities-api";
import { City } from "@/types/cities/cities-types";
import { cityFormSchema, CityFormData } from "@/lib/validations/city-validation";

interface EditCityProps {
  cityName: string;
  onBack: () => void;
  onSuccess?: () => void;
}

const EditCity = ({ cityName: initialCityName, onBack, onSuccess }: EditCityProps) => {
  const [cityId, setCityId] = useState<string>("");
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load city data by name
  useEffect(() => {
    const loadCityData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const cityData = await fetchCityBycityName(initialCityName);

        setCityId(cityData._id);
        setCityName(cityData.cityName);
        setCountryName(cityData.countryName);
        setCurrentImage(cityData.imageUrl || cityData.image);
      } catch (error: any) {
        console.error('Error loading city data:', error);
        setLoadError('Failed to load city data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialCityName) {
      loadCityData();
    }
  }, [initialCityName]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset validation errors
    setValidationErrors({});
    setSubmitError(null);

    // Create edit validation schema (image is optional for updates)
    const editCitySchema = cityFormSchema.extend({
      image: cityFormSchema.shape.image.optional()
    });

    // Validate form data using Zod schema
    try {
      const formData = {
        cityName,
        countryName,
        ...(newImage && { image: newImage }) // Only include image if a new one was selected
      };

      // Validate with Zod
      const validatedData = editCitySchema.parse(formData);

      setIsSubmitting(true);

      try {
        const cityData = {
          cityName: validatedData.cityName,
          countryName: validatedData.countryName,
          image: validatedData.image
        };


        const response = await updateCity(cityId, cityData);
        setSubmitSuccess(true);

        // Show success message briefly then call onSuccess or navigate back
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(); // Call the success callback to refresh the list and navigate back
          } else {
            onBack();
          }
        }, 2000); // Wait 2 seconds to show success message

      } catch (apiError: any) {
        console.error('Error updating city:', apiError);
        setSubmitError(apiError.message || 'Failed to update city. Please try again.');
      } finally {
        setIsSubmitting(false);
      }

    } catch (validationError: any) {
      // Handle Zod validation errors
      if (validationError.errors) {
        const errors: Record<string, string> = {};
        validationError.errors.forEach((err: any) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      } else {
        setSubmitError('Please check your input and try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading city data...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{loadError}</p>
          <Button onClick={onBack} variant="outline">
            Back to Cities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Cities</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Edit City</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update City"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[800px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">City Details</h2>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      City updated successfully! Redirecting...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {submitError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.cityName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city name"
                  disabled={isSubmitting}
                  required
                />
                {validationErrors.cityName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.cityName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.countryName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter country name"
                  disabled={isSubmitting}
                  required
                />
                {validationErrors.countryName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.countryName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                {currentImage && (
                  <div className="mb-4">
                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={currentImage}
                        alt="Current city image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.image && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
                )}

                {/* New Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="New city image preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCity;
"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSubcategory } from "@/api/subcategory/subcategory-api";
import { subcategoryFormSchema, SubcategoryFormData } from "@/lib/validations/subcategory-validation";

interface NewSubcategoryProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const NewSubcategory = ({ onBack, onSuccess }: NewSubcategoryProps) => {
  const [subcategoryName, setSubcategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset validation errors
    setValidationErrors({});
    setSubmitError(null);

    // Validate form data using Zod schema
    try {
      const formData: SubcategoryFormData = {
        subcategoryName
      };

      // Validate with Zod
      const validatedData = subcategoryFormSchema.parse(formData);

      setIsSubmitting(true);

      try {
        const subcategoryData = {
          subcategoryName: validatedData.subcategoryName
        };


        const response = await createSubcategory(subcategoryData);
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
        console.error('Error creating subcategory:', apiError);
        setSubmitError(apiError.message || 'Failed to create subcategory. Please try again.');
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
                <span>Back to Subcategories</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">New Subcategory</h1>
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
                {isSubmitting ? "Creating..." : "Save Subcategory"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[800px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Subcategory Details</h2>

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
                      Subcategory created successfully! Redirecting...
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
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.subcategoryName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter subcategory name"
                  disabled={isSubmitting}
                  required
                />
                {validationErrors.subcategoryName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.subcategoryName}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSubcategory;
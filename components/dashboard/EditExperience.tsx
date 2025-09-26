"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchExperienceById, updateExperience } from "@/api/expereince/expereince-api";
import NewExperience from "./NewExperience";

interface EditExperienceProps {
  experienceId: string;
  onBack: () => void;
  onSuccess?: () => void;
}

const EditExperience = ({ experienceId, onBack, onSuccess }: EditExperienceProps) => {
  const [experienceData, setExperienceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load experience data by ID
  useEffect(() => {
    const loadExperienceData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await fetchExperienceById(experienceId);

        // Handle different response structures
        let experienceData = null;
        if (response.success && response.data) {
          experienceData = response.data;
        } else {
          experienceData = response;
        }

        setExperienceData(experienceData);
      } catch (error: any) {
        console.error('Error loading experience data:', error);
        setLoadError('Failed to load experience data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (experienceId) {
      loadExperienceData();
    }
  }, [experienceId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experience data...</p>
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
            Back to Experiences
          </Button>
        </div>
      </div>
    );
  }

  if (!experienceData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No experience data found</p>
          <Button onClick={onBack} variant="outline">
            Back to Experiences
          </Button>
        </div>
      </div>
    );
  }

  return (
    <NewExperience
      onBack={onBack}
      onSuccess={onSuccess}
      isEditMode={true}
      experienceId={experienceId}
      initialData={experienceData}
    />
  );
};

export default EditExperience;
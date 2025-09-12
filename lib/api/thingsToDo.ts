import { ApiResponse, ThingsToDoPageData } from "@/types/thingsToDo";
import { City } from "@/types/home";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function findCityByName(cityName: string): Promise<City | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/cities`);
    if (!response.ok) return null;
    const cityResponse = await response.json();
    if (cityResponse.success && Array.isArray(cityResponse.data)) {
      const slugifiedCityName = cityName.toLowerCase().replace(/\s+/g, "-");
      return cityResponse.data.find(
        (c: City) =>
          c.cityName.toLowerCase().replace(/\s+/g, "-") === slugifiedCityName
      );
    }
    return null;
  } catch (error) {
    console.error("Error finding city by name:", error);
    return null;
  }
}

export const getThingsToDoPageData = async (
  city: string
): Promise<ApiResponse<ThingsToDoPageData>> => {
  try {
    const cityData = await findCityByName(city);

    if (!cityData) {
      throw new Error(`City '${city}' not found.`);
    }

    const response = await fetch(
      `${API_BASE_URL}/v1/things-to-do/${cityData._id}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch Things to Do page data"
      );
    }

    const data: ApiResponse<ThingsToDoPageData> = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Things to Do page data:", error);
    return {
      success: false,
      data: {
        categories: [],
        topExperiences: [],
        mustDoExperiences: [],
        mainCards: [],
        reviews: [],
        destinations: [],
      },
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

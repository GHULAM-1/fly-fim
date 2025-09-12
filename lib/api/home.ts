import { ApiResponse, HomePageData } from "@/types/home";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getHomePageData = async (): Promise<ApiResponse<HomePageData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/home-page`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch home page data");
    }

    const data: ApiResponse<HomePageData> = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching home page data:", error);

    return {
      success: false,
      data: {
        destinations: [],
        recommendations: [],
        activities: [],
      },
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

import { City, Experience, ApiResponse as BaseApiResponse } from "./home";

export interface ThingsToDoPageData {
  categories: any[];
  topExperiences: Experience[];
  mustDoExperiences: Experience[];
  mainCards: Experience[];
  reviews: any[];
  destinations: City[];
}

export type ApiResponse<T> = BaseApiResponse<T>;

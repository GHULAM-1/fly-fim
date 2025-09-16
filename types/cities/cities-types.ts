export interface City {
    _id: string;
    image: string;
    imageUrl: string;
    cityName: string;
    countryName: string;
  }

export interface CityResponse {
    success: boolean;
    data: City[];
    message: string;
}

  

import axios from 'axios';

export interface ZipcodeLocation {
  placeName: string;
  state: string;
  stateAbbreviation: string;
  longitude: string;
  latitude: string;
}

export interface ZipcodeResponse {
  postCode: string;
  country: string;
  countryAbbreviation: string;
  places: ZipcodeLocation[];
}

export interface ZipcodeError {
  message: string;
  code: string;
}

const API_BASE_URL = 'https://api.zippopotam.us';

/**
 * Fetches location information for a given zipcode
 * @param zipCode - The postal code to lookup
 * @param countryCode - The country code (default: 'us')
 * @returns Promise with the zipcode information
 */
export const getZipcodeInfo = async (
  zipCode: string, 
  countryCode: string = 'us'
): Promise<ZipcodeResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${countryCode}/${zipCode}`);
    
    // Transform the API response to match our interface
    const data = response.data;
    return {
      postCode: data['post code'],
      country: data.country,
      countryAbbreviation: data['country abbreviation'],
      places: data.places.map((place: any) => ({
        placeName: place['place name'],
        state: place.state,
        stateAbbreviation: place['state abbreviation'],
        longitude: place.longitude,
        latitude: place.latitude
      }))
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw {
        message: 'Zipcode not found',
        code: 'ZIPCODE_NOT_FOUND'
      } as ZipcodeError;
    }
    
    throw {
      message: 'Failed to fetch zipcode information',
      code: 'API_ERROR'
    } as ZipcodeError;
  }
};

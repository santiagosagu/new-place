interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface Geometry {
  location: Location;
  viewport: Viewport;
}

interface OpeningHours {
  open_now: boolean;
  periods: { open: { day: number; time: string } }[];
  weekday_text: string[];
}

interface Review {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
  user: user;
  comment: string;
}

interface user {
  name: string;
  picture: string;
}

interface EditorialSummary {
  language: string;
  overview: string;
}

export interface Place {
  _id: string;
  editorial_summary?: EditorialSummary;
  description: string;
  format_address?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  geometry: Geometry;
  name: string;
  opening_hours: OpeningHours;
  media: string[];
  place_id: string;
  rating: number;
  ratingCount: number;
  reviews: Review[];
  types: string[];
  contributions: string[] | null;
  url: string;
  user_ratings_total: number;
  website: string;
  amenities: any[];
  userDataContributions: any[] | null;
  savedPlace: boolean;
}

export interface GooglePlaceResponse {
  html_attributions: string[];
  result: Place;
  status: string;
}

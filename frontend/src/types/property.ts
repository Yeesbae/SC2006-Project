export interface Property {
  id: number;
  owner: number; // storing owner's id
  title: string;
  property?: Listing;
  property_type?: string;
  request_type: 'new' | 'update';
  block?: string | null;           // optional as per model (blank=True, null=True)
  street_name: string;
  location: string;
  town?: string | null;            // optional
  city: string;
  zip_code?: string | null;        // optional
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet: number;
  type: string;           // use same naming as model; e.g., "HDB", "Condo", etc.
  status?: string;                  // "available", "rented", "sold", etc.
  amenities: string[];                  // more specific type if you know the structure, e.g. Record<string, boolean>
  description?: string | null;
  images?: string[];                   // not sure
  address?: string;                 // not sure
  latitude?: number | null;
  longitude?: number | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface Listing {
  id: number;
  owner: number;
  title?: string;
  status?: string;
  views: number;
  inquiries: number;
  price?: number;
  location?: string;
  images?: string[];
  request_type: 'new' | 'update';
  created_at: string;
  property?: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    username: string;
  };
  fav?: {
    images?: string[];
  };
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  property_type?: string;
  description?: string;
}
export interface MapProperty {
  id: number;
  title: string;
  price: number;
  location: string;
  coordinates: [number, number];
  image: string;
}

export interface PropertyRequest {
  id: number;
  // Optionally, if the request is linked to an existing Property,
  // include it. Otherwise, you can leave it undefined or null.
  property?: Property | null;
  user: number; // typically the user's id
  title?: string | null;
  block?: string | null;
  street_name?: string | null;
  location?: string | null;
  town?: string | null;
  city?: string | null;
  zip_code?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;
  property_type?: string | null;
  status?: string | null;
  amenities?: any;  // adjust the type if you know the structure
  description?: string | null;
  images?: string[];                   // not sure
  address?: string;                 // not sure
  latitude?: number | null;
  longitude?: number | null;
  request_type: 'new' | 'update';
  created_at?: Date | string;
}

// Define an interface for price history data for charting.
export interface PriceHistoryEntry {
  month: string; // e.g. 'May', 'Jun', etc.
  price: number;
}

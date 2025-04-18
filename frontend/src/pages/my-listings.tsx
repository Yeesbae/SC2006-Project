import { Edit, Plus, Trash2, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/auth/auth-context";
import { PropertyRequest, Listing } from "@/types/property";
// import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'; // Unused import

export function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // New state for favorites
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);

  // New state for property requests
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editedUser, setEditedUser] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || ''
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const validateSingaporePhone = (phone: string): boolean => {
    const sgPhoneRegex = /^(?:\+65|65)?[689]\d{7}$/;
    return sgPhoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // Fetch created listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/property/all/?owner=${user?.id}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const filteredListings = response.data.filter(
          (listing: Listing) => listing.owner === user.id
        );

        setListings(filteredListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to load your listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user?.id]);

  const handleListingClick = (e: React.MouseEvent, propertyId: number) => {
    const target = e.target as HTMLElement;
    if (
      !target.closest("button") &&
      !target.closest("a") &&
      !target.closest("input") &&
      !target.closest("select")
    ) {
      navigate(`/properties/${propertyId}`);
    }
  };

  // Fetch favorite properties
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setFavoritesLoading(false);
        return;
      }
      try {
        setFavoritesLoading(true);
        const response = await axios.get(
          "http://localhost:8000/account/favorite/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorite properties:", error);
        setFavoritesError("Failed to load your favorite properties");
      } finally {
        setFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  // Fetch property requests (created by this user or, if admin, all requests)
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.id) {
        setRequestsLoading(false);
        return;
      }
      try {
        setRequestsLoading(true);
        const response = await axios.get(
          "http://localhost:8000/property/requests/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setRequests(response.data);
        console.log(requests)
      } catch (error) {
        console.error("Error fetching property requests:", error);
        setRequestsError("Failed to load property requests");
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const isValidPhone = validateSingaporePhone(editedUser.phone_number);
    if (!isValidPhone) {
      setPhoneError('Invalid Singapore phone number. It must start with 6, 8, or 9 and be 8 digits.');
      setIsSaving(false);
      return;
    }
    
    try {
      const response = await axios.patch(
        `http://localhost:8000/account/update/`,
        {
          first_name: editedUser.first_name,
          last_name: editedUser.last_name,
          email: editedUser.email,
          phone_number: editedUser.phone_number,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setUser(response.data);      
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setPhoneError('Invalid data. Please check your inputs.');
        } else {
          setPhoneError('Failed to update profile. Please try again.');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border bg-white p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Please log in</h1>
          <p className="mb-6 text-gray-600">
            You need to be logged in to view your listings
          </p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* New Profile Header Section */}
      <div className="mb-8 rounded-md bg-white p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-grow">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={editedUser.first_name}
                      onChange={(e) => setEditedUser({...editedUser, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={editedUser.last_name}
                      onChange={(e) => setEditedUser({...editedUser, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Singapore Phone Number
                  </label>
                  <input
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={editedUser.phone_number}
                    onChange={(e) => {
                      setEditedUser({...editedUser, phone_number: e.target.value});
                      if (phoneError) setPhoneError(null);
                    }}
                    placeholder="e.g. +6581234567 or 91234567"
                  />
                  {editedUser.phone_number && !validateSingaporePhone(editedUser.phone_number) && (
                    <p className="mt-1 text-sm text-yellow-600">This doesn't look like a valid SG number.</p>
                  )}
                  {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must start with 6, 8, or 9 and be 8 digits long (e.g. 91234567)
                </p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.username}
                </h1>
                <p className="text-gray-600">@{user.username}</p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.is_staff && (
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      Admin
                    </span>
                  )}
                  {user.is_active && (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Email</p>
                    <p>{user.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Member since</p>
                    <p>
                      {user.date_joined 
                        ? new Date(user.date_joined).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Phone</p>
                    <p>
                      {user.phone_number 
                        ? user.phone_number.replace(/(\d{4})(\d{4})/, '$1 $2') 
                        : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Password</p>
                    <div className="flex items-center">
                      <span className="mr-2">••••••••</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {/* Add password change modal here */}}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Edit/Save Buttons */}
          <div className="flex-shrink-0 self-end md:self-center">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
            {saveSuccess && (
              <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-600">
                Profile updated successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Created Listings Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link to="/create-listing">
          <Button>
            <Plus className="mr-2 h-5 w-5" />
            Create New Listing
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">
              You haven't created any listings yet
            </p>
            <Link to="/create-listing" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Listing
              </Button>
            </Link>
          </div>
        ) : (
          listings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              onClick={(e) => handleListingClick(e, listing.id)}
            >
              <div className="relative">
                <img
                  src={listing.images?.[0]}
                  alt={listing.title}
                  className="h-48 w-full object-contain"
                />
                <div className="absolute left-2 top-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      listing.status === "active"
                        ? "bg-green-100 text-green-800"
                        : listing.status === "rented"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {listing.status ? 
                      listing.status.charAt(0).toUpperCase() + listing.status.slice(1) :
                      'Unknown'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{listing.title}</h3>
                <p className="mb-4 text-gray-600">{listing.location}</p>
                <p className="mb-4 text-2xl font-bold text-blue-600">
                  ${listing.price}/month
                </p>
                <div className="flex justify-between border-t pt-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">{listing.views}</span> views
                  </div>
                  <div>
                    <span className="font-medium">{listing.inquiries}</span>{" "}
                    inquiries
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Favorites Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-3xl font-bold">My Favorite Properties</h2>
        {favoritesLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading favorite properties...</p>
          </div>
        ) : favoritesError ? (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
            {favoritesError}
          </div>
        ) : favorites.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">
              You haven't added any properties to your favorites yet
            </p>
            <Link to="/properties" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-5 w-5" />
                Browse Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/properties/${fav.id}`)}
              >
                <div className="relative">
                  <img
                    src={fav.images?.[0]}
                    alt={fav.title}
                    className="h-48 w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 text-xl font-semibold">{fav.title}</h3>
                  <p className="mb-4 text-gray-600">{fav.location}</p>
                  <p className="mb-4 text-2xl font-bold text-blue-600">
                    ${fav.price}/month
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Section: Property Requests */}
      <div className="mt-12">
        <h2 className="mb-6 text-3xl font-bold">My Property Requests</h2>
        {requestsLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading property requests...</p>
          </div>
        ) : requestsError ? (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
            {requestsError}
          </div>
        ) : requests.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">
              You haven't created any property requests yet
            </p>
            <Link to="/create-listing" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Request
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => {
              const firstImage = req.image?.[0] || req.image;
              const imageUrl = firstImage 
                ? firstImage.startsWith('http') 
                  ? firstImage 
                  : `http://localhost:8000${firstImage}`
                : '/placeholder.jpg';
    
              return (
                <div
                  key={req.id}
                  className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                  onClick={() => navigate(`/requests/${req.id}`)}
                >
                  <div className="relative">
                    <img
                      // src={req.images && req.images[0]}
                      src={imageUrl}
                      alt={req.property?.title || req.title || "Property image"}
                      className="h-48 w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-xl font-semibold">
                      {req.title || "No title"}
                    </h3>
                    <p className="mb-4 text-gray-600">
                      {req.location || "No location"}
                    </p>
                    <p className="mb-4 text-2xl font-bold text-blue-600">
                      ${req.price ? req.price : 0}/month
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Property Update Requests */}
      <div className="mt-12">
        <h2 className="mb-6 text-3xl font-bold">Pending Edit Requests</h2>
        {requestsLoading ? (
            <div className="flex justify-center items-center h-64">
                <p>Loading edit requests...</p>
            </div>
        ) : requestsError ? (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
                {requestsError}
            </div>
        ) : requests.filter(req => req.request_type === 'update').length === 0 ? (
            <div className="col-span-full text-center py-12">
                <p className="text-gray-600">
                    You have no pending edit requests
                </p>
            </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests
              .filter((req): req is PropertyRequest => req.request_type === 'update')
              .map((req) => (
                <div
                    key={req.id}
                    className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                    onClick={() => navigate(`/requests/${req.id}`)}
                >
                  <div className="p-4">
                    <h3 className="mb-2 text-xl font-semibold">
                      Update Request for: {req.property?.title || req.title || "Unknown Property"}
                    </h3>
                    <p className="mb-4 text-gray-600">
                        Status: Pending Approval
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      Submitted on: {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

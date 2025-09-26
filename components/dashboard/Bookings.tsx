"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Mail, Phone, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/PriceDisplay";
import { BookingData } from "@/types/booking/booking-types";
import { fetchExperienceById } from "@/api/expereince/expereince-api";
import { ExperienceResponse } from "@/types/experience/experience-types";

// Function to fetch all bookings from API
const fetchAllBookings = async (): Promise<BookingData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle the actual API response structure
    if (data.success && Array.isArray(data.data)) {
      return data.data; // Return the array from data.data
    }

    return data.bookings || data || []; // Fallback for other formats
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Mock data for development - remove when API is ready
const mockBookings: BookingData[] = [];

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [experienceDetails, setExperienceDetails] = useState<{[key: string]: any}>({});

  // Fetch bookings on component mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBookings = await fetchAllBookings();

        if (fetchedBookings.length === 0) {
          // Fallback to mock data for development
          setBookings(mockBookings as BookingData[]);
          setFilteredBookings(mockBookings as BookingData[]);
        } else {
          setBookings(fetchedBookings);
          setFilteredBookings(fetchedBookings);
        }
      } catch (err) {
        setError('Failed to load bookings');
        // Fallback to mock data
        setBookings(mockBookings as BookingData[]);
        setFilteredBookings(mockBookings as BookingData[]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Fetch experience details for all bookings
  useEffect(() => {
    const fetchExperienceDetails = async () => {
      if (bookings.length === 0) return;

      const details: {[key: string]: any} = {};

      for (const booking of bookings) {
        if (booking.experienceId && !details[booking.experienceId]) {
          try {
            const experienceResponse = await fetchExperienceById(booking.experienceId);
            if (experienceResponse.success && experienceResponse.data) {
              details[booking.experienceId] = experienceResponse.data;
            }
          } catch (error) {
            console.error(`Failed to fetch experience ${booking.experienceId}:`, error);
            details[booking.experienceId] = null; // Mark as failed to avoid retry
          }
        }
      }

      setExperienceDetails(prev => ({ ...prev, ...details }));
    };

    fetchExperienceDetails();
  }, [bookings]);

  // Filter bookings based on status only
  useEffect(() => {
    // Ensure bookings is always an array
    const safeBookings = Array.isArray(bookings) ? bookings : [];
    let filtered = safeBookings;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking?.status === statusFilter);
    }

    setFilteredBookings(filtered || []);
  }, [statusFilter, bookings]);

  const getStatusBadge = (status: any) => {
    const styles = {
      confirmed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles]} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Helper function to get experience details
  const getExperienceDetails = (experienceId: string) => {
    return experienceDetails[experienceId] || null;
  };

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const BookingModal = ({ booking, onClose }: { booking: any, onClose: () => void }) => {
    if (!booking) return null;

    const experience = getExperienceDetails(booking.experienceId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <Button variant="outline" onClick={onClose}>
                ×
              </Button>
            </div>
            <p className="text-gray-600 mt-1">ID: {booking._id}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Status and Payment */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Status & Payment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">
                      <PriceDisplay amount={booking.totalAmount} />
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Experience Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">{experience?.title || `Experience ID: ${booking.experienceId}`}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {experience?.duration || 'All Day'}
                  </div>
                  {experience?.adultPrice && (
                    <div className="text-sm text-gray-600">
                      <strong>Price:</strong> Adult: <PriceDisplay amount={experience.adultPrice} />
                      {experience.childPrice && (
                        <>, Child: <PriceDisplay amount={experience.childPrice} /></>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Guest Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Primary Guest</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {booking.primaryGuest.fullName}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {booking.primaryGuest.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {booking.primaryGuest.phoneNumber}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Guest Counts</h4>
                  <div className="space-y-1 text-sm">
                    <div>Adults: {booking.adultCount}</div>
                    <div>Children: {booking.childCount}</div>
                    <div>Infants: {booking.infantCount}</div>
                  </div>
                </div>
              </div>

              {/* Additional Guests */}
              {((booking.additionalAdults && booking.additionalAdults.length > 0) ||
                (booking.children && booking.children.length > 0)) && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Additional Guests</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {booking.additionalAdults?.map((adult: any, index: any) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">Adult {index + 2}</p>
                        <p className="text-sm text-gray-600">{adult.fullName}</p>
                        {adult.phoneNumber && (
                          <p className="text-sm text-gray-600">{adult.phoneNumber}</p>
                        )}
                      </div>
                    ))}
                    {booking.children?.map((child: any, index: any) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">Child {index + 1}</p>
                        <p className="text-sm text-gray-600">{child.fullName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <span className="text-sm text-gray-600">Booking Created:</span>
                <div className="font-medium">{formatDate(booking.createdAt)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Experience Date:</span>
                <div className="font-medium">{new Date(booking.experienceDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <div className="text-sm text-gray-600">
            Total: {Array.isArray(filteredBookings) ? filteredBookings.length : 0} bookings
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredBookings) && filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{booking.primaryGuest.fullName}</div>
                      <div className="text-gray-500">{booking.primaryGuest.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 max-w-xs truncate">
                        {getExperienceDetails(booking.experienceId)?.title || booking.experienceId || 'Experience'}
                      </div>
                      <div className="text-gray-500">{getExperienceDetails(booking.experienceId)?.description?.substring(0, 50) + '...' || 'Booking'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {new Date(booking.experienceDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">All Day</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <PriceDisplay amount={booking.totalAmount} />
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.adultCount}A {booking.childCount}C {booking.infantCount}I
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBooking(booking)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!Array.isArray(filteredBookings) || filteredBookings.length === 0) && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => {
            setShowModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default Bookings;
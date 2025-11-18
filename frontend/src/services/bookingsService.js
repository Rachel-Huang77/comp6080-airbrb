import { get, post, del, put } from './api';
import { API_ENDPOINTS } from '../config';

/**
 * Get all bookings
 * @returns {Promise<Array>} Array of bookings
 */
export const getAllBookings = async () => {
  const data = await get(API_ENDPOINTS.BOOKINGS, true);
  return data.bookings || [];
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data { dateRange: {start: string, end: string}, totalPrice: number, listingId: string }
 * @returns {Promise<Object>} Created booking with bookingId
 */
export const createBooking = async (bookingData) => {
  const data = await post(API_ENDPOINTS.BOOKING_NEW, bookingData, true);
  return data;
};

/**
 * Get a specific booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export const getBookingById = async (id) => {
  const data = await get(API_ENDPOINTS.BOOKING_DETAIL(id), true);
  return data.booking || {};
};

/**
 * Delete a booking
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Response data
 */
export const deleteBooking = async (id) => {
  const data = await del(API_ENDPOINTS.BOOKING_DETAIL(id), true);
  return data;
};

/**
 * Accept a booking request
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Response data
 */
export const acceptBooking = async (id) => {
  const data = await put(API_ENDPOINTS.BOOKING_ACCEPT(id), {}, true);
  return data;
};

/**
 * Decline a booking request
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Response data
 */
export const declineBooking = async (id) => {
  const data = await put(API_ENDPOINTS.BOOKING_DECLINE(id), {}, true);
  return data;
};

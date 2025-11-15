import backendConfig from '../backend.config.json';

export const API_BASE_URL = `http://localhost:${backendConfig.BACKEND_PORT}`;

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/user/auth/register',
  LOGIN: '/user/auth/login',
  LOGOUT: '/user/auth/logout',

  // Listings
  LISTINGS: '/listings',
  LISTING_DETAIL: (id) => `/listings/${id}`,
  LISTING_NEW: '/listings/new',
  LISTING_PUBLISH: (id) => `/listings/publish/${id}`,
  LISTING_UNPUBLISH: (id) => `/listings/unpublish/${id}`,
  LISTING_REVIEW: (id, bookingId) => `/listings/${id}/review/${bookingId}`,

  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_NEW: '/bookings/new',
  BOOKING_DETAIL: (id) => `/bookings/${id}`,
  BOOKING_ACCEPT: (id) => `/bookings/accept/${id}`,
  BOOKING_DECLINE: (id) => `/bookings/decline/${id}`,
};

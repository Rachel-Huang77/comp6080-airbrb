/**
 * Listing utility functions
 * Helper functions for extracting and calculating listing data
 */

/**
 * Calculate total beds from bedrooms array
 * Handles cases where metadata.beds is missing or undefined
 * @param {Object} listing - Listing object
 * @returns {number} Total number of beds
 */
export const calculateTotalBeds = (listing) => {
  if (!listing || !listing.metadata) return 0;

  // If beds field exists, use it directly
  if (typeof listing.metadata.beds === 'number') {
    return listing.metadata.beds;
  }

  // Otherwise, calculate from bedrooms array
  if (Array.isArray(listing.metadata.bedrooms)) {
    return listing.metadata.bedrooms.reduce(
      (sum, bedroom) => sum + (Number(bedroom.beds) || 0),
      0
    );
  }

  return 0;
};

/**
 * Get number of bathrooms from listing
 * @param {Object} listing - Listing object
 * @returns {number} Number of bathrooms
 */
export const getBathrooms = (listing) => {
  if (!listing || !listing.metadata) return 0;
  return Number(listing.metadata.bathrooms) || 0;
};

/**
 * Get property type from listing
 * @param {Object} listing - Listing object
 * @returns {string} Property type
 */
export const getPropertyType = (listing) => {
  if (!listing || !listing.metadata) return 'Property';
  return listing.metadata.propertyType || 'Property';
};

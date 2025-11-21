import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  TextField,
  Divider,
  ImageList,
  ImageListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getListingById, leaveReview } from '../services/listingsService';
import { createBooking, getAllBookings } from '../services/bookingsService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import RatingBreakdown from '../components/common/RatingBreakdown';
import ReviewsByRating from '../components/common/ReviewsByRating';
import ReviewDialog from '../components/listing/ReviewDialog';
import { calculateTotalBeds, getBathrooms, getPropertyType } from '../utils/listingUtils';

// Check if a URL is a YouTube embed URL
const isYouTubeUrl = (url) => {
  return url && url.includes('youtube.com/embed/');
};

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userEmail } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]);

  // Booking form states
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Selected image for modal view
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialog, setImageDialog] = useState(false);

  // Reviews by rating dialog state
  const [reviewsDialog, setReviewsDialog] = useState({
    open: false,
    rating: 0,
  });

  // Review dialog state (Feature 2.4.3)
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    bookingId: null,
  });

  // Fetch listing data on mount
  useEffect(() => {
    fetchListingData();
    if (isLoggedIn) {
      fetchMyBookings();
    }
  }, [id, isLoggedIn]);

  const fetchListingData = async () => {
    setLoading(true);
    try {
      const data = await getListingById(id);
      setListing(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch listing details',
        severity: 'error',
      });
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const bookings = await getAllBookings();
      // Filter bookings for this listing by current user
      const relevantBookings = bookings.filter(
        (booking) => booking.listingId === id && booking.owner === userEmail
      );
      setMyBookings(relevantBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / reviews.length;
  };

  // Calculate number of nights
  const calculateNights = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!listing || !checkIn || !checkOut) return 0;
    const nights = calculateNights(checkIn, checkOut);
    return nights * listing.price;
  };

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!checkIn || !checkOut) {
      setSnackbar({
        open: true,
        message: 'Please select both check-in and check-out dates',
        severity: 'error',
      });
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (startDate >= endDate) {
      setSnackbar({
        open: true,
        message: 'Check-out date must be after check-in date',
        severity: 'error',
      });
      return;
    }

    try {
      const bookingData = {
        dateRange: {
          start: checkIn,
          end: checkOut,
        },
        totalPrice: calculateTotalPrice(),
        listingId: id,
      };

      await createBooking(bookingData);

      setSnackbar({
        open: true,
        message: 'Booking request submitted successfully!',
        severity: 'success',
      });

      // Reset form
      setCheckIn('');
      setCheckOut('');
      setBookingDialog(false);

      // Refresh bookings
      if (isLoggedIn) {
        fetchMyBookings();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create booking',
        severity: 'error',
      });
    }
  };

  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageDialog(true);
  };

  // Handle star rating click
  const handleStarClick = (rating) => {
    setReviewsDialog({
      open: true,
      rating,
    });
  };

  // Handle leave review button click (Feature 2.4.3)
  const handleLeaveReviewClick = (bookingId) => {
    setReviewDialog({
      open: true,
      bookingId,
    });
  };

  // Handle submit review (Feature 2.4.3)
  const handleSubmitReview = async (reviewData) => {
    try {
      await leaveReview(id, reviewDialog.bookingId, reviewData);

      setSnackbar({
        open: true,
        message: 'Review submitted successfully!',
        severity: 'success',
      });

      // Refresh listing data to show new review
      await fetchListingData();
    } catch (error) {
      throw new Error(error.message || 'Failed to submit review');
    }
  };

  // Format address as string
  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    const { street, city, state, postcode, country } = address;
    return `${street}, ${city}, ${state} ${postcode}, ${country}`;
  };

  // Get booking status chip
  const getBookingStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'warning' },
      accepted: { label: 'Accepted', color: 'success' },
      declined: { label: 'Declined', color: 'error' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!listing) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Listing not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Listings
        </Button>
      </Container>
    );
  }

  const avgRating = calculateAverageRating(listing.reviews);
  const numReviews = listing.reviews ? listing.reviews.length : 0;
  const metadata = listing.metadata || {};
  const allImages = [listing.thumbnail, ...(metadata.images || [])].filter(Boolean);

  // Calculate property details using utility functions
  const totalBeds = calculateTotalBeds(listing);
  const numBedrooms = metadata.bedrooms?.length || 0;
  const numBathrooms = getBathrooms(listing);
  const propertyType = getPropertyType(listing);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Listings
        </Button>

        {/* Title and Rating */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {listing.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <StarRating rating={avgRating} size="medium" />
            <Typography variant="body1" fontWeight="bold">
              {avgRating > 0 ? avgRating.toFixed(1) : 'No rating'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="action" />
            <Typography variant="body1" color="text.secondary">
              {formatAddress(listing.address)}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Images and Details */}
          <Grid item xs={12} md={8}>
            {/* Image Gallery */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Property Photos & Videos
              </Typography>
              <ImageList cols={2} gap={8} sx={{ maxHeight: 500 }}>
                {allImages.map((image, index) => (
                  <ImageListItem
                    key={index}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(image)}
                  >
                    {isYouTubeUrl(image) ? (
                      <Box sx={{ position: 'relative', height: 200, backgroundColor: '#000' }}>
                        <iframe
                          width="100%"
                          height="200"
                          src={image}
                          title={`Property video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ display: 'block' }}
                        />
                      </Box>
                    ) : (
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        loading="lazy"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>

            {/* Property Details */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Property Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={propertyType} />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BedIcon color="action" />
                    <Typography>
                      {totalBeds} {totalBeds === 1 ? 'bed' : 'beds'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{numBedrooms} {numBedrooms === 1 ? 'bedroom' : 'bedrooms'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BathtubIcon color="action" />
                    <Typography>
                      {numBathrooms} {numBathrooms === 1 ? 'bath' : 'baths'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Amenities */}
            {metadata.amenities && metadata.amenities.length > 0 && (
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Amenities
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {metadata.amenities.map((amenity, index) => (
                    <Chip key={index} label={amenity} variant="outlined" />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Reviews and Rating Breakdown */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reviews & Ratings
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Rating Breakdown Component (Feature 2.4.4) */}
              <RatingBreakdown
                reviews={listing.reviews || []}
                onStarClick={handleStarClick}
              />

              <Divider sx={{ my: 3 }} />

              {/* All Reviews List */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                All Reviews
              </Typography>
              {listing.reviews && listing.reviews.length > 0 ? (
                <List>
                  {listing.reviews.map((review, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <StarRating rating={review.rating} size="small" />
                            <Typography variant="body2" fontWeight="bold">
                              {review.rating}/5
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">
                              {review.comment}
                            </Typography>
                            {review.owner && (
                              <Typography variant="caption" color="text.secondary">
                                by {review.owner}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews yet
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Booking Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                ${listing.price}
                <Typography component="span" variant="body1" color="text.secondary">
                  {' '}
                  / night
                </Typography>
              </Typography>

              <Divider sx={{ my: 2 }} />

              {isLoggedIn ? (
                <>
                  {/* Booking Form */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Make a Booking
                    </Typography>

                    <TextField
                      fullWidth
                      label="Check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                    />

                    {checkIn && checkOut && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {calculateNights(checkIn, checkOut)} nights
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          Total: ${calculateTotalPrice()}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => setBookingDialog(true)}
                      disabled={!checkIn || !checkOut}
                    >
                      Request to Book
                    </Button>
                  </Box>

                  {/* My Bookings */}
                  {myBookings.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        My Bookings
                      </Typography>
                      <List dense>
                        {myBookings.map((booking, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              py: 1.5,
                            }}
                          >
                            <ListItemText
                              primary={`${booking.dateRange.start} to ${booking.dateRange.end}`}
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  {getBookingStatusChip(booking.status)}
                                </Box>
                              }
                            />
                            {/* Feature 2.4.3: Leave Review button for accepted bookings */}
                            {booking.status === 'accepted' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleLeaveReviewClick(booking.id)}
                                sx={{ mt: 1 }}
                              >
                                Leave Review
                              </Button>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Please log in to make a booking
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login', { state: { from: location.pathname } })}
                    sx={{ mt: 2 }}
                  >
                    Log In
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Review your booking details:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Check-in:</strong> {checkIn}
            </Typography>
            <Typography variant="body2">
              <strong>Check-out:</strong> {checkOut}
            </Typography>
            <Typography variant="body2">
              <strong>Nights:</strong> {calculateNights(checkIn, checkOut)}
            </Typography>
            <Typography variant="body2">
              <strong>Total Price:</strong> ${calculateTotalPrice()}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBookingSubmit}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image/Video View Dialog */}
      <Dialog
        open={imageDialog}
        onClose={() => setImageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {isYouTubeUrl(selectedImage) ? (
            <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000' }}>
              <iframe
                src={selectedImage}
                title="Property video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          ) : (
            <img
              src={selectedImage}
              alt="Property"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reviews by Rating Dialog (Feature 2.4.4) */}
      <ReviewsByRating
        open={reviewsDialog.open}
        onClose={() => setReviewsDialog({ open: false, rating: 0 })}
        rating={reviewsDialog.rating}
        reviews={listing?.reviews || []}
      />

      {/* Review Dialog (Feature 2.4.3) */}
      <ReviewDialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, bookingId: null })}
        onSubmit={handleSubmitReview}
        listingTitle={listing?.title || ''}
      />

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ListingDetailPage;

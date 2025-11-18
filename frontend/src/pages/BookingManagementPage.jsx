import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getListingById } from '../services/listingsService';
import { getAllBookings, acceptBooking, declineBooking } from '../services/bookingsService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookingManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    bookingId: null,
    action: null, // 'accept' or 'decline'
    bookingInfo: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listingData, allBookings] = await Promise.all([
        getListingById(id),
        getAllBookings(),
      ]);

      setListing(listingData);

      // Filter bookings for this listing
      const listingBookings = allBookings.filter((booking) => booking.listingId === id);
      setBookings(listingBookings);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate how long the listing has been online
  const calculateDaysOnline = () => {
    if (!listing || !listing.postedOn) return 0;
    const postedDate = new Date(listing.postedOn);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate days booked this year (only accepted bookings)
  const calculateDaysBookedThisYear = () => {
    const currentYear = new Date().getFullYear();
    let totalDays = 0;

    bookings.forEach((booking) => {
      if (booking.status === 'accepted') {
        const startDate = new Date(booking.dateRange.start);
        const endDate = new Date(booking.dateRange.end);

        // Check if booking falls within this year
        if (startDate.getFullYear() <= currentYear && endDate.getFullYear() >= currentYear) {
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalDays += diffDays;
        }
      }
    });

    return totalDays;
  };

  // Calculate profit this year (only accepted bookings)
  const calculateProfitThisYear = () => {
    const currentYear = new Date().getFullYear();
    let totalProfit = 0;

    bookings.forEach((booking) => {
      if (booking.status === 'accepted') {
        const startDate = new Date(booking.dateRange.start);
        const endDate = new Date(booking.dateRange.end);

        // Check if booking falls within this year
        if (startDate.getFullYear() <= currentYear && endDate.getFullYear() >= currentYear) {
          totalProfit += booking.totalPrice || 0;
        }
      }
    });

    return totalProfit;
  };

  // Handle accept/decline booking
  const handleBookingAction = (bookingId, action, dateRange) => {
    const dateInfo = `${dateRange.start} to ${dateRange.end}`;
    setConfirmDialog({
      open: true,
      bookingId,
      action,
      bookingInfo: dateInfo,
    });
  };

  const handleConfirmAction = async () => {
    const { bookingId, action } = confirmDialog;

    try {
      if (action === 'accept') {
        await acceptBooking(bookingId);
        setSnackbar({
          open: true,
          message: 'Booking accepted successfully',
          severity: 'success',
        });
      } else if (action === 'decline') {
        await declineBooking(bookingId);
        setSnackbar({
          open: true,
          message: 'Booking declined successfully',
          severity: 'success',
        });
      }

      // Refresh bookings
      await fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || `Failed to ${action} booking`,
        severity: 'error',
      });
    } finally {
      setConfirmDialog({ open: false, bookingId: null, action: null, bookingInfo: '' });
    }
  };

  const handleCancelAction = () => {
    setConfirmDialog({ open: false, bookingId: null, action: null, bookingInfo: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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

  // Separate pending and historical bookings
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const historicalBookings = bookings.filter((b) => b.status !== 'pending');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!listing) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Listing not found</Typography>
        <Button onClick={() => navigate('/my-listings')} sx={{ mt: 2 }}>
          Back to My Listings
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/my-listings')}
          sx={{ mb: 2 }}
        >
          Back to My Listings
        </Button>

        {/* Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Booking Management: {listing.title}
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarMonthIcon color="primary" />
                  <Typography variant="h6">{calculateDaysOnline()}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Days Online
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarMonthIcon color="success" />
                  <Typography variant="h6">{calculateDaysBookedThisYear()}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Days Booked This Year
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AttachMoneyIcon color="success" />
                  <Typography variant="h6">${calculateProfitThisYear()}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Profit This Year
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6">{bookings.length}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Total Requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Booking Requests */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pending Booking Requests ({pendingBookings.length})
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {pendingBookings.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No pending booking requests
            </Typography>
          ) : (
            <List>
              {pendingBookings.map((booking) => (
                <ListItem
                  key={booking.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {booking.dateRange.start} to {booking.dateRange.end}
                        </Typography>
                        {getBookingStatusChip(booking.status)}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Guest: {booking.owner}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Price: ${booking.totalPrice}
                        </Typography>
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="success"
                      onClick={() => handleBookingAction(booking.id, 'accept', booking.dateRange)}
                      aria-label="Accept booking"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleBookingAction(booking.id, 'decline', booking.dateRange)}
                      aria-label="Decline booking"
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Booking History */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Booking History ({historicalBookings.length})
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {historicalBookings.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No booking history yet
            </Typography>
          ) : (
            <List>
              {historicalBookings.map((booking) => (
                <ListItem
                  key={booking.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {booking.dateRange.start} to {booking.dateRange.end}
                        </Typography>
                        {getBookingStatusChip(booking.status)}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Guest: {booking.owner}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Price: ${booking.totalPrice}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCancelAction}>
        <DialogTitle>
          {confirmDialog.action === 'accept' ? 'Accept Booking' : 'Decline Booking'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmDialog.action} the booking for{' '}
            <strong>{confirmDialog.bookingInfo}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmDialog.action === 'accept' ? 'success' : 'error'}
            variant="contained"
            autoFocus
          >
            {confirmDialog.action === 'accept' ? 'Accept' : 'Decline'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingManagementPage;

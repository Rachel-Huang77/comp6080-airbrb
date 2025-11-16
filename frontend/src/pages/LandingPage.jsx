import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import { getAllListings } from '../services/listingsService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';

const LandingPage = () => {
  const navigate = useNavigate();

  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchText, setSearchText] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxBedrooms, setMaxBedrooms] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortRating, setSortRating] = useState('none'); // 'none', 'high-low', 'low-high'

  // Fetch all listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const listings = await getAllListings();

      // Filter to only published listings
      const publishedListings = listings.filter((listing) => listing.published);

      setAllListings(publishedListings);
      setFilteredListings(publishedListings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setAllListings([]);
      setFilteredListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / reviews.length;
  };

  // Sort listings based on bookings and alphabetical order
  const sortListingsByBookings = (listings) => {
    // For now, just sort alphabetically by title
    // TODO: Implement booking-based sorting when booking system is implemented
    return [...listings].sort((a, b) => a.title.localeCompare(b.title));
  };

  // Apply search and filters
  const handleSearch = () => {
    let results = [...allListings];

    // Text search (title or city)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      results = results.filter((listing) => {
        const titleMatch = listing.title.toLowerCase().includes(searchLower);
        const cityMatch = listing.address?.city?.toLowerCase().includes(searchLower) || false;
        return titleMatch || cityMatch;
      });
    }

    // Bedroom filter
    if (minBedrooms !== '' || maxBedrooms !== '') {
      results = results.filter((listing) => {
        const bedroomCount = listing.metadata?.bedrooms?.length || 0;
        const meetsMin = minBedrooms === '' || bedroomCount >= parseInt(minBedrooms);
        const meetsMax = maxBedrooms === '' || bedroomCount <= parseInt(maxBedrooms);
        return meetsMin && meetsMax;
      });
    }

    // Date range filter
    if (startDate && endDate) {
      const searchStart = new Date(startDate);
      const searchEnd = new Date(endDate);

      results = results.filter((listing) => {
        if (!listing.availability || listing.availability.length === 0) {
          return false;
        }

        // Check if any availability range covers the entire search range
        return listing.availability.some((range) => {
          const availStart = new Date(range.start);
          const availEnd = new Date(range.end);
          return availStart <= searchStart && availEnd >= searchEnd;
        });
      });
    }

    // Price filter
    if (minPrice !== '' || maxPrice !== '') {
      results = results.filter((listing) => {
        const price = listing.price || 0;
        const meetsMin = minPrice === '' || price >= parseFloat(minPrice);
        const meetsMax = maxPrice === '' || price <= parseFloat(maxPrice);
        return meetsMin && meetsMax;
      });
    }

    // Sort by rating
    if (sortRating === 'high-low') {
      results = results.sort((a, b) => {
        const ratingA = calculateAverageRating(a.reviews);
        const ratingB = calculateAverageRating(b.reviews);
        return ratingB - ratingA; // Descending
      });
    } else if (sortRating === 'low-high') {
      results = results.sort((a, b) => {
        const ratingA = calculateAverageRating(a.reviews);
        const ratingB = calculateAverageRating(b.reviews);
        return ratingA - ratingB; // Ascending
      });
    } else {
      // Default alphabetical sorting by title
      results = sortListingsByBookings(results);
    }

    setFilteredListings(results);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchText('');
    setMinBedrooms('');
    setMaxBedrooms('');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setSortRating('none');
    setFilteredListings(sortListingsByBookings(allListings));
  };

  // Handle listing click
  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Explore Listings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Discover your perfect stay from our collection of published properties
      </Typography>

      {/* Search and Filter Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Search & Filters
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {/* Text Search */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search by title or city"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="e.g. Beach House, Sydney"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Rating Sort */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Sort by Rating</InputLabel>
              <Select
                value={sortRating}
                onChange={(e) => setSortRating(e.target.value)}
                label="Sort by Rating"
              >
                <MenuItem value="none">Default (Alphabetical)</MenuItem>
                <MenuItem value="high-low">Highest to Lowest</MenuItem>
                <MenuItem value="low-high">Lowest to Highest</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Bedroom Filter */}
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Min Bedrooms"
              type="number"
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Max Bedrooms"
              type="number"
              value={maxBedrooms}
              onChange={(e) => setMaxBedrooms(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Price Filter */}
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>

          {/* Date Range Filter */}
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Check-in"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Check-out"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
              <Button fullWidth variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
        </Typography>
      </Box>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No listings found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or filters
          </Typography>
          <Button variant="contained" onClick={handleReset}>
            Clear Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredListings.map((listing) => {
            const avgRating = calculateAverageRating(listing.reviews);
            const numReviews = listing.reviews ? listing.reviews.length : 0;
            const metadata = listing.metadata || {};
            const propertyType = metadata.propertyType || 'Property';
            const numBeds = metadata.beds || 0;
            const numBathrooms = metadata.bathrooms || 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleListingClick(listing.id)}>
                    {/* Thumbnail */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={listing.thumbnail || '/placeholder-image.jpg'}
                      alt={listing.title}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Title */}
                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {listing.title}
                      </Typography>

                      {/* Property Type */}
                      <Chip label={propertyType} size="small" sx={{ mb: 1 }} />

                      {/* Beds and Bathrooms */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BedIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {numBeds} {numBeds === 1 ? 'bed' : 'beds'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BathtubIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {numBathrooms} {numBathrooms === 1 ? 'bath' : 'baths'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Rating and Reviews */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <StarRating rating={avgRating} size="small" />
                        <Typography variant="body2" fontWeight="bold">
                          {avgRating > 0 ? avgRating.toFixed(1) : 'No rating'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
                        </Typography>
                      </Box>

                      {/* Price */}
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${listing.price}
                        <Typography component="span" variant="body2" color="text.secondary">
                          {' '}
                          / night
                        </Typography>
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default LandingPage;

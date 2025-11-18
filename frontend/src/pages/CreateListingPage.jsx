import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createListing } from '../services/listingsService';

const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Condo',
  'Townhouse',
  'Villa',
  'Studio',
  'Other',
];

const BEDROOM_TYPES = [
  'Master Bedroom',
  'Single Bedroom',
  'Shared Bedroom',
  'Guest Bedroom',
  'Children\'s Bedroom',
];

const COMMON_AMENITIES = [
  'WiFi',
  'Kitchen',
  'Washing Machine',
  'Dryer',
  'Air Conditioning',
  'Heating',
  'TV',
  'Parking',
  'Pool',
  'Gym',
  'Elevator',
  'Pet Friendly',
];

// Helper function to extract YouTube video ID and convert to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  // Match various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  // If it's already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  return null;
};

const CreateListingPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    price: '',
    thumbnail: '',
    youtubeUrl: '',
    propertyType: '',
    bathrooms: '',
  });

  const [bedrooms, setBedrooms] = useState([
    { type: 'Master Bedroom', beds: 1 },
  ]);

  const [amenities, setAmenities] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle bedroom changes
  const handleBedroomChange = (index, field, value) => {
    const newBedrooms = [...bedrooms];
    newBedrooms[index][field] = value;
    setBedrooms(newBedrooms);
  };

  // Add new bedroom
  const addBedroom = () => {
    setBedrooms([...bedrooms, { type: 'Single Bedroom', beds: 1 }]);
  };

  // Remove bedroom
  const removeBedroom = (index) => {
    if (bedrooms.length > 1) {
      const newBedrooms = bedrooms.filter((_, i) => i !== index);
      setBedrooms(newBedrooms);
    }
  };

  // Handle amenities toggle
  const handleAmenityToggle = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size must be less than 5MB',
          severity: 'error',
        });
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    if (!formData.bathrooms || Number(formData.bathrooms) <= 0) {
      newErrors.bathrooms = 'Number of bathrooms must be at least 1';
    }

    // Validate bedrooms
    if (bedrooms.length === 0) {
      newErrors.bedrooms = 'At least one bedroom is required';
    } else {
      bedrooms.forEach((bedroom, index) => {
        if (!bedroom.beds || Number(bedroom.beds) <= 0) {
          newErrors.bedrooms = `Bedroom ${index + 1} must have at least 1 bed`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      // Determine thumbnail: YouTube URL takes priority over image
      let thumbnailValue = formData.thumbnail || '/placeholder-image.jpg';
      if (formData.youtubeUrl.trim()) {
        const embedUrl = getYouTubeEmbedUrl(formData.youtubeUrl.trim());
        if (embedUrl) {
          thumbnailValue = embedUrl;
        }
      }

      // Prepare listing data
      const listingData = {
        title: formData.title.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postcode: formData.postcode.trim(),
          country: formData.country.trim(),
        },
        price: Number(formData.price),
        thumbnail: thumbnailValue,
        metadata: {
          propertyType: formData.propertyType,
          bathrooms: Number(formData.bathrooms),
          bedrooms: bedrooms.map((bedroom) => ({
            type: bedroom.type,
            beds: Number(bedroom.beds),
          })),
          amenities,
          beds: bedrooms.reduce((sum, bedroom) => sum + Number(bedroom.beds), 0),
        },
      };

      await createListing(listingData);

      setSnackbar({
        open: true,
        message: 'Listing created successfully!',
        severity: 'success',
      });

      // Redirect to hosted listings page after short delay
      setTimeout(() => {
        navigate('/my-listings');
      }, 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create listing',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate('/my-listings')}
              sx={{ mr: 2 }}
              aria-label="Go back to my listings"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Create New Listing
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal" error={Boolean(errors.propertyType)} required>
              <InputLabel>Property Type</InputLabel>
              <Select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                label="Property Type"
              >
                {PROPERTY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.propertyType && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {errors.propertyType}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Price per Night"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={Boolean(errors.price)}
              helperText={errors.price}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />

            {/* Address */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Address
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={handleChange}
              error={Boolean(errors.street)}
              helperText={errors.street}
              margin="normal"
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={Boolean(errors.state)}
                  helperText={errors.state}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  error={Boolean(errors.postcode)}
                  helperText={errors.postcode}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  error={Boolean(errors.country)}
                  helperText={errors.country}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>

            {/* Property Details */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Property Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Number of Bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              error={Boolean(errors.bathrooms)}
              helperText={errors.bathrooms}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />

            {/* Bedrooms */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Bedrooms *
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addBedroom}
                  aria-label="Add bedroom"
                >
                  Add Bedroom
                </Button>
              </Box>

              {bedrooms.map((bedroom, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2">Bedroom {index + 1}</Typography>
                    {bedrooms.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeBedroom(index)}
                        color="error"
                        aria-label={`Remove bedroom ${index + 1}`}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Bedroom Type</InputLabel>
                        <Select
                          value={bedroom.type}
                          onChange={(e) => handleBedroomChange(index, 'type', e.target.value)}
                          label="Bedroom Type"
                        >
                          {BEDROOM_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Number of Beds"
                        type="number"
                        value={bedroom.beds}
                        onChange={(e) => handleBedroomChange(index, 'beds', e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}

              {errors.bedrooms && (
                <Typography variant="caption" color="error">
                  {errors.bedrooms}
                </Typography>
              )}
            </Box>

            {/* Amenities */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
              Amenities
            </Typography>
            <FormGroup>
              <Grid container>
                {COMMON_AMENITIES.map((amenity) => (
                  <Grid item xs={12} sm={6} md={4} key={amenity}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                      }
                      label={amenity}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>

            {/* Thumbnail */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Thumbnail
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose either an image upload or a YouTube video URL (YouTube URL takes priority)
            </Typography>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Thumbnail Image (Max 5MB)
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleThumbnailUpload}
              />
            </Button>

            <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
              OR
            </Typography>

            <TextField
              fullWidth
              label="YouTube Video URL"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              helperText="Paste a YouTube video URL to use as listing thumbnail"
              margin="normal"
            />

            {/* Preview */}
            {formData.youtubeUrl && getYouTubeEmbedUrl(formData.youtubeUrl) && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  YouTube Video Preview:
                </Typography>
                <iframe
                  width="100%"
                  height="300"
                  src={getYouTubeEmbedUrl(formData.youtubeUrl)}
                  title="YouTube video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '8px' }}
                />
              </Box>
            )}

            {!formData.youtubeUrl && formData.thumbnail && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Image Preview:
                </Typography>
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                />
              </Box>
            )}

            {/* Submit Button */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/my-listings')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default CreateListingPage;

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating,
  Alert,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

/**
 * ReviewDialog Component
 * Dialog for submitting reviews for a listing (Feature 2.4.3)
 * @param {Object} props - Component props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close dialog callback
 * @param {Function} props.onSubmit - Submit review callback
 * @param {string} props.listingTitle - Listing title for display
 */
const ReviewDialog = ({ open, onClose, onSubmit, listingTitle }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validate review
  const validateReview = () => {
    if (rating === 0) {
      setError('Please select a rating (1-5 stars)');
      return false;
    }

    if (!comment.trim()) {
      setError('Please enter a comment');
      return false;
    }

    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters long');
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async () => {
    setError('');

    if (!validateReview()) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({ rating, comment: comment.trim() });
      // Reset form
      setRating(0);
      setComment('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setRating(0);
    setComment('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Share your experience with &quot;{listingTitle}&quot;
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Rating Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Rating *
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              name="review-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue || 0);
                setError(''); // Clear error when user selects rating
              }}
              size="large"
              emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
            />
            {rating > 0 && (
              <Typography variant="body2" color="text.secondary">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Comment Section */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Comment *
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Tell us about your stay..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError(''); // Clear error when user types
            }}
            inputProps={{ maxLength: 500 }}
            helperText={`${comment.length}/500 characters`}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;

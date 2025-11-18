import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarRating from './StarRating';

/**
 * ReviewsByRating Component
 * Modal dialog to show reviews filtered by specific rating
 * Feature 2.4.4 - Advanced Listing Rating Viewing
 */
const ReviewsByRating = ({ open, onClose, rating, reviews = [] }) => {
  // Filter reviews by the selected rating
  const filteredReviews = reviews.filter((review) => {
    const roundedRating = Math.round(review.rating);
    return roundedRating === rating;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="reviews-by-rating-title"
    >
      <DialogTitle id="reviews-by-rating-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="span">
            {rating}
          </Typography>
          <StarIcon sx={{ color: '#FFD700' }} />
          <Typography variant="h6" component="span">
            Reviews
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {filteredReviews.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No reviews with this rating yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredReviews.map((review, index) => (
              <Box key={index}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ mb: 1 }}>
                        <StarRating rating={review.rating} size="small" />
                        <Typography
                          variant="body2"
                          component="span"
                          fontWeight="bold"
                          sx={{ ml: 1 }}
                        >
                          {review.rating}/5
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body1" color="text.primary" paragraph>
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
                {index < filteredReviews.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewsByRating;

import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarRating from './StarRating';

/**
 * RatingBreakdown Component
 * Displays a breakdown of ratings with tooltips and clickable stars
 * Feature 2.4.4 - Advanced Listing Rating Viewing
 */
const RatingBreakdown = ({ reviews = [], onStarClick }) => {
  // Calculate rating breakdown
  const getRatingBreakdown = () => {
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        breakdown[rating]++;
      }
    });

    return breakdown;
  };

  const breakdown = getRatingBreakdown();
  const totalReviews = reviews.length;

  // Calculate average rating
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
    : 0;

  // Get percentage for a rating
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Overall Rating Display */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h3" fontWeight="bold">
          {totalReviews > 0 ? averageRating.toFixed(1) : 'N/A'}
        </Typography>
        <Box>
          <StarRating rating={averageRating} size="medium" />
          <Typography variant="body2" color="text.secondary">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </Typography>
        </Box>
      </Box>

      {/* Rating Breakdown Bars */}
      <Box sx={{ width: '100%' }}>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = breakdown[rating];
          const percentage = getPercentage(count);

          return (
            <Tooltip
              key={rating}
              title={
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="body2">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {count} {count === 1 ? 'review' : 'reviews'} ({percentage.toFixed(1)}%)
                  </Typography>
                </Box>
              }
              placement="left"
              arrow
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  cursor: totalReviews > 0 && count > 0 ? 'pointer' : 'default',
                  '&:hover': totalReviews > 0 && count > 0 ? {
                    backgroundColor: 'action.hover',
                    borderRadius: 1,
                    p: 0.5,
                    ml: -0.5,
                  } : {},
                }}
                onClick={() => {
                  if (totalReviews > 0 && count > 0 && onStarClick) {
                    onStarClick(rating);
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                  <Typography variant="body2" sx={{ mr: 0.5 }}>
                    {rating}
                  </Typography>
                  <StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FFD700',
                      },
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                  {count}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {totalReviews > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Click on a star rating to view those reviews
        </Typography>
      )}
    </Box>
  );
};

export default RatingBreakdown;

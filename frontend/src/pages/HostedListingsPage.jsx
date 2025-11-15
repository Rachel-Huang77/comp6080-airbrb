import { Container, Typography } from '@mui/material';

const HostedListingsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Hosted Listings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Coming soon...
      </Typography>
    </Container>
  );
};

export default HostedListingsPage;

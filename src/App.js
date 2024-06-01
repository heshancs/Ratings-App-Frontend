import React, { useState, useEffect } from 'react';
import RatingForm from './components/RatingForm';
import RatingList from './components/RatingList';
import { fetchRatings, fetchAverageRating } from './api';
import { Container, Typography, Box, Select, MenuItem, CircularProgress, Alert } from '@mui/material';

const App = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRatings = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedRatings = await fetchRatings(sortOrder);
        setRatings(fetchedRatings);
        const averageRatingData = await fetchAverageRating();
        setAverageRating(averageRatingData.avg);
      } catch (error) {
        setError('Failed to fetch ratings');
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [sortOrder]);

  const handleNewRating = (newRating) => {
    const updatedRatings = [newRating, ...ratings];
    setRatings(updatedRatings);
    const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0);
    setAverageRating(totalRating / updatedRatings.length);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Rating App
        </Typography>
        <Typography variant="h6" gutterBottom>
          Average Rating: {parseFloat(averageRating).toFixed(2)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Sort by Rating:
        </Typography>
        <Select value={sortOrder} onChange={handleSortChange}>
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="lowToHigh">Low to High</MenuItem>
          <MenuItem value="highToLow">High to Low</MenuItem>
        </Select>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <>
            <RatingForm onNewRating={handleNewRating} />
            <RatingList ratings={ratings} sortOrder={sortOrder} />
          </>
        )}
      </Box>
    </Container>
  );
};

export default App;

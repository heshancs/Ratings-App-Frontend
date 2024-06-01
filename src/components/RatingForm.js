import React, { useState } from 'react';
import { Rating, TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { addRating } from '../api';

const RatingForm = ({ onNewRating }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newRating = await addRating(rating, comment);
      onNewRating(newRating);
      setRating(0);
      setComment('');
    } catch (error) {
      setError('Failed to submit rating. Please try again.');
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit Your Rating
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Rating
        name="rating"
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
      />
      <TextField
        fullWidth
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>
    </Box>
  );
};

export default RatingForm;

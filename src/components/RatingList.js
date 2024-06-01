import React, { useEffect, useState } from 'react';
import { Rating, Box, Typography, List, ListItem, ListItemText, Divider, Grid, CircularProgress, Alert } from '@mui/material';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const RatingList = ({ ratings, sortOrder }) => {
  const [chartData, setChartData] = useState(null);
  const [sortedRatings, setSortedRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    setLoading(true);
    setError(null);

    if (!ratings || ratings.length === 0) {
      setChartData(null);
      setSortedRatings([]);
      setLoading(false);
      return;
    }

    const sortedByDate = [...ratings].sort((a, b) => a.created_at - b.created_at);
    setSortedRatings(sortedByDate);

    const sortAverageRatings = (sortBy, averageRatings) => {
      if (sortBy === 'lowToHigh') {
        return averageRatings.sort((a, b) => a.avgRating - b.avgRating);
      } else if (sortBy === 'highToLow') {
        return averageRatings.sort((a, b) => b.avgRating - a.avgRating);
      } else {
        // Default case: sort by avgRating in descending order
        return averageRatings.sort((a, b) => b.date - a.date);
      }
    };


    const ratingsByDate = sortedByDate.reduce((acc, rating) => {
      const date = formatDate(rating.created_at);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(rating.rating);
      return acc;
    }, {});

    const dates = Object.keys(ratingsByDate);
    const averageRatings = dates.map((date) => ({
      date,
      avgRating: ratingsByDate[date].reduce((acc, val) => acc + val, 0) / ratingsByDate[date].length,
    }));

    const sortedAverageRatings = sortAverageRatings(sortOrder, averageRatings);

    setChartData({
      labels: sortedAverageRatings.map((data) => data.date),
      datasets: [
        {
          label: 'Average Rating',
          data: sortedAverageRatings.map((data) => data.avgRating),
          fill: false,
          borderColor: '#3f51b5',
          tension: 0.4,
        },
      ],
    });
    setLoading(false);
  }, [ratings, sortOrder]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ratings
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : sortedRatings && sortedRatings.length > 0 ? (
            <List>
              {sortedRatings.map((rating) => (
                <React.Fragment key={rating.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Rating value={rating.rating} readOnly />
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                            {formatDate(rating.created_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={rating.comment}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No ratings available.
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ mt: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : chartData ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No chart data available.
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default RatingList;
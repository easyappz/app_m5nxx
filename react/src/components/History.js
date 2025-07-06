import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Divider } from '@mui/material';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/calculations');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="body1" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: '#212121', borderRadius: 2, maxHeight: '400px', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom color="white">
        Calculation History
      </Typography>
      <Divider sx={{ backgroundColor: '#333', marginBottom: 2 }} />
      {history.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ color: '#aaa' }}>
          No calculations yet.
        </Typography>
      ) : (
        <List>
          {history.map((calc, index) => (
            <ListItem key={calc._id} sx={{ padding: 1, borderBottom: index < history.length - 1 ? '1px solid #333' : 'none' }}>
              <ListItemText 
                primary={<Typography color="white">{calc.expression}</Typography>} 
                secondary={<Typography color="white" variant="body2">= {calc.result}</Typography>} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default History;

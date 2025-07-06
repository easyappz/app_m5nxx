import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

const History = () => {
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
      <Box className="history-container">
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="history-container">
        <Alert severity="error" sx={{ backgroundColor: '#3a3a3a', color: 'white' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="history-container">
      <Typography variant="h6" sx={{ color: 'white', marginBottom: '16px' }}>
        Calculation History
      </Typography>
      {history.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
          No calculations yet.
        </Typography>
      ) : (
        <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          {history.map((calc, index) => (
            <ListItem key={index} sx={{ backgroundColor: '#2d2d2d', marginBottom: '4px', borderRadius: '4px' }}>
              <ListItemText 
                primary={`${calc.expression} = ${calc.result}`} 
                secondary={new Date(calc.timestamp).toLocaleString()} 
                primaryTypographyProps={{ color: 'white' }}
                secondaryTypographyProps={{ color: '#aaa' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default History;

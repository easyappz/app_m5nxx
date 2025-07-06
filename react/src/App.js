import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';
import Calculator from './components/Calculator';
import History from './components/History';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <Box sx={{ width: '100%', maxWidth: '400px', bgcolor: '#1e1e1e', borderRadius: '16px 16px 0 0' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            sx={{ 
              '& .MuiTab-root': { color: '#aaa' },
              '& .Mui-selected': { color: 'white !important' },
              '& .MuiTabs-indicator': { backgroundColor: 'white' }
            }}
          >
            <Tab label="Calculator" />
            <Tab label="History" />
          </Tabs>
        </Box>
        {activeTab === 0 && <Calculator />}
        {activeTab === 1 && <History />}
      </div>
    </ErrorBoundary>
  );
}

export default App;

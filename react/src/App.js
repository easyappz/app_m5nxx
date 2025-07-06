import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';
import History from './components/History';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNumberClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      if (value === '.' && display.includes('.')) {
        return;
      }
      setDisplay(display + value);
    }
  };

  const handleOperationClick = (op) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setWaitingForSecondValue(true);
    setDisplay('0');
  };

  const calculateResult = async () => {
    if (!previousValue || !operation) return;

    const currentValue = parseFloat(display);
    let result = 0;

    if (operation === '+') {
      result = previousValue + currentValue;
    } else if (operation === '-') {
      result = previousValue - currentValue;
    } else if (operation === '*') {
      result = previousValue * currentValue;
    } else if (operation === '/') {
      if (currentValue === 0) {
        setDisplay('Error');
        return;
      }
      result = previousValue / currentValue;
    }

    const expression = `${previousValue} ${operation} ${currentValue}`;
    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);

    try {
      await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression, result }),
      });
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);
  };

  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '⌫', '='
  ];

  return (
    <ErrorBoundary>
      <Box sx={{ width: '100%', maxWidth: 400, margin: '20px auto' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="calculator tabs" centered>
          <Tab label="Calculator" sx={{ color: 'white' }} />
          <Tab label="History" sx={{ color: 'white' }} />
        </Tabs>
        {activeTab === 0 ? (
          <div className="calculator">
            <div className="calculator-display">{display}</div>
            <div className="calculator-buttons">
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  className={`calculator-button ${btn === '=' ? 'equals' : ''} ${['+', '-', '*', '/'].includes(btn) ? 'operation' : ''}`}
                  onClick={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '⌫') handleBackspace();
                    else if (btn === '=') calculateResult();
                    else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                    else handleNumberClick(btn);
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <History />
        )}
      </Box>
    </ErrorBoundary>
  );
}

export default App;

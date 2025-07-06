import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState('');
  const [firstOperand, setFirstOperand] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const handleNumberClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
    setWaitingForSecondOperand(false);
  };

  const handleOperationClick = (op) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setWaitingForSecondOperand(true);
      setDisplay('0');
    } else if (!waitingForSecondOperand) {
      const result = calculateResult();
      setDisplay(result.toString());
      setFirstOperand(result);
      setOperation(op);
      setWaitingForSecondOperand(true);
    } else {
      setOperation(op);
    }
  };

  const handleEqualClick = () => {
    if (firstOperand !== null && operation && !waitingForSecondOperand) {
      const result = calculateResult();
      setDisplay(result.toString());
      setFirstOperand(null);
      setOperation('');
      setWaitingForSecondOperand(false);
    }
  };

  const calculateResult = () => {
    const secondOperand = parseFloat(display);
    switch (operation) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return 0;
    }
  };

  const handleClearClick = () => {
    setDisplay('0');
    setOperation('');
    setFirstOperand(null);
    setWaitingForSecondOperand(false);
  };

  const handleBackspaceClick = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
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
    <Box className="calculator-container">
      <Box className="calculator-display">
        <Typography variant="h3" className="display-text">
          {display}
        </Typography>
      </Box>
      <Box className="calculator-buttons">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            variant="contained"
            className={`calc-button ${
              ['+', '-', '*', '/'].includes(btn) ? 'operation-btn' : btn === '=' ? 'equal-btn' : 'number-btn'
            }`}
            onClick={() => {
              if (btn === 'C') handleClearClick();
              else if (btn === '⌫') handleBackspaceClick();
              else if (btn === '=') handleEqualClick();
              else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
              else handleNumberClick(btn);
            }}
          >
            {btn}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Calculator;

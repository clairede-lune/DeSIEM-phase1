// src/components/SummaryCard.js

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SummaryCard = ({ title, value }) => {
  return (
    <Card style={{ margin: '20px', padding: '20px' }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h2">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AlertsTable = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return null; // Render nothing if there are no logs
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Event Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Severity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>{log.eventType}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{log.severity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AlertsTable;
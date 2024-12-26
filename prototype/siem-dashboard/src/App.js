// src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryCard from './components/SummaryCard';
import AlertsTable from './components/AlertsTable';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import Web3 from 'web3';
import DecentralizedSIEM from './components/DecentralizedSIEMABI.json';
import { Container, Grid as Grid2 } from '@mui/material';

const App = () => {
  const [alerts, setAlerts] = useState([]); // Initialize alerts state as an empty array
  const [criticalAlertCount, setCriticalAlertCount] = useState(0);
  const [highAlertCount, setHighAlertCount] = useState(0);
  // eslint-disable-next-line
  const [web3, setWeb3] = useState(null);
  const [decentralizedSIEM, setDecentralizedSIEM] = useState(null);
  const contractAddress = '0x0F300093fE2246674464480f2AD38051AeaeaCA6';

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Instance = new Web3("http://127.0.0.1:7545");
      const contractInstance = new web3Instance.eth.Contract(DecentralizedSIEM, contractAddress);
      setWeb3(web3Instance);
      setDecentralizedSIEM(contractInstance);
    };

    initWeb3();
  }, []);

  const fetchLogs = useCallback(async () => {
    if (!decentralizedSIEM) return;
    try {
      const logCount = await decentralizedSIEM.methods.logCount().call();
      const fetchedLogs = [];
      let criticalCount = 0;
      let highCount = 0;

      for (let i = 1; i <= logCount; i++) {
        const log = await decentralizedSIEM.methods.logs(i).call();
        fetchedLogs.push(log);

        // Count critical and high alerts based on severity
        if (parseInt(log.severity) >= 5) criticalCount++;
        else if (parseInt(log.severity) === 4) highCount++;
      }

      setAlerts(fetchedLogs); // Update the alerts state
      setCriticalAlertCount(criticalCount); // Update critical alert count
      setHighAlertCount(highCount); // Update high alert count
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, [decentralizedSIEM]);

  useEffect(() => {
    fetchLogs(); // Fetch logs when decentralizedSIEM is initialized
  }, [decentralizedSIEM, fetchLogs]);

  return (
    <Container>
      <Navbar />
      <Grid2 container spacing={3}>
        <Grid2 item xs={12} md={4}>
          <SummaryCard title="Total Alerts" value={alerts.length} />
        </Grid2>
        <Grid2 item xs={12} md={4}>
          <SummaryCard title="Critical Alerts" value={criticalAlertCount} />
        </Grid2>
        <Grid2 item xs={12} md={4}>
          <SummaryCard title="High Alerts" value={highAlertCount} />
        </Grid2>
        <Grid2 item xs={12}>
          {alerts.length > 0 ? (
            <AlertsTable alerts={alerts} />
          ) : (
            <p>No alerts available</p>
          )}
        </Grid2>
      </Grid2>
      <Dashboard setAlerts={setAlerts} fetchLogs={fetchLogs} /> {/* Pass down setAlerts and fetchLogs to Dashboard */}
    </Container>
  );
};

export default App;
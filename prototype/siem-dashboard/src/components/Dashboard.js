import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import DecentralizedSIEM from './DecentralizedSIEMABI.json';
import { Container, Grid as Grid2, TextField, Button, Typography, Paper } from '@mui/material';
import AlertsTable from './AlertsTable';
import Charts from './Charts';

const Dashboard = ({ setAlerts }) => {
  const [newLog, setNewLog] = useState({
    sourceIP: '',
    eventType: '',
    description: '',
    severity: '1',
  });

  const [logs, setLogs] = useState([]);  // Initialize as an empty array
  const [criticalAlertCount, setCriticalAlertCount] = useState(0);
  const [highAlertCount, setHighAlertCount] = useState(0);
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

        if (parseInt(log.severity) >= 5) criticalCount++;
        else if (parseInt(log.severity) === 4) highCount++;
      }

      setLogs(fetchedLogs);
      setCriticalAlertCount(criticalCount);
      setHighAlertCount(highCount);
      setAlerts(fetchedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, [decentralizedSIEM, setAlerts]);

  useEffect(() => {
    fetchLogs();
  }, [decentralizedSIEM, fetchLogs]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    const { sourceIP, eventType, description, severity } = newLog;

    try {
      const accounts = await web3.eth.getAccounts();
      const gasEstimate = await decentralizedSIEM.methods
        .addSecurityLog(sourceIP, eventType, description, severity)
        .estimateGas({ from: accounts[0] });

      await decentralizedSIEM.methods
        .addSecurityLog(sourceIP, eventType, description, severity)
        .send({ from: accounts[0], gas: gasEstimate });

      setNewLog({ sourceIP: '', eventType: '', description: '', severity: '1' });
      await fetchLogs();
    } catch (error) {
      console.error("Error adding log:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        SIEM Dashboard
      </Typography>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <form onSubmit={handleAddLog}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={6}>
              <TextField
                label="Source IP"
                value={newLog.sourceIP}
                onChange={(e) => setNewLog({ ...newLog, sourceIP: e.target.value })}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                label="Event Type"
                value={newLog.eventType}
                onChange={(e) => setNewLog({ ...newLog, eventType: e.target.value })}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Description"
                value={newLog.description}
                onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Severity"
                type="number"
                value={newLog.severity}
                onChange={(e) => setNewLog({ ...newLog, severity: e.target.value })}
                fullWidth
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Log
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </Paper>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        <div style={{ width: '600px', height: '400px' }}> {/* Adjust these values for the Charts component */}
          <Charts logs={logs} criticalAlertCount={criticalAlertCount} highAlertCount={highAlertCount} />
        </div>
      </div>
      <AlertsTable logs={logs} />
    </Container>
  );
};

export default Dashboard;
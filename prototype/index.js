import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, UserPlus, Activity } from 'lucide-react';

// Simple Table Components
const Table = ({ children }) => (
  <div className="w-full overflow-auto">
    <table className="w-full border-collapse">{children}</table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200">{children}
  </tbody>
);

const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

const TableHead = ({ children }) => (
  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">{children}</th>
);

const TableCell = ({ children }) => (
  <td className="px-4 py-2 text-sm text-gray-500">{children}</td>
);

export default function SIEMDashboard() {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [newLog, setNewLog] = useState({
    sourceIP: '',
    destinationIP: '',
    eventType: '',
    description: '',
    severity: 1
  });

  const [newUserAddress, setNewUserAddress] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // Simulated data loading
    setLogs([
      {
        id: 1,
        timestamp: new Date().toLocaleString(),
        sourceIP: '192.168.1.1',
        destinationIP: '10.0.0.1',
        eventType: 'Login Attempt',
        severity: 4,
        isActive: true
      },
      // Add more mock logs as needed
    ]);

    setAlerts([
      {
        id: 1,
        timestamp: new Date().toLocaleString(),
        alertType: 'Brute Force',
        description: 'Multiple failed login attempts',
        severity: 4,
        isAcknowledged: false
      },
      // Add more mock alerts as needed
    ]);

    // Simulate admin status
    setIsAdmin(true);
    setIsAuthorized(true);
    setAccount('0x1234...5678');
  }, []);

  const handleAddLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate adding a log
      const newLogEntry = {
        id: logs.length + 1,
        timestamp: new Date().toLocaleString(),
        ...newLog,
        isActive: true
      };
      setLogs([...logs, newLogEntry]);
      
      setNewLog({
        sourceIP: '',
        destinationIP: '',
        eventType: '',
        description: '',
        severity: 1
      });
    } catch (err) {
      setError(`Failed to add log: ${err.message}`);
    }
    setLoading(false);
  };

  const handleAuthorizeUser = async () => {
    setLoading(true);
    try {
      // Simulate authorizing a user
      console.log('Authorizing user:', newUserAddress);
      setNewUserAddress('');
    } catch (err) {
      setError(`Failed to authorize user: ${err.message}`);
    }
    setLoading(false);
  };

  const handleAcknowledgeAlert = async (alertId) => {
    setLoading(true);
    try {
      // Simulate acknowledging an alert
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, isAcknowledged: true }
          : alert
      ));
    } catch (err) {
      setError(`Failed to acknowledge alert: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Decentralized SIEM Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Shield className={isAdmin ? "text-green-500" : "text-gray-500"} />
              <span>{isAdmin ? "Admin" : "User"}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="logs">
            <TabsList>
              <TabsTrigger value="logs">
                <Activity className="mr-2" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="alerts">
                <AlertTriangle className="mr-2" />
                Alerts
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin">
                  <UserPlus className="mr-2" />
                  Admin
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="logs">
              {isAuthorized && (
                <form onSubmit={handleAddLog} className="mb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Source IP"
                      value={newLog.sourceIP}
                      onChange={(e) => setNewLog({...newLog, sourceIP: e.target.value})}
                    />
                    <Input
                      placeholder="Destination IP"
                      value={newLog.destinationIP}
                      onChange={(e) => setNewLog({...newLog, destinationIP: e.target.value})}
                    />
                    <Input
                      placeholder="Event Type"
                      value={newLog.eventType}
                      onChange={(e) => setNewLog({...newLog, eventType: e.target.value})}
                    />
                    <Input
                      placeholder="Description"
                      value={newLog.description}
                      onChange={(e) => setNewLog({...newLog, description: e.target.value})}
                    />
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={newLog.severity}
                      onChange={(e) => setNewLog({...newLog, severity: parseInt(e.target.value)})}
                    />
                    <Button type="submit" disabled={loading}>
                      Add Log
                    </Button>
                  </div>
                </form>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Source IP</TableHead>
                    <TableHead>Destination IP</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.sourceIP}</TableCell>
                      <TableCell>{log.destinationIP}</TableCell>
                      <TableCell>{log.eventType}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded ${
                          log.severity >= 4 ? 'bg-red-100 text-red-800' :
                          log.severity >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {log.severity}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="alerts">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.timestamp}</TableCell>
                      <TableCell>{alert.alertType}</TableCell>
                      <TableCell>{alert.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded ${
                          alert.severity >= 4 ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </TableCell>
                      <TableCell>
                        {alert.isAcknowledged ? 
                          <span className="text-green-600">Acknowledged</span> :
                          <span className="text-red-600">Open</span>
                        }
                      </TableCell>
                      <TableCell>
                        {!alert.isAcknowledged && isAuthorized && (
                          <Button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            disabled={loading}
                            size="sm"
                          >
                            Acknowledge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="admin">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="User Address"
                      value={newUserAddress}
                      onChange={(e) => setNewUserAddress(e.target.value)}
                    />
                    <Button
                      onClick={handleAuthorizeUser}
                      disabled={loading || !newUserAddress}
                    >
                      Authorize User
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
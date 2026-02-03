import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, CircularProgress
} from '@mui/material';
import api from '../services/api';
import { toast } from 'react-toastify';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await api.get('/auth/admin/logs/');
      setLogs(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      user_registered: 'success',
      user_login: 'info',
      token_generated: 'primary',
      token_activated: 'success',
      token_deactivated: 'warning',
      booking_started: 'info',
      booking_completed: 'success',
      booking_failed: 'error',
      payment_completed: 'success',
      settings_updated: 'info'
    };
    return colors[action] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>System Logs</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No logs found</TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={log.id || index}>
                  <TableCell>{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label={log.action?.replace(/_/g, ' ').toUpperCase() || 'N/A'} color={getActionColor(log.action)} size="small" />
                  </TableCell>
                  <TableCell>{log.user_details?.username || log.user || 'System'}</TableCell>
                  <TableCell>{log.description || 'N/A'}</TableCell>
                  <TableCell>{log.ip_address || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Logs;

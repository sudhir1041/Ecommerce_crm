import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, CircularProgress
} from '@mui/material';
import api from '../services/api';
import { toast } from 'react-toastify';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get('/auth/admin/bookings/');
      setBookings(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      failed: 'error',
      in_progress: 'warning',
      scheduled: 'info',
      waiting_payment: 'warning'
    };
    return colors[status] || 'default';
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
      <Typography variant="h4" gutterBottom>All Bookings</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>From → To</TableCell>
              <TableCell>Train</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>PNR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No bookings found</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.user?.username || 'N/A'}</TableCell>
                  <TableCell>{booking.from_station_code} → {booking.to_station_code}</TableCell>
                  <TableCell>{booking.train_number}</TableCell>
                  <TableCell>{booking.journey_date}</TableCell>
                  <TableCell>
                    <Chip label={booking.status} color={getStatusColor(booking.status)} size="small" />
                  </TableCell>
                  <TableCell>{booking.pnr_number || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Bookings;

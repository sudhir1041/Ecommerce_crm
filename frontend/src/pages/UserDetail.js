import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Paper, Typography, Button, CircularProgress, Grid, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider 
} from '@mui/material';
import { ArrowBack, Person, Token, Assessment, Receipt } from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserDetail();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadUserDetail = async () => {
    try {
      const response = await adminAPI.getUserDetail(userId);
      setData(response.data);
    } catch (error) {
      console.error('Error loading user detail:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Typography>User not found</Typography>
        <Button onClick={() => navigate('/users')}>Back to Users</Button>
      </Box>
    );
  }

  const { user, profile, token, recent_bookings, recent_transactions, booking_stats } = data;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      {/* User Info Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Person sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">User Information</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Username</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{user.username || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{user.email || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Phone</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{user.phone || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Full Name</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Role</Typography>
            <Chip label={user.role || 'N/A'} color="primary" size="small" sx={{ mt: 0.5 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Date Joined</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Token & Stats Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Token Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Token sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6">Token Status</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {token ? (
              <Box>
                <Typography variant="body2" color="text.secondary">Token</Typography>
                <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace' }}>{token.token}</Typography>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip 
                  label={token.status} 
                  color={token.status === 'active' ? 'success' : token.status === 'expired' ? 'error' : 'warning'} 
                  size="small" 
                  sx={{ mb: 2 }} 
                />
                <Typography variant="body2" color="text.secondary">Plan</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{token.subscription_plan_name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">Bookings</Typography>
                <Typography variant="body1">{token.bookings_used || 0} / {token.total_bookings_allowed || 0}</Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">No token assigned</Typography>
            )}
          </Paper>
        </Grid>

        {/* Booking Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assessment sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6">Booking Statistics</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {booking_stats ? (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Bookings</Typography>
                  <Typography variant="h4" color="primary.main">{booking_stats.total || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Successful</Typography>
                  <Typography variant="h4" color="success.main">{booking_stats.successful || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Failed</Typography>
                  <Typography variant="h4" color="error.main">{booking_stats.failed || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                  <Typography variant="h4" color="info.main">
                    {booking_stats.total > 0 ? Math.round((booking_stats.successful / booking_stats.total) * 100) : 0}%
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary">No booking data</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Bookings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Bookings</Typography>
        <Divider sx={{ mb: 2 }} />
        {recent_bookings && recent_bookings.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Train</TableCell>
                  <TableCell>From → To</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent_bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.train_number || 'N/A'}</TableCell>
                    <TableCell>{booking.from_station} → {booking.to_station}</TableCell>
                    <TableCell>{booking.journey_date ? new Date(booking.journey_date).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={booking.status === 'completed' ? 'success' : booking.status === 'failed' ? 'error' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{new Date(booking.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary">No recent bookings</Typography>
        )}
      </Paper>

      {/* Recent Transactions */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Receipt sx={{ mr: 1, color: 'warning.main' }} />
          <Typography variant="h6">Recent Transactions</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {recent_transactions && recent_transactions.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent_transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{transaction.transaction_id || 'N/A'}</TableCell>
                    <TableCell>₹{transaction.amount || 0}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status} 
                        color={transaction.status === 'completed' ? 'success' : transaction.status === 'failed' ? 'error' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary">No recent transactions</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default UserDetail;

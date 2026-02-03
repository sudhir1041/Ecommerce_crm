import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Grid, Chip, CircularProgress, Card, CardContent, Divider,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, MenuItem
} from '@mui/material';
import { AttachMoney, CheckCircle, Add } from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';

function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    plan_type: 'basic',
    description: '',
    duration_days: '',
    max_bookings: '',
    price: '',
    max_passengers: 4,
    proxy_support: true,
    priority_captcha: false,
    email_notifications: true,
    is_active: true
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await adminAPI.getPlans();
      setPlans(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load pricing plans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      plan_type: 'basic',
      description: '',
      duration_days: '',
      max_bookings: '',
      price: '',
      max_passengers: 4,
      proxy_support: true,
      priority_captcha: false,
      email_notifications: true,
      is_active: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.duration_days || !formData.max_bookings || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    // Prepare data with proper types
    const submitData = {
      name: formData.name,
      plan_type: formData.plan_type,
      description: formData.description || '',
      duration_days: parseInt(formData.duration_days),
      max_bookings: parseInt(formData.max_bookings),
      price: parseFloat(formData.price),
      max_passengers: parseInt(formData.max_passengers),
      proxy_support: formData.proxy_support,
      priority_captcha: formData.priority_captcha,
      email_notifications: formData.email_notifications,
      is_active: formData.is_active
    };

    try {
      await adminAPI.createPlan(submitData);
      toast.success('Pricing plan created successfully');
      handleCloseDialog();
      loadPlans();
    } catch (error) {
      const errorMsg = error.response?.data?.plan_type?.[0] || 
                       error.response?.data?.message || 
                       error.response?.data?.detail ||
                       'Failed to create pricing plan';
      toast.error(errorMsg);
      console.error('Error:', error.response?.data);
    }
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4">Subscription Plans</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleOpenDialog}
        >
          Add New Pricing
        </Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} lg={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: plan.is_active ? '2px solid' : '1px solid',
                borderColor: plan.is_active ? 'primary.main' : 'divider',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              {plan.is_active && (
                <Chip 
                  label="Active" 
                  color="success" 
                  size="small" 
                  sx={{ position: 'absolute', top: 16, right: 16 }}
                />
              )}
              
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
                  {plan.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                  {plan.description || 'No description available'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" color="primary.main" fontWeight="bold">
                    ₹{plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per {plan.duration_days} days
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ fontSize: 20, color: 'success.main', mr: 1 }} />
                    <Typography variant="body2">
                      <strong>{plan.max_bookings}</strong> bookings allowed
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ fontSize: 20, color: 'success.main', mr: 1 }} />
                    <Typography variant="body2">
                      Valid for <strong>{plan.duration_days} days</strong>
                    </Typography>
                  </Box>

                  {plan.features && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle sx={{ fontSize: 20, color: 'success.main', mr: 1 }} />
                      <Typography variant="body2">{plan.features}</Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Plan ID: {plan.id}
                  </Typography>
                  <Chip 
                    label={plan.is_active ? 'Available' : 'Inactive'} 
                    color={plan.is_active ? 'success' : 'default'} 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {plans.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No pricing plans available</Typography>
        </Paper>
      )}

      {/* Add New Pricing Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Pricing Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Plan Type"
                name="plan_type"
                value={formData.plan_type}
                onChange={handleInputChange}
                required
                helperText="Must be unique - cannot duplicate existing plan types"
              >
                <MenuItem value="trial">Trial</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (Days)"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Bookings"
                name="max_bookings"
                value={formData.max_bookings}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Price (₹)"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Passengers"
                name="max_passengers"
                value={formData.max_passengers}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.proxy_support}
                    onChange={handleInputChange}
                    name="proxy_support"
                  />
                }
                label="Proxy Support"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.priority_captcha}
                    onChange={handleInputChange}
                    name="priority_captcha"
                  />
                }
                label="Priority Captcha"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.email_notifications}
                    onChange={handleInputChange}
                    name="email_notifications"
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    name="is_active"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Create Plan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Pricing;

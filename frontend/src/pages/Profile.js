import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  AccountCircle,
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
  Business,
  Email,
  Phone,
  Person,
  Work,
  CalendarToday,
  PhotoCamera,
  Delete,
} from '@mui/icons-material';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profile_image || null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    date_joined: user?.date_joined || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        setProfileImage(e.target.result);
        
        // Upload image immediately
        const formData = new FormData();
        formData.append('profile_image', file);
        
        try {
          const response = await fetch('/api/accounts/profile/image/upload/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            setProfileImage(data.image_url);
            toast.success('Profile image updated successfully');
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          toast.error('Failed to upload image');
          setProfileImage(user?.profile_image || null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await fetch('/api/accounts/profile/image/remove/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setProfileImage(null);
        toast.success('Profile image removed successfully');
      } else {
        throw new Error('Remove failed');
      }
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/accounts/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        })
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        // Update user context if available
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || '',
      date_joined: user?.date_joined || '',
    });
    setProfileImage(user?.profile_image || null);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-600 font-bold text-2xl">
                        {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 flex space-x-1">
                      <label className="bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                        <PhotoCamera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {profileImage && (
                        <button
                          onClick={handleRemoveImage}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                        >
                          <Delete className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-gray-600 capitalize mb-2">{user?.role?.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarToday className="h-4 w-4 mr-3" />
                    <span>Joined {new Date(user?.date_joined).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Work className="h-4 w-4 mr-3" />
                    <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Cancel className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Person className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.first_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Person className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.last_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Email className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{formData.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Work className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 capitalize">{formData.role?.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Role is managed by administrators</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Joined
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CalendarToday className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {new Date(formData.date_joined).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Security className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Notifications className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Order Updates</h4>
                    <p className="text-sm text-gray-600">Get notified about order status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">System Alerts</h4>
                    <p className="text-sm text-gray-600">Important system notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Profile;
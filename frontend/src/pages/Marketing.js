import React, { useState } from 'react';
import {
  Campaign,
  Email,
  Sms,
  WhatsApp,
  TrendingUp,
  People,
  Visibility,
  Edit,
  Delete,
  Add,
  FilterList,
  GetApp,
} from '@mui/icons-material';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale 2024',
      type: 'email',
      status: 'active',
      sent: 15420,
      opened: 8234,
      clicked: 1247,
      revenue: 245000,
      createdAt: '2024-01-20',
    },
    {
      id: 2,
      name: 'New Product Launch',
      type: 'sms',
      status: 'completed',
      sent: 8500,
      opened: 7890,
      clicked: 890,
      revenue: 125000,
      createdAt: '2024-01-18',
    },
    {
      id: 3,
      name: 'Cart Recovery Campaign',
      type: 'whatsapp',
      status: 'draft',
      sent: 0,
      opened: 0,
      clicked: 0,
      revenue: 0,
      createdAt: '2024-01-22',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Email className="h-4 w-4" />;
      case 'sms': return <Sms className="h-4 w-4" />;
      case 'whatsapp': return <WhatsApp className="h-4 w-4" />;
      default: return <Campaign className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-600">Manage campaigns, promotions, and customer engagement</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Add className="h-4 w-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Campaign className="h-4 w-4" />
                <span>Campaigns</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Email className="h-4 w-4" />
                <span>Templates</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'campaigns' ? (
        <>
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Campaign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <People className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reach</p>
                  <p className="text-2xl font-bold text-gray-900">45.2K</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Visibility className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900">68.5%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹3.7L</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <FilterList className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <GetApp className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opened</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicked</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">Created: {campaign.createdAt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(campaign.type)}
                          <span className="capitalize">{campaign.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.sent.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{campaign.opened.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{campaign.clicked.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{campaign.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-1">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Visibility className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <Delete className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Templates Content */}
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center py-12">
              <Email className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Templates</h3>
              <p className="text-gray-600 mb-6">Create and manage email templates for your campaigns</p>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto">
                <Add className="h-4 w-4" />
                <span>Create Template</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Marketing;
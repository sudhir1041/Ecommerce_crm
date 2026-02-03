import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Search,
  FilterList,
  Add as Plus,
  Edit,
  Delete,
  Visibility,
  Person,
  Security,
  Assignment,
  Assessment,
  History,
  Email,
  Phone,
  Work,
  CalendarToday,
  CheckCircle,
  Cancel,
  Warning,
  TrendingUp,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all',
  });

  const roles = [
    { id: 'super_admin', name: 'Super Admin', color: 'bg-red-100 text-red-800', permissions: ['all'] },
    { id: 'admin', name: 'Admin', color: 'bg-purple-100 text-purple-800', permissions: ['orders', 'products', 'customers', 'reports'] },
    { id: 'manager', name: 'Manager', color: 'bg-blue-100 text-blue-800', permissions: ['orders', 'products', 'customers'] },
    { id: 'employee', name: 'Employee', color: 'bg-green-100 text-green-800', permissions: ['orders', 'products'] },
    { id: 'support', name: 'Support', color: 'bg-yellow-100 text-yellow-800', permissions: ['customers', 'orders'] },
  ];

  const permissions = [
    { id: 'orders', name: 'Order Management', description: 'View, create, edit orders' },
    { id: 'products', name: 'Product Management', description: 'Manage product catalog' },
    { id: 'customers', name: 'Customer Management', description: 'Manage customer data' },
    { id: 'reports', name: 'Reports & Analytics', description: 'View business reports' },
    { id: 'employees', name: 'Employee Management', description: 'Manage staff and roles' },
    { id: 'settings', name: 'System Settings', description: 'Configure system settings' },
  ];

  const departments = [
    { id: 'sales', name: 'Sales', icon: '💼' },
    { id: 'support', name: 'Customer Support', icon: '🎧' },
    { id: 'operations', name: 'Operations', icon: '⚙️' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'it', name: 'IT', icon: '💻' },
  ];

  const mockEmployees = [
    {
      id: 'EMP-001',
      name: 'Rajesh Kumar',
      email: 'rajesh@company.com',
      phone: '+91 9876543210',
      role: 'super_admin',
      department: 'it',
      status: 'active',
      joinDate: '2023-01-15T10:30:00Z',
      lastLogin: '2024-01-24T09:15:00Z',
      ordersHandled: 234,
      revenueGenerated: 1567800,
      rating: 4.8,
      permissions: ['all'],
      activities: [
        { id: 1, action: 'Login', timestamp: '2024-01-24T09:15:00Z', details: 'Logged in from 192.168.1.100' },
        { id: 2, action: 'Order Updated', timestamp: '2024-01-24T10:30:00Z', details: 'Updated order ORD-2024-001' },
        { id: 3, action: 'Product Added', timestamp: '2024-01-24T11:45:00Z', details: 'Added new product PRD-005' }
      ]
    },
    {
      id: 'EMP-002',
      name: 'Priya Sharma',
      email: 'priya@company.com',
      phone: '+91 9876543211',
      role: 'manager',
      department: 'sales',
      status: 'active',
      joinDate: '2023-03-20T09:15:00Z',
      lastLogin: '2024-01-24T08:30:00Z',
      ordersHandled: 198,
      revenueGenerated: 1345600,
      rating: 4.6,
      permissions: ['orders', 'products', 'customers'],
      activities: [
        { id: 1, action: 'Login', timestamp: '2024-01-24T08:30:00Z', details: 'Logged in from 192.168.1.101' },
        { id: 2, action: 'Customer Updated', timestamp: '2024-01-24T09:45:00Z', details: 'Updated customer CUST-002' }
      ]
    },
    {
      id: 'EMP-003',
      name: 'Amit Singh',
      email: 'amit@company.com',
      phone: '+91 9876543212',
      role: 'employee',
      department: 'operations',
      status: 'active',
      joinDate: '2023-06-10T14:20:00Z',
      lastLogin: '2024-01-24T07:45:00Z',
      ordersHandled: 187,
      revenueGenerated: 1234500,
      rating: 4.5,
      permissions: ['orders', 'products'],
      activities: [
        { id: 1, action: 'Login', timestamp: '2024-01-24T07:45:00Z', details: 'Logged in from 192.168.1.102' },
        { id: 2, action: 'Order Processed', timestamp: '2024-01-24T08:15:00Z', details: 'Processed order ORD-2024-003' }
      ]
    },
    {
      id: 'EMP-004',
      name: 'Sneha Patel',
      email: 'sneha@company.com',
      phone: '+91 9876543213',
      role: 'support',
      department: 'support',
      status: 'inactive',
      joinDate: '2023-08-05T11:45:00Z',
      lastLogin: '2024-01-20T16:30:00Z',
      ordersHandled: 156,
      revenueGenerated: 987600,
      rating: 4.7,
      permissions: ['customers', 'orders'],
      activities: [
        { id: 1, action: 'Login', timestamp: '2024-01-20T16:30:00Z', details: 'Logged in from 192.168.1.103' },
        { id: 2, action: 'Customer Support', timestamp: '2024-01-20T17:15:00Z', details: 'Resolved ticket #TKT-001' }
      ]
    }
  ];

  useEffect(() => {
    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, employees]);

  const applyFilters = () => {
    let filtered = employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           employee.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = filters.role === 'all' || employee.role === filters.role;
      const matchesStatus = filters.status === 'all' || employee.status === filters.status;
      const matchesDepartment = filters.department === 'all' || employee.department === filters.department;

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });

    setFilteredEmployees(filtered);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(employee => employee.id));
    }
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedEmployees.length === 0) {
      toast.warning('Please select employees first');
      return;
    }

    switch (action) {
      case 'role':
        toast.success(`Role updated for ${selectedEmployees.length} employees`);
        break;
      case 'status':
        toast.success(`Status updated for ${selectedEmployees.length} employees`);
        break;
      case 'permissions':
        toast.success(`Permissions updated for ${selectedEmployees.length} employees`);
        break;
    }
  };

  const handleEmployeeAction = (employeeId, action) => {
    const employee = employees.find(e => e.id === employeeId);
    
    switch (action) {
      case 'view':
        setSelectedEmployee(employee);
        setShowEmployeeModal(true);
        break;
      case 'edit':
        setSelectedEmployee(employee);
        setShowEmployeeModal(true);
        break;
      case 'delete':
        if (window.confirm(`Delete ${employee.name}?`)) {
          setEmployees(employees.filter(e => e.id !== employeeId));
          toast.success('Employee deleted successfully');
        }
        break;
    }
  };

  const getRoleBadge = (role) => {
    const roleObj = roles.find(r => r.id === role);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleObj?.color || 'bg-gray-100 text-gray-800'}`}>
        {roleObj?.name || role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getDepartmentIcon = (department) => {
    const deptObj = departments.find(d => d.id === department);
    return deptObj?.icon || '🏢';
  };

  const renderEmployeesList = () => (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, email..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedEmployees.length} employees selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('role')}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                Update Role
              </button>
              <button
                onClick={() => handleBulkAction('status')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Update Status
              </button>
              <button
                onClick={() => handleBulkAction('permissions')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Update Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button onClick={handleSelectAll}>
                    {selectedEmployees.length === filteredEmployees.length ? 
                      <CheckBox className="h-5 w-5 text-blue-600" /> : 
                      <CheckBoxOutlineBlank className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button onClick={() => handleSelectEmployee(employee.id)}>
                      {selectedEmployees.includes(employee.id) ? 
                        <CheckBox className="h-5 w-5 text-blue-600" /> : 
                        <CheckBoxOutlineBlank className="h-5 w-5 text-gray-400" />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-sm">
                          {employee.name.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(employee.role)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getDepartmentIcon(employee.department)}</span>
                      <span className="text-sm capitalize">{employee.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(employee.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium">{employee.ordersHandled} orders</div>
                      <div className="text-gray-500">₹{employee.revenueGenerated.toLocaleString()}</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span>{employee.rating}/5</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(employee.lastLogin).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(employee.lastLogin).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEmployeeAction(employee.id, 'view')}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Details"
                      >
                        <Visibility className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEmployeeAction(employee.id, 'edit')}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit Employee"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEmployeeAction(employee.id, 'delete')}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete Employee"
                      >
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
    </div>
  );

  const renderRolesPermissions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Roles</h3>
          <div className="space-y-3">
            {roles.map(role => (
              <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{role.name}</div>
                  <div className="text-sm text-gray-500">
                    {role.permissions.includes('all') ? 'All Permissions' : `${role.permissions.length} permissions`}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                    <Delete className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Permissions</h3>
          <div className="space-y-3">
            {permissions.map(permission => (
              <div key={permission.id} className="p-3 border rounded-lg">
                <div className="font-medium">{permission.name}</div>
                <div className="text-sm text-gray-500">{permission.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityLogs = () => (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Employee Activities</h3>
      <div className="space-y-4">
        {employees.flatMap(emp => 
          emp.activities.map(activity => ({
            ...activity,
            employeeName: emp.name,
            employeeId: emp.id
          }))
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10).map(activity => (
          <div key={`${activity.employeeId}-${activity.id}`} className="flex items-center space-x-4 p-3 border rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <History className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{activity.action}</div>
              <div className="text-sm text-gray-500">{activity.employeeName} - {activity.details}</div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(activity.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600">Top Performer</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Rajesh Kumar</p>
          <p className="text-sm text-gray-600">234 orders handled</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <Assessment className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-blue-600">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.6/5</p>
          <p className="text-sm text-gray-600">Across all employees</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <Person className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-purple-600">Active Employees</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.status === 'active').length}</p>
          <p className="text-sm text-gray-600">Out of {employees.length} total</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Employee Performance Comparison</h3>
        <div className="space-y-4">
          {employees.map(employee => (
            <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">
                    {employee.name.split(' ').map(n => n.charAt(0)).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-gray-500">{employee.role}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{employee.ordersHandled} orders</div>
                <div className="text-sm text-gray-500">₹{employee.revenueGenerated.toLocaleString()}</div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm">{employee.rating}/5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employees & Roles</h1>
          <p className="text-gray-600">Workforce control and management system</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <FilterList className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={() => setShowEmployeeModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'employees', label: 'Employees List', icon: Person },
            { id: 'roles', label: 'Roles & Permissions', icon: Security },
            { id: 'activity', label: 'Activity Logs', icon: History },
            { id: 'performance', label: 'Performance Reports', icon: Assessment },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'employees' && renderEmployeesList()}
        {activeTab === 'roles' && renderRolesPermissions()}
        {activeTab === 'activity' && renderActivityLogs()}
        {activeTab === 'performance' && renderPerformanceReports()}
      </div>

      {/* Employee Details Modal */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Employee Details - {selectedEmployee.name}</h2>
              <button onClick={() => setShowEmployeeModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedEmployee.name}</p>
                  <p><strong>Email:</strong> {selectedEmployee.email}</p>
                  <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                  <p><strong>Join Date:</strong> {new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Work Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Role:</strong> {getRoleBadge(selectedEmployee.role)}</p>
                  <p><strong>Department:</strong> {getDepartmentIcon(selectedEmployee.department)} {selectedEmployee.department}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedEmployee.status)}</p>
                  <p><strong>Last Login:</strong> {new Date(selectedEmployee.lastLogin).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-900">{selectedEmployee.ordersHandled}</div>
                  <div className="text-sm text-blue-600">Orders Handled</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-900">₹{selectedEmployee.revenueGenerated.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Revenue Generated</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-900">{selectedEmployee.rating}/5</div>
                  <div className="text-sm text-yellow-600">Performance Rating</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {selectedEmployee.permissions.includes('all') ? (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">All Permissions</span>
                ) : (
                  selectedEmployee.permissions.map(perm => (
                    <span key={perm} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {permissions.find(p => p.id === perm)?.name || perm}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
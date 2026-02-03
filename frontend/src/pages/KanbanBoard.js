import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Add as Plus,
  DragIndicator,
  Person,
  Schedule,
  Flag,
  Analytics,
  Settings,
  Refresh,
  Warning,
  TrendingUp,
  Assignment,
} from '@mui/icons-material';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const employees = [
    { id: 1, name: 'Rajesh Kumar', avatar: 'RK' },
    { id: 2, name: 'Priya Sharma', avatar: 'PS' },
    { id: 3, name: 'Amit Singh', avatar: 'AS' },
    { id: 4, name: 'Sneha Patel', avatar: 'SP' },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const mockColumns = [
    { id: 'new', title: 'New Orders', color: 'bg-gray-100', limit: 10 },
    { id: 'processing', title: 'Processing', color: 'bg-blue-100', limit: 8 },
    { id: 'packed', title: 'Packed', color: 'bg-yellow-100', limit: 12 },
    { id: 'shipped', title: 'Shipped', color: 'bg-orange-100', limit: 15 },
    { id: 'delivered', title: 'Delivered', color: 'bg-green-100', limit: null },
  ];

  const mockTasks = [
    {
      id: 'T001',
      title: 'Order #ORD-2024-001',
      description: 'Wireless Headphones - Premium Quality',
      priority: 'high',
      assignee: 1,
      columnId: 'new',
      createdAt: '2024-01-24T10:30:00Z',
      dueDate: '2024-01-25T18:00:00Z',
      customer: 'John Doe',
      amount: 2500
    },
    {
      id: 'T002',
      title: 'Order #ORD-2024-002',
      description: 'Smart Watch Series X',
      priority: 'medium',
      assignee: 2,
      columnId: 'processing',
      createdAt: '2024-01-24T09:15:00Z',
      dueDate: '2024-01-26T12:00:00Z',
      customer: 'Jane Smith',
      amount: 15000
    },
    {
      id: 'T003',
      title: 'Order #ORD-2024-003',
      description: 'Laptop Stand + USB Hub',
      priority: 'low',
      assignee: 3,
      columnId: 'packed',
      createdAt: '2024-01-23T14:20:00Z',
      dueDate: '2024-01-27T10:00:00Z',
      customer: 'Mike Johnson',
      amount: 3500
    },
    {
      id: 'T004',
      title: 'Order #ORD-2024-004',
      description: 'Gaming Mouse + Keyboard',
      priority: 'high',
      assignee: 4,
      columnId: 'shipped',
      createdAt: '2024-01-22T11:45:00Z',
      dueDate: '2024-01-24T16:00:00Z',
      customer: 'Sarah Wilson',
      amount: 4200
    },
    {
      id: 'T005',
      title: 'Order #ORD-2024-005',
      description: 'Phone Case + Screen Protector',
      priority: 'medium',
      assignee: 1,
      columnId: 'delivered',
      createdAt: '2024-01-21T08:30:00Z',
      dueDate: '2024-01-23T14:00:00Z',
      customer: 'David Brown',
      amount: 1200
    }
  ];

  useEffect(() => {
    setColumns(mockColumns);
    setTasks(mockTasks);
  }, []);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTask && draggedTask.columnId !== columnId) {
      setTasks(tasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, columnId }
          : task
      ));
      toast.success(`Task moved to ${columns.find(c => c.id === columnId)?.title}`);
    }
    setDraggedTask(null);
  };

  const getTasksByColumn = (columnId) => {
    return tasks.filter(task => task.columnId === columnId);
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id);
  };

  const getPriorityIcon = (priority) => {
    return <Flag className={`h-4 w-4 ${
      priority === 'high' ? 'text-red-500' :
      priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
    }`} />;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getAnalytics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.columnId === 'delivered').length;
    const overdueTasks = tasks.filter(t => isOverdue(t.dueDate) && t.columnId !== 'delivered').length;
    const avgTimeInColumn = {};
    
    columns.forEach(col => {
      const columnTasks = getTasksByColumn(col.id);
      avgTimeInColumn[col.id] = {
        count: columnTasks.length,
        limit: col.limit,
        utilization: col.limit ? Math.round((columnTasks.length / col.limit) * 100) : 0
      };
    });

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate: Math.round((completedTasks / totalTasks) * 100),
      columnStats: avgTimeInColumn
    };
  };

  const analytics = getAnalytics();

  const renderTask = (task) => {
    const employee = getEmployeeById(task.assignee);
    const overdue = isOverdue(task.dueDate) && task.columnId !== 'delivered';

    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className={`bg-white p-4 rounded-lg border shadow-sm cursor-move hover:shadow-md transition-shadow ${
          overdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <DragIndicator className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-sm">{task.title}</span>
          </div>
          {getPriorityIcon(task.priority)}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{task.customer}</span>
          <span className="font-medium">₹{task.amount.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-indigo-600">{employee?.avatar}</span>
            </div>
            <span className="text-xs text-gray-600">{employee?.name}</span>
          </div>
          
          <div className={`flex items-center space-x-1 ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
            <Schedule className="h-3 w-3" />
            <span className="text-xs">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {overdue && (
          <div className="mt-2 flex items-center space-x-1 text-red-600">
            <Warning className="h-3 w-3" />
            <span className="text-xs font-medium">Overdue</span>
          </div>
        )}
      </div>
    );
  };

  const renderColumn = (column) => {
    const columnTasks = getTasksByColumn(column.id);
    const isOverLimit = column.limit && columnTasks.length > column.limit;

    return (
      <div
        key={column.id}
        className="flex-shrink-0 w-80"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, column.id)}
      >
        <div className={`${column.color} rounded-lg p-4 h-full`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isOverLimit ? 'bg-red-100 text-red-800' : 'bg-white text-gray-600'
              }`}>
                {columnTasks.length}{column.limit ? `/${column.limit}` : ''}
              </span>
            </div>
            <button className="p-1 hover:bg-white hover:bg-opacity-50 rounded">
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-3 min-h-96">
            {columnTasks.map(renderTask)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Visual workflow management and order tracking</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Analytics className="h-4 w-4" />
            <span>Analytics</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Settings className="h-4 w-4" />
            <span>Configure</span>
          </button>
          
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="mb-6 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Workflow Analytics</h3>
            <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Assignment className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-600">Total Tasks</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{analytics.totalTasks}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600">Completion Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{analytics.completionRate}%</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Warning className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-600">Overdue Tasks</span>
              </div>
              <p className="text-2xl font-bold text-red-900">{analytics.overdueTasks}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Analytics className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-purple-600">Avg Cycle Time</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">2.3d</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Column Utilization</h4>
            <div className="grid grid-cols-5 gap-4">
              {columns.map(column => {
                const stats = analytics.columnStats[column.id];
                return (
                  <div key={column.id} className="text-center">
                    <div className="text-sm font-medium text-gray-700">{column.title}</div>
                    <div className="text-lg font-bold">{stats.count}</div>
                    {stats.limit && (
                      <div className={`text-xs ${stats.utilization > 80 ? 'text-red-600' : 'text-gray-500'}`}>
                        {stats.utilization}% utilized
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex space-x-6 pb-6">
          {columns.map(renderColumn)}
        </div>
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Task</h2>
              <button onClick={() => setShowTaskModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ORD-2024-006"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Product details..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Task added successfully!');
                  setShowTaskModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import {
  Search,
  FilterList,
  GetApp,
  CloudUpload,
  Add as Plus,
  Edit,
  Delete,
  Visibility,
  Warning,
  CheckCircle,
  Error,
  Inventory,
  AttachMoney,
  Category,
  Refresh,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    stockLevel: 'all',
  });

  const stockStatuses = [
    { id: 'in_stock', name: 'In Stock', color: 'bg-green-100 text-green-800' },
    { id: 'low_stock', name: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'out_of_stock', name: 'Out of Stock', color: 'bg-red-100 text-red-800' },
    { id: 'discontinued', name: 'Discontinued', color: 'bg-gray-100 text-gray-800' },
  ];

  const mockProducts = [
    {
      id: 'PRD-001',
      name: 'Wireless Headphones Pro',
      sku: 'WHP-PRO-001',
      category: 'electronics',
      description: 'Premium wireless headphones with noise cancellation',
      price: 2500,
      costPrice: 1800,
      stock: 45,
      lowStockThreshold: 10,
      status: 'in_stock',
      variants: [
        { id: 'v1', name: 'Black', sku: 'WHP-PRO-001-BLK', stock: 25, price: 2500 },
        { id: 'v2', name: 'White', sku: 'WHP-PRO-001-WHT', stock: 20, price: 2500 }
      ],
      platforms: {
        website: { active: true, price: 2500, stock: 45 },
        amazon: { active: true, price: 2600, stock: 45 },
        flipkart: { active: true, price: 2550, stock: 45 }
      },
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-24T15:20:00Z'
    },
    {
      id: 'PRD-002',
      name: 'Smart Watch Series X',
      sku: 'SWX-001',
      category: 'electronics',
      description: 'Advanced smartwatch with health monitoring',
      price: 15000,
      costPrice: 12000,
      stock: 8,
      lowStockThreshold: 15,
      status: 'low_stock',
      variants: [
        { id: 'v1', name: '42mm', sku: 'SWX-001-42', stock: 5, price: 15000 },
        { id: 'v2', name: '46mm', sku: 'SWX-001-46', stock: 3, price: 16000 }
      ],
      platforms: {
        website: { active: true, price: 15000, stock: 8 },
        amazon: { active: true, price: 15500, stock: 8 },
        flipkart: { active: false, price: 0, stock: 0 }
      },
      createdAt: '2024-01-18T09:15:00Z',
      updatedAt: '2024-01-24T12:10:00Z'
    },
    {
      id: 'PRD-003',
      name: 'Gaming Mouse RGB',
      sku: 'GMR-001',
      category: 'gaming',
      description: 'High-precision gaming mouse with RGB lighting',
      price: 2200,
      costPrice: 1500,
      stock: 0,
      lowStockThreshold: 5,
      status: 'out_of_stock',
      variants: [
        { id: 'v1', name: 'Black', sku: 'GMR-001-BLK', stock: 0, price: 2200 }
      ],
      platforms: {
        website: { active: false, price: 2200, stock: 0 },
        amazon: { active: false, price: 2300, stock: 0 },
        flipkart: { active: false, price: 2250, stock: 0 }
      },
      createdAt: '2024-01-15T14:20:00Z',
      updatedAt: '2024-01-23T16:45:00Z'
    },
    {
      id: 'PRD-004',
      name: 'USB-C Hub Premium',
      sku: 'UCH-PREM-001',
      category: 'accessories',
      description: '7-in-1 USB-C hub with 4K HDMI support',
      price: 3500,
      costPrice: 2800,
      stock: 156,
      lowStockThreshold: 20,
      status: 'in_stock',
      variants: [
        { id: 'v1', name: 'Space Gray', sku: 'UCH-PREM-001-SG', stock: 156, price: 3500 }
      ],
      platforms: {
        website: { active: true, price: 3500, stock: 156 },
        amazon: { active: true, price: 3600, stock: 156 },
        flipkart: { active: true, price: 3550, stock: 156 }
      },
      createdAt: '2024-01-10T11:45:00Z',
      updatedAt: '2024-01-24T09:30:00Z'
    }
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const params = { 
        page, 
        page_size: pagination.pageSize
      };
      
      // Add filters to API params
      if (currentFilters.search) {
        params.search = currentFilters.search;
      }
      if (currentFilters.category && currentFilters.category !== 'all') {
        params.category = currentFilters.category;
      }
      if (currentFilters.status && currentFilters.status !== 'all') {
        params.status = currentFilters.status;
      }
      if (currentFilters.stockLevel && currentFilters.stockLevel !== 'all') {
        params.stock_level = currentFilters.stockLevel;
      }
      
      const response = await adminAPI.getAllProducts(params);
      const productsData = response.data.results || response.data;
      setProducts(productsData);
      setFilteredProducts(productsData);
      setPagination({
        ...pagination,
        page,
        total: response.data.count || productsData.length,
        totalPages: Math.ceil((response.data.count || productsData.length) / pagination.pageSize)
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Debounce search and refetch products when filters change
    const timeoutId = setTimeout(() => {
      fetchProducts(1, filters);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Remove client-side filtering since we're using backend filtering
  // const applyFilters = () => {
  //   let filtered = products.filter(product => {
  //     const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
  //                          product.sku.toLowerCase().includes(filters.search.toLowerCase());
  //     
  //     const matchesCategory = filters.category === 'all' || product.category === filters.category;
  //     const matchesStatus = filters.status === 'all' || product.status === filters.status;
  //     
  //     let matchesStockLevel = true;
  //     if (filters.stockLevel === 'low') {
  //       matchesStockLevel = product.is_low_stock;
  //     } else if (filters.stockLevel === 'out') {
  //       matchesStockLevel = product.is_out_of_stock;
  //     } else if (filters.stockLevel === 'in') {
  //       matchesStockLevel = !product.is_low_stock && !product.is_out_of_stock;
  //     }

  //     return matchesSearch && matchesCategory && matchesStatus && matchesStockLevel;
  //   });

  //   setFilteredProducts(filtered);
  // };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.warning('Please select products first');
      return;
    }

    switch (action) {
      case 'export':
        toast.success(`Exporting ${selectedProducts.length} products`);
        break;
      case 'update_stock':
        toast.success(`Stock updated for ${selectedProducts.length} products`);
        break;
      case 'update_price':
        toast.success(`Prices updated for ${selectedProducts.length} products`);
        break;
      case 'sync':
        await handleBulkSync();
        break;
      case 'delete':
        if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
          setProducts(products.filter(product => !selectedProducts.includes(product.id)));
          setSelectedProducts([]);
          toast.success('Products deleted successfully');
        }
        break;
    }
  };

  const handleBulkSync = async () => {
    setSyncing(true);
    try {
      const platformsResponse = await adminAPI.getPlatforms();
      const wooConnection = platformsResponse.data.results?.find(p => p.platform_type === 'woocommerce' && p.is_active);
      
      if (!wooConnection) {
        toast.error('No active WooCommerce connection found');
        return;
      }

      await adminAPI.syncPlatform(wooConnection.id, { sync_type: 'products', force: true });
      toast.success('Products synced from WooCommerce successfully');
      fetchProducts(pagination.page);
    } catch (error) {
      console.error('Bulk sync error:', error);
      toast.error('Failed to sync products');
    }
    setSyncing(false);
  };

  const handleProductAction = async (productId, action) => {
    const product = products.find(p => p.id === productId);
    
    switch (action) {
      case 'view':
        setSelectedProduct(product);
        setEditMode(false);
        setShowProductModal(true);
        break;
      case 'edit':
        setSelectedProduct(product);
        setEditForm({
          name: product.name,
          sku: product.sku,
          description: product.description || '',
          category: product.category || '',
          price: product.price,
          regular_price: product.regular_price || '',
          sale_price: product.sale_price || '',
          stock_quantity: product.stock_quantity,
          low_stock_threshold: product.low_stock_threshold || 10,
          is_active: product.is_active
        });
        setEditMode(true);
        setShowProductModal(true);
        break;
      case 'sync':
        await handleSyncProduct(product);
        break;
      case 'delete':
        if (window.confirm(`Delete ${product.name}?`)) {
          await handleDeleteProduct(productId);
        }
        break;
    }
  };

  const handleSyncProduct = async (product) => {
    if (!product.platform || product.platform === 'manual') {
      toast.warning('Product is not linked to any platform');
      return;
    }

    setSyncing(true);
    try {
      await adminAPI.syncProduct(product.id);
      toast.success(`${product.name} synced successfully`);
      fetchProducts(pagination.page);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync product');
    }
    setSyncing(false);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await adminAPI.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    setSaving(true);
    try {
      const response = await adminAPI.updateProduct(selectedProduct.id, editForm);
      
      // Update local state
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...p, ...response.data } : p
      ));
      
      // If product has platform connection, sync to platform
      if (selectedProduct.platform && selectedProduct.platform !== 'manual') {
        try {
          await adminAPI.syncProduct(selectedProduct.id);
          toast.success('Product updated and synced to platform');
        } catch (syncError) {
          console.error('Sync error:', syncError);
          toast.success('Product updated (sync failed)');
        }
      } else {
        toast.success('Product updated successfully');
      }
      
      setShowProductModal(false);
      setEditMode(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to update product');
    }
    setSaving(false);
  };

  const getStockStatus = (product) => {
    if (product.is_out_of_stock) return 'out_of_stock';
    if (product.is_low_stock) return 'low_stock';
    return 'in_stock';
  };

  const getStockBadge = (product) => {
    const status = getStockStatus(product);
    const statusObj = stockStatuses.find(s => s.id === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusObj?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusObj?.name || status}
      </span>
    );
  };

  const getStockIcon = (product) => {
    const status = getStockStatus(product);
    switch (status) {
      case 'in_stock': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'low_stock': return <Warning className="h-4 w-4 text-yellow-500" />;
      case 'out_of_stock': return <Error className="h-4 w-4 text-red-500" />;
      default: return <Inventory className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    if (!category) return '📦';
    const cat = category.toLowerCase();
    
    // Electronics & Tech
    if (cat.includes('electronic') || cat.includes('tech') || cat.includes('gadget') || cat.includes('phone') || cat.includes('computer')) return '📱';
    // Clothing & Fashion
    if (cat.includes('cloth') || cat.includes('fashion') || cat.includes('apparel') || cat.includes('wear') || cat.includes('shirt') || cat.includes('dress')) return '👕';
    // Home & Garden
    if (cat.includes('home') || cat.includes('house') || cat.includes('furniture') || cat.includes('decor') || cat.includes('garden')) return '🏠';
    // Books & Media
    if (cat.includes('book') || cat.includes('media') || cat.includes('literature') || cat.includes('magazine')) return '📚';
    // Sports & Fitness
    if (cat.includes('sport') || cat.includes('fitness') || cat.includes('exercise') || cat.includes('outdoor') || cat.includes('gym')) return '⚽';
    // Beauty & Health
    if (cat.includes('beauty') || cat.includes('cosmetic') || cat.includes('skincare') || cat.includes('makeup') || cat.includes('health')) return '💄';
    // Toys & Games
    if (cat.includes('toy') || cat.includes('game') || cat.includes('kid') || cat.includes('children') || cat.includes('play')) return '🧸';
    // Automotive
    if (cat.includes('auto') || cat.includes('car') || cat.includes('vehicle') || cat.includes('motor')) return '🚗';
    // Food & Beverages
    if (cat.includes('food') || cat.includes('grocery') || cat.includes('snack') || cat.includes('beverage') || cat.includes('drink')) return '🍎';
    // Jewelry & Accessories
    if (cat.includes('jewelry') || cat.includes('accessory') || cat.includes('watch') || cat.includes('bag')) return '💎';
    
    return '📦';
  };

  const getLowStockCount = () => {
    return products.filter(p => p.is_low_stock).length;
  };

  const getOutOfStockCount = () => {
    return products.filter(p => p.is_out_of_stock).length;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product & Inventory Management</h1>
          <p className="text-gray-600">Centralized product catalog with real-time stock synchronization</p>
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
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CloudUpload className="h-4 w-4" />
            <span>Import</span>
          </button>
          
          <button
            onClick={() => handleBulkAction('export')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <GetApp className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={handleBulkSync}
            disabled={syncing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Refresh className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync All'}</span>
          </button>
          
          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stock Alerts */}
      {(getLowStockCount() > 0 || getOutOfStockCount() > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Warning className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Stock Alerts</p>
              <p className="text-yellow-700 text-sm">
                {getLowStockCount() > 0 && `${getLowStockCount()} products are running low on stock. `}
                {getOutOfStockCount() > 0 && `${getOutOfStockCount()} products are out of stock.`}
              </p>
            </div>
            <button
              onClick={() => setFilters({...filters, stockLevel: 'low'})}
              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
            >
              View Low Stock
            </button>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Product name, SKU..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
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
                {stockStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
              <select
                value={filters.stockLevel}
                onChange={(e) => setFilters({...filters, stockLevel: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedProducts.length} products selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('update_stock')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Update Stock
              </button>
              <button
                onClick={() => handleBulkAction('update_price')}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                Update Price
              </button>
              <button
                onClick={() => handleBulkAction('sync')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Sync Platforms
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
              >
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button onClick={handleSelectAll}>
                    {selectedProducts.length === filteredProducts.length ? 
                      <CheckBox className="h-5 w-5 text-blue-600" /> : 
                      <CheckBoxOutlineBlank className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platforms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button onClick={() => handleSelectProduct(product.id)}>
                      {selectedProducts.includes(product.id) ? 
                        <CheckBox className="h-5 w-5 text-blue-600" /> : 
                        <CheckBoxOutlineBlank className="h-5 w-5 text-gray-400" />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product.primary_image ? (
                          <img 
                            src={product.primary_image} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded-lg" 
                          />
                        ) : (
                          <Inventory className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            product.platform === 'woocommerce' ? 'bg-purple-500' :
                            product.platform === 'shopify' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`} />
                          <span className="text-xs text-gray-400 capitalize">{product.platform || 'manual'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(product.category)}</span>
                      <span className="text-sm capitalize">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStockIcon(product)}
                      <div>
                        <div className="font-medium">{product.stock_quantity || 0}</div>
                        <div className="text-xs text-gray-500">Status: {product.stock_status}</div>
                      </div>
                    </div>
                    <div className="mt-1">
                      {getStockBadge(product)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">₹{product.price}</div>
                    {product.regular_price && (
                      <div className="text-sm text-gray-500">Regular: ₹{product.regular_price}</div>
                    )}
                    {product.sale_price && (
                      <div className="text-sm text-green-600">Sale: ₹{product.sale_price}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium">No variants</div>
                      <div className="text-gray-500 text-xs">Single product</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        product.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Platform: {product.platform || 'Manual'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleProductAction(product.id, 'view')}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Details"
                      >
                        <Visibility className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleProductAction(product.id, 'edit')}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleProductAction(product.id, 'sync')}
                        disabled={syncing}
                        className="p-1 text-purple-600 hover:bg-purple-100 rounded disabled:opacity-50"
                        title="Sync Platforms"
                      >
                        <Refresh className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleProductAction(product.id, 'delete')}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete Product"
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg border p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} products
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchProducts(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      pageNum === pagination.page 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Bulk Import Products</h2>
              <button onClick={() => setShowImportModal(false)}>
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drop your CSV file here or click to browse</p>
                  <input type="file" accept=".csv" className="hidden" />
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">CSV Format Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Name, SKU, Category, Price, Stock columns required</li>
                  <li>Use comma-separated values</li>
                  <li>First row should contain headers</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Products imported successfully!');
                  setShowImportModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details/Edit Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editMode ? 'Edit Product' : 'Product Details'} - {selectedProduct.name}
              </h2>
              <div className="flex items-center space-x-2">
                {!editMode && (
                  <button
                    onClick={() => {
                      setEditForm({
                        name: selectedProduct.name,
                        sku: selectedProduct.sku,
                        description: selectedProduct.description || '',
                        category: selectedProduct.category || '',
                        price: selectedProduct.price,
                        regular_price: selectedProduct.regular_price || '',
                        sale_price: selectedProduct.sale_price || '',
                        stock_quantity: selectedProduct.stock_quantity,
                        low_stock_threshold: selectedProduct.low_stock_threshold || 10,
                        is_active: selectedProduct.is_active
                      });
                      setEditMode(true);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => {
                  setShowProductModal(false);
                  setEditMode(false);
                }}>
                  <span className="text-gray-400 text-xl">×</span>
                </button>
              </div>
            </div>
            
            {editMode ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={editForm.sku}
                      onChange={(e) => setEditForm({...editForm, sku: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.regular_price}
                      onChange={(e) => setEditForm({...editForm, regular_price: parseFloat(e.target.value) || ''})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.sale_price}
                      onChange={(e) => setEditForm({...editForm, sale_price: parseFloat(e.target.value) || ''})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editForm.stock_quantity}
                      onChange={(e) => setEditForm({...editForm, stock_quantity: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                    <input
                      type="number"
                      value={editForm.low_stock_threshold}
                      onChange={(e) => setEditForm({...editForm, low_stock_threshold: parseInt(e.target.value) || 10})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Product</span>
                  </label>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-6">
                  {/* Product Images */}
                  <div>
                    <h3 className="font-medium mb-2">Product Images</h3>
                    <div className="space-y-2">
                      {selectedProduct.primary_image ? (
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={selectedProduct.primary_image} 
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Inventory className="h-12 w-12 text-gray-400" />
                          <span className="ml-2 text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Basic Information */}
                  <div>
                    <h3 className="font-medium mb-2">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedProduct.name}</p>
                      <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                      <p><strong>Category:</strong> {getCategoryIcon(selectedProduct.category)} {selectedProduct.category}</p>
                      <p><strong>Description:</strong> {selectedProduct.description || 'No description'}</p>
                      {selectedProduct.short_description && (
                        <p><strong>Short Description:</strong> {selectedProduct.short_description}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Pricing & Stock */}
                  <div>
                    <h3 className="font-medium mb-2">Pricing & Stock</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                      {selectedProduct.regular_price && (
                        <p><strong>Regular Price:</strong> ₹{selectedProduct.regular_price}</p>
                      )}
                      {selectedProduct.sale_price && (
                        <p><strong>Sale Price:</strong> ₹{selectedProduct.sale_price}</p>
                      )}
                      <p><strong>Stock:</strong> {selectedProduct.stock_quantity}</p>
                      <p><strong>Status:</strong> {selectedProduct.stock_status}</p>
                      <p><strong>Low Stock Alert:</strong> {selectedProduct.low_stock_threshold}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Platform Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm"><strong>Platform:</strong> {selectedProduct.platform || 'Manual'}</p>
                        <p className="text-sm"><strong>Status:</strong> {selectedProduct.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                      {selectedProduct.platform && selectedProduct.platform !== 'manual' && (
                        <button
                          onClick={() => handleSyncProduct(selectedProduct)}
                          disabled={syncing}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                        >
                          {syncing ? 'Syncing...' : 'Sync Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Plus, Pencil } from 'lucide-react';
import { OrderItem, Product } from '../lib/types';

function SalesOrders() {
  const { state, dispatch } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    items: [] as { productId: string; quantity: number }[],
  });

  const resetForm = () => {
    setFormData({
      notes: '',
      items: [],
    });
  };

  const calculateTotal = (items: { productId: string; quantity: number }[]) => {
    return items.reduce((total, item) => {
      const product = state.products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    
    const orderItems: OrderItem[] = formData.items.map(item => ({
      id: crypto.randomUUID(),
      orderId: '', // Will be set after order creation
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: state.products.find(p => p.id === item.productId)?.price || 0,
      createdAt: now,
    }));

    const order = {
      id: crypto.randomUUID(),
      status: 'PENDING' as const,
      totalAmount: calculateTotal(formData.items),
      notes: formData.notes,
      createdAt: now,
      updatedAt: now,
      items: orderItems,
    };

    // Update order ID in items
    order.items = orderItems.map(item => ({ ...item, orderId: order.id }));

    dispatch({
      type: 'ADD_SALES_ORDER',
      payload: order,
    });

    // Create stock movements for each item
    formData.items.forEach(item => {
      dispatch({
        type: 'ADD_STOCK_MOVEMENT',
        payload: {
          id: crypto.randomUUID(),
          productId: item.productId,
          type: 'OUT',
          quantity: item.quantity,
          notes: `Order: ${order.id}`,
          createdAt: now,
        },
      });
    });
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleUpdateStatus = (orderId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    const order = state.salesOrders.find(o => o.id === orderId);
    if (order) {
      dispatch({
        type: 'UPDATE_SALES_ORDER',
        payload: {
          ...order,
          status: newStatus,
          updatedAt: new Date(),
        },
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Orders</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.salesOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => {
                      const product = state.products.find(p => p.id === item.productId);
                      return (
                        <li key={item.id}>
                          {product?.name}: {item.quantity} x ${item.unitPrice.toFixed(2)}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {order.status === 'PENDING' && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {state.salesOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No orders found. Create your first order!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">New Sales Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Order Items</label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      + Add Item
                    </button>
                  </div>
                  
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start mt-2">
                      <div className="flex-grow">
                        <select
                          required
                          value={item.productId}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[index] = { ...item, productId: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select a product</option>
                          {state.products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (${product.price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[index] = { ...item, quantity: parseInt(e.target.value) };
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="mt-1 text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {formData.items.length > 0 && (
                  <div className="text-right text-lg font-semibold">
                    Total: ${calculateTotal(formData.items).toFixed(2)}
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formData.items.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesOrders;
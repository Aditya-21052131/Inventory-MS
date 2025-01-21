import React from 'react';
import { Package, Users, ArrowLeftRight, ShoppingCart } from 'lucide-react';
import { useStore } from '../lib/store';

function Dashboard() {
  const { state } = useStore();
  
  const lowStockProducts = state.products.filter(
    product => product.currentStock <= product.minStockLevel
  );
  
  const recentOrders = state.salesOrders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Products"
          value={state.products.length.toString()}
          icon={Package}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Total Suppliers"
          value={state.suppliers.length.toString()}
          icon={Users}
          color="bg-green-500"
        />
        <DashboardCard
          title="Stock Movements"
          value={state.stockMovements.length.toString()}
          icon={ArrowLeftRight}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Sales Orders"
          value={state.salesOrders.length.toString()}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
          {lowStockProducts.length > 0 ? (
            <ul className="space-y-2">
              {lowStockProducts.map(product => (
                <li key={product.id} className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <span className="text-red-500">Stock: {product.currentStock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No low stock alerts</div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <ul className="space-y-2">
              {recentOrders.map(order => (
                <li key={order.id} className="flex justify-between items-center">
                  <span>Order #{order.id.slice(0, 8)}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No recent orders</div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

function DashboardCard({ title, value, icon: Icon, color }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
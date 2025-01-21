import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ArrowLeftRight,
  ShoppingCart
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/suppliers', label: 'Suppliers', icon: Users },
  { path: '/stock-movements', label: 'Stock Movements', icon: ArrowLeftRight },
  { path: '/sales-orders', label: 'Sales Orders', icon: ShoppingCart },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Inventory MS
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
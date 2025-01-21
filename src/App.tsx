import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import StockMovements from './pages/StockMovements';
import SalesOrders from './pages/SalesOrders';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/stock-movements" element={<StockMovements />} />
            <Route path="/sales-orders" element={<SalesOrders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
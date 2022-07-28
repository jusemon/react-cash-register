import * as React from 'react';
import { FaCashRegister, FaMoneyCheckAlt, FaListAlt } from 'react-icons/fa';

import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import './style.css';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SaleList from './components/SaleList';
import SaleForm from './components/SaleForm';

export default function App() {
  const isNavigationActiveClass = ({ isActive }: { isActive: boolean }) =>
    `app-navigation-item ${isActive ? 'selected' : undefined}`;

  return (
    <div className="app">
      <h1 className="app-title">
        <FaCashRegister className="app-title-icon" />
        Cash Register
      </h1>
      <div className="app-navigation">
        <div className="app-navigation-items">
          <NavLink className={isNavigationActiveClass} to="/sales">
            <FaMoneyCheckAlt className="app-navigation-icon" /> Sales
          </NavLink>
          <NavLink className={isNavigationActiveClass} to="/products">
            <FaListAlt className="app-navigation-icon" /> Products
          </NavLink>
        </div>
        <div className="app-navigation-content">
          <Routes>
            <Route path="/" element={<Navigate replace to="/sales" />} />
            <Route path="sales" element={<SaleList />} />
            <Route path="sales/sale/new" element={<SaleForm />} />
            <Route path="sales/sale/:id" element={<SaleForm />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/product/new" element={<ProductForm />} />
            <Route path="products/product/:id" element={<ProductForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

import * as React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { API } from '../config/constants';
import { currency } from '../utils/format';
import { Product } from './ProductList';

export interface ProductSale {
  productSaleId: number;
  productId: number;
  saleId: number;
  price: number;
  quantity: number;
  product: Product;
}

export interface Sale {
  saleId: number;
  date: string;
  total: number;
  isLoan: boolean;
  apartmentNumber: string;
  payment: number;
  productSales: ReadonlyArray<ProductSale>;
}

export default function SaleList() {
  const [sales, setSales] = React.useState<ReadonlyArray<Sale>>([]);

  const getSales = React.useCallback(async () => {
    try {
      const response = await axios.get(`${API}/Sale`);
      setSales([...response.data]);
    } catch (e) {
      console.error(e);
    }
  }, [setSales]);

  React.useEffect(() => {
    getSales();
  }, [getSales]);

  return (
    <div className="sale-list">
      <NavLink to="/sales/sale/new">
        <button className="btn btn-accent" onClick={() => {}}>
          Add
        </button>
      </NavLink>
      <table className="sale-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Total</th>
            <th>Is Loan</th>
            <th>Apartment Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale, i) => (
              <tr key={i} className={i % 2 === 1 ? 'odd' : undefined}>
                <td>{sale.saleId}</td>
                <td className="center">{sale.date}</td>
                <td className="end">{currency(sale.total)}</td>
                <td className="end">{sale.isLoan ? 'Yes' : 'No'}</td>
                <td className="end">{sale.apartmentNumber}</td>
                <td className="center">
                  <NavLink to={`/sales/sale/${sale.saleId.toString()}`}>
                    <button className="btn btn-edit">Edit</button>
                  </NavLink>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="center" colSpan={6}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

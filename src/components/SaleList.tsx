import * as React from 'react';
import axios from 'axios';
import Loading from 'react-loading';
import { NavLink } from 'react-router-dom';
import { API } from '../config/constants';
import { currency, date, identifier } from '../utils/format';
import { Product } from './ProductList';
import { FaPlusCircle } from 'react-icons/fa';

type Dict<TValue> = {
  [key: string]: TValue
}

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
  const [showDetail, setShowDetail] = React.useState<Dict<boolean>>({});
  const [isLoading, setLoading] = React.useState(false);

  const getSales = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ReadonlyArray<Sale>>(`${API}/Sale`);
      setSales([...response.data]);
      setShowDetail(response.data.reduce<Dict<boolean>>((dict, sale) => ({ ...dict, [sale.saleId]: false }), {}))
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [setSales, setLoading, setShowDetail]);

  React.useEffect(() => {
    getSales();
  }, [getSales]);

  return (
    <div className="sale-list">
      <NavLink to="/sales/sale/new">
        <button className="btn btn-accent" onClick={() => { }}>
          Add
        </button>
      </NavLink>
      <table className="sale-table">
        <thead>
          <tr>
            <th></th>
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
                <td>
                  <FaPlusCircle className={`btn-icon ${showDetail[sale.saleId] ? 'rotate' : ''}`} onClick={() =>
                    setShowDetail({ ...showDetail, [sale.saleId]: !showDetail[sale.saleId] })
                  } />
                </td>
                <td className="center">
                  {identifier(sale.saleId)}
                </td>
                <td className="start">{date(sale.date)}</td>
                <td className="end">{currency(sale.total)}</td>
                <td className="end">{sale.isLoan ? 'Yes' : 'No'}</td>
                <td className="end">{sale.apartmentNumber}</td>
                <td className="center">
                  <NavLink to={`/sales/sale/${sale.saleId}`}>
                    <button disabled={sale.payment > 0} className="btn btn-edit">Edit</button>
                  </NavLink>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="center" colSpan={6}>
                {isLoading ? (
                  <Loading type='spinningBubbles' className='primary-spinner' />
                ) : (
                  <>No data available</>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import * as React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { API } from '../config/constants';
import { currency } from '../utils/format';

export interface Product {
  productId: number;
  name: string;
  salePrice: number;
  buyPrice: number;
  quantity: number;
  isActive: boolean;
}

export default function ProductList() {
  const [products, setProducts] = React.useState<ReadonlyArray<Product>>([]);

  const getProducts = React.useCallback(async () => {
    try {
      const response = await axios.get(`${API}/Product`);
      setProducts([...response.data]);
    } catch (e) {
      console.error(e);
    }
  }, [setProducts]);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  const onToggleClick = (id: number) => {
    axios
      .patch(`${API}/Product/Toggle/${id.toString()}`)
      .then((_) => getProducts())
      .catch((e) => console.error(e));
  };

  return (
    <div className="product-list">
      <NavLink to="/products/product/new">
        <button className="btn btn-accent" onClick={() => {}}>
          Add
        </button>
      </NavLink>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sale Price</th>
            <th>Buy Price</th>
            <th>Quantity</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, i) => (
              <tr key={i} className={i % 2 === 1 ? 'odd' : undefined}>
                <td>{product.name}</td>
                <td className="end">{currency(product.salePrice)}</td>
                <td className="end">{currency(product.buyPrice)}</td>
                <td className="end">{product.quantity}</td>
                <td className="center">{product.isActive ? 'Yes' : 'No'}</td>
                <td className="center">
                  <NavLink
                    to={`/products/product/${product.productId.toString()}`}
                  >
                    <button className="btn btn-edit">Edit</button>
                  </NavLink>
                  <button
                    className="btn btn-accent"
                    onClick={() => onToggleClick(product.productId)}
                  >
                    {product.isActive ? 'Inactivate' : 'Activate'}
                  </button>
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

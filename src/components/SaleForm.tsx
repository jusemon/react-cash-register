import * as React from 'react';
import axios from 'axios';
import Select from 'react-select';
import Loading from 'react-loading';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../config/constants';
import { Product } from './ProductList';
import { currency, identifier } from '../utils/format';
import { Sale } from './SaleList';

export interface ProductSaleFormFields {
  productId: number;
  quantity: number;
  productSaleId?: number;
  saleId?: number;
  price?: number;
  product?: Product;
}

export interface SaleFormFields {
  isLoan: boolean;
  apartmentNumber: string;
  payment: number;
  productSales: ReadonlyArray<ProductSaleFormFields>;
  change: number;
  saleId?: number;
  date?: string;
  total?: number;
}

export interface Option extends Product {
  label: string;
  value: number;
  isDisabled: boolean;
}

export default function SaleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<ReadonlyArray<Option>>([]);
  const [saleForm, setSaleForm] = React.useState<SaleFormFields>({
    isLoan: false,
    apartmentNumber: '',
    payment: 0,
    change: 0,
    productSales: [{ productId: 0, quantity: 1, price: 0 }],
    total: 0
  });

  const getProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ReadonlyArray<Product>>(
        `${API}/Product`
      );
      setProducts([
        ...response.data.map((product) => ({
          ...product,
          label: product.name,
          value: product.productId,
          isDisabled: !product.isActive,
        })),
      ]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [setProducts, setLoading]);

  const getSale = React.useCallback(async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await axios.get<Sale>(`${API}/Sale/${id}`);
        setSaleForm({ ...response.data, change: 0 });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [id, setSaleForm, setLoading]);

  const createSale = React.useCallback(async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/Sale`, saleForm);
      navigate('../sales', { replace: true });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [saleForm, navigate]);

  const updateSale = React.useCallback(async () => {
    setLoading(true);
    try {
      await axios.put(`${API}/Sale/${saleForm.saleId}`, saleForm);
      navigate('../sales', { replace: true });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [saleForm, navigate]);

  React.useEffect(() => {
    getProducts();
    if (id) {
      setEditMode(true)
      getSale();
    }
  }, [id, getProducts, getSale, setEditMode]);

  const onSaveClick = () => {
    if (id) {
      updateSale();
    } else {
      createSale();
    }
  };

  const setProductSale =
    (index: number) => (productSale: Partial<ProductSaleFormFields>) => {
      const productSales = [...saleForm.productSales];
      productSales[index] = {
        ...productSales[index],
        ...productSale,
      };
      const total = productSales.reduce(
        (sum, ps) => sum + (ps.price || 0) * ps.quantity,
        0
      );
      setSaleForm({ ...saleForm, total, productSales });
    };

  return (
    isLoading ? (
      <div className="center-all">
        <Loading type='spinningBubbles' className='primary-spinner' />
      </div>
    ) : (
      <div className="sale-form">
        <div className="sale-form-header">
          <h2>{editMode ? `Edit Sale ${identifier(saleForm.saleId || 0)}` : 'Register Sale'}</h2>
        </div>
        <div className="sale-form-main">
          
          <div className="form-group">
            <div className="form-group-header">
              <div className="form-title">Products</div>
              <button
                className="btn-tiny"
                disabled={editMode}
                onClick={() =>
                  setSaleForm({
                    ...saleForm,
                    productSales: [
                      ...saleForm.productSales,
                      { productId: 0, quantity: 0 },
                    ],
                  })
                }
              >
                +
              </button>
            </div>
            <div className="form-group-body">
              {saleForm.productSales.map((productSale, index) => (
                <div key={index} className="form-field">
                  <Select
                    isDisabled={editMode}
                    className="select"
                    options={products}
                    value={products.find(
                      (p) => p.productId === productSale?.productId
                    )}
                    onChange={(selected) =>
                      setProductSale(index)({
                        productId: selected?.productId,
                        price: selected?.salePrice,
                        quantity: 0,
                      })
                    }
                  />
                  <input
                    readOnly
                    className="medium"
                    value={currency(productSale?.price || 0)}
                  />
                  <input
                    className="tiny"
                    disabled={editMode}
                    value={productSale?.quantity}
                    min={1}
                    onChange={(e) =>
                      setProductSale(index)({
                        quantity: parseInt(e.target.value),
                      })
                    }
                    type="number"
                  />
                  <button
                    className="btn-tiny btn-accent"
                    disabled={editMode}
                    onClick={() =>
                      setSaleForm({
                        ...saleForm,
                        productSales: [
                          ...saleForm.productSales.filter((_, i) => i !== index),
                        ],
                      })
                    }
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label>Total</label>
            <input readOnly value={saleForm.total} type="number" />
          </div>
          <div className="form-field">
            <label>Is Loan</label>
            <div className="center width-100">
              <input
                disabled={editMode}
                checked={saleForm.isLoan}
                onChange={(e) =>
                  setSaleForm({
                    ...saleForm,
                    isLoan: e.target.checked,
                  })
                }
                type="checkbox"
              />
            </div>
          </div>
          {(!saleForm.isLoan || editMode) && (
            <React.Fragment>
            <div className="form-field">
              <label>Payment</label>
              <input
                value={saleForm.payment}
                onChange={(e) =>
                  setSaleForm({
                    ...saleForm,
                    change: parseInt(e.target.value) - (saleForm.total || 0),
                    payment: parseInt(e.target.value),
                  })
                }
                type="number"
              />
            </div>
            <div className="form-field">
              <label>Change</label>
              <input
                readOnly
                value={saleForm.change > 0 ? saleForm.change : 0}
                type="number"
              />
            </div>
            </React.Fragment>
          )}
          {saleForm?.isLoan && (
            <div className="form-field">
              <label>Apartment Number</label>
              <input
                value={saleForm.apartmentNumber}
                onChange={(e) =>
                  setSaleForm({
                    ...saleForm,
                    apartmentNumber: e.target.value,
                  })
                }
                type="text"
              />
            </div>
          )}
        </div>
        <div className="sale-form-footer">
          <button
            className="btn btn-accent"
            onClick={() => navigate('../sales', { replace: true })}
          >
            Cancel
          </button>
          <button className="btn" onClick={() => onSaveClick()}>
            Save
          </button>
        </div>
      </div>
    )
  );
}

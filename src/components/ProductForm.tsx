import * as React from 'react';
import axios from 'axios';
import Loading from 'react-loading';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../config/constants';

export interface ProductFormFields {
  productId?: number;
  name: string;
  salePrice: number;
  buyPrice: number;
  quantity: number;
  isActive?: boolean;
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = React.useState(false);
  const [productForm, setProductForm] = React.useState<ProductFormFields>({
    buyPrice: 0,
    quantity: 0,
    name: '',
    salePrice: 0,
  });

  const getProduct = React.useCallback(async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await axios.get(`${API}/Product/${id}`);
        setProductForm({ ...response.data });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [id, setProductForm, setLoading]);

  
  const createProduct = React.useCallback(async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/Product`, productForm);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [productForm, setLoading]);
  
  const updateProduct = React.useCallback(async () => {
    setLoading(true);
    try {
      await axios.put(`${API}/Product/${productForm.productId}`, productForm);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [productForm, setLoading]);
  
  React.useEffect(() => {
    getProduct();
  }, [getProduct]);

  const onSaveClick = async () => {
    if (id) {
      await updateProduct();
    } else {
      await createProduct();
    }
    navigate('../products', { replace: true });
  };

  return (
    isLoading ? (
      <div className="center-all">
        <Loading type='spinningBubbles' className='primary-spinner' />
      </div>
    ) : (
      <div className="product-form">
        <div className="product-form-header">
          <h2>{id ? 'Edit Product' : 'Register Product'}</h2>
        </div>
        <div className="product-form-main">
          <div className="form-field">
            <label>Name</label>
            <input
              value={productForm?.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
              type="text"
            />
          </div>
          <div className="form-field">
            <label>Sale Price</label>
            <input
              value={productForm?.salePrice}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  salePrice: parseInt(e.target.value),
                })
              }
              type="number"
            />
          </div>
          <div className="form-field">
            <label>Buy Price</label>
            <input
              value={productForm?.buyPrice}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  buyPrice: parseInt(e.target.value),
                })
              }
              type="number"
            />
          </div>
          <div className="form-field">
            <label>Quantity</label>
            <input
              value={productForm?.quantity}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  quantity: parseInt(e.target.value),
                })
              }
              type="number"
            />
          </div>
        </div>
        <div className="product-form-footer">
          <button
            className="btn btn-accent"
            onClick={() => navigate('../products', { replace: true })}
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

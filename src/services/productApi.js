import axios from 'axios';
import { BASE_URL } from '../utils';


const getToken = () => localStorage.getItem('token');

const productApi = {
  fetchProducts: async (page, limit = 5) => {
    const response = await axios.get(`${BASE_URL}/product/all?page=${page}&limit=${limit}`, {
      headers: { Authorization: getToken() }
    });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axios.post(`${BASE_URL}/product/create`, productData, {
      headers: { Authorization: getToken() }
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axios.patch(`${BASE_URL}/product/update/${id}`, productData, {
      headers: { Authorization: getToken() }
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`${BASE_URL}/product/delete/${id}`, {
      headers: { Authorization: getToken() }
    });
    return response.data;
  }
};

export default productApi;
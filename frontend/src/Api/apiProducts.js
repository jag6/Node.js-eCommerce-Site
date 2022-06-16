import axios from "axios";
import { apiUrl } from "../config.js";
import { getUserInfo } from "../localStorage.js";

export const getProducts = async ({}) => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/products`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.statusText !== 'OK'){
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const getProduct = async (id) => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/products/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.statusText !== 'OK'){
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const createProduct = async () => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/products`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        if(response.statusText !== 'Created') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const deleteProduct = async (productId) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/products/${productId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const updateProduct = async (product) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/products/${product._id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: product,
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const uploadProductImage = async (formData) => {
    try{
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/uploads/s3`,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
            data: formData,
        });
        if(response.statusText !== 'Created') {
            throw new Error(response.data.message);
        }else {
            return response.data;
        }
    }catch (err) {
        return {error: err.response && err.response.data && err.response.data.message?  err.response.data.message : err.message};
    }
};

export const createReview = async (productId, review) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/products/${productId}/reviews`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: review,
        });
        if(response.statusText !== 'Created') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};
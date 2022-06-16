import axios from "axios";
import { apiUrl } from "../config.js";
import { getUserInfo } from "../localStorage.js";

export const getBanners = async () => {
    try{
        const response = await axios({
            url: `${apiUrl}/api/banners`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const getBanner = async (id) => {
    try{
        const response = await axios({
            url: `${apiUrl}/api/banners/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const createBanner = async () => {
    try{
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/banners`,
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

export const deleteBanner = async (bannerId) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/banners/${bannerId}`,
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

export const updateBanner = async (banner) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/banners/${banner._id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: banner,
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        return {error: err.response.data.message || err.message};
    }
};

export const uploadBannerImage = async (formData) => {
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
        return {error: err.response.data.message || err.message};
    }
};
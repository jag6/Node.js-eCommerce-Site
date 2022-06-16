import axios from "axios";
import { apiUrl } from "../config.js";
import { getUserInfo } from "../localStorage.js";

export const signin = async ({email, password}) => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/users/signin`,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                email,
                password
            }
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
};

export const register = async ({name, email, password}) => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/users/register`,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                name,
                email,
                password
            }
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
};

export const update = async ({name, email, password}) => {
    try {
        const {_id, token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/users/${_id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: {
                name,
                email,
                password
            }
        });
        if(response.statusText !== 'OK') {
            throw new Error(response.data.message);
        }
        return response.data;
    }catch (err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
};

export const getUsers = async () => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/users`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        if(response.statusText !== 'OK'){
            throw new Error(response.data.message);
        }
        return response.data;
    }catch(err) {
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
};

export const getUser = async (id) => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/users/${id}`,
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

export const deleteUser = async (userId) => {
    try {
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/users/${userId}`,
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
import axios from "axios";
import { apiUrl } from "../config.js";
import { getUserInfo } from "../localStorage.js";

export const getSummary = async () => {
    try{
        const {token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/orders/summary`,
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
        return {error: err.response ? err.response.data.message: err.message};
    }
};
import axios from "axios";
import { apiUrl } from "../config.js";

export const getSearch = async ({searchKeyword = ''}) => {
    try{
        let queryString = '?';
        if (searchKeyword) queryString += `searchKeyword=${searchKeyword}&`;
        const response = await axios({
            url: `${apiUrl}/api/search${queryString}`,
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
        return {error: err.response ? err.response.data.message: err.message};
    }
};
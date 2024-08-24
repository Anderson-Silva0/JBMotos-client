import axios from "axios";

export const ApiService = axios.create({
    baseURL: process.env.NGROK_URL + "/api",
    headers: { 
        'ngrok-skip-browser-warning': 'true' 
    }
});
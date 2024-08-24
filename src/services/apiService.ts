import axios from "axios";

export const ApiService = axios.create({
    baseURL: "https://9854-168-194-66-123.ngrok-free.app/api",
    headers: { 
        'ngrok-skip-browser-warning': 'true' 
    }
});
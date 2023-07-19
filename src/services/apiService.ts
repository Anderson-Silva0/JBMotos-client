import axios from "axios";

export const ApiService = axios.create({
    baseURL: process.env.JBMOTOS_APP_API_BASE_URL
})

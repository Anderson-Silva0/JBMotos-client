import axios from "axios"

export const ApiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NGROK_URL + "/api",
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
})

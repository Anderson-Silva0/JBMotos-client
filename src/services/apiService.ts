import axios from "axios"
import Cookies from "js-cookie"

export const ApiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api",
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
})

ApiService.interceptors.request.use(
    config => {
        const token = Cookies.get('login-token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

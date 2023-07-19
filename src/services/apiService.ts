import axios from "axios"

export const ApiService = axios.create({
    baseURL: "https://45ea-168-194-66-92.ngrok.io/api"
})
